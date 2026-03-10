import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { MODULES, isLessonAccessible } from '../data/lessons';
import { LessonsPageSkeleton } from '../components/Skeleton';
import { OutOfHeartsModal } from '../components/Feedback';
import { Lock, Check, Star, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Duolingo-style S-curve offsets — nodes zigzag left and right
const OFFSETS = [0, 1, 1.5, 1, 0, -1, -1.5, -1];
const AMPLITUDE = 50; // max px offset from center

export default function LessonsPage() {
  const { completedLessons, hearts } = useStore();
  const [loading, setLoading] = useState(true);
  const [showOutOfHearts, setShowOutOfHearts] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const { items, nextId, total } = useMemo(() => {
    const items = [];
    let li = 0;
    let nextId = null;
    for (const mod of MODULES) {
      const unlocked =
        mod.id === 1 ||
        completedLessons.some(
          (c) => c.lessonId === `module-${mod.id - 1}-quiz` && c.score >= 80
        );
      items.push({ key: `h-${mod.id}`, banner: true, mod, unlocked });
      let first = true;
      for (const lesson of mod.lessons) {
        const done = completedLessons.find((c) => c.lessonId === lesson.id);
        const quiz = lesson.type === 'quiz';
        const accessible = unlocked && isLessonAccessible(lesson.id, completedLessons);
        if (!nextId && accessible && !done) nextId = lesson.id;
        items.push({ key: lesson.id, banner: false, lesson, mod, unlocked, accessible, done, quiz, li, firstInMod: first });
        li++;
        first = false;
      }
    }
    return { items, nextId, total: li };
  }, [completedLessons]);

  if (loading) return <LessonsPageSkeleton />;

  // Pre-compute positions for curved connectors
  const NODE_GAP = 100; // vertical spacing between nodes
  const CX = 180; // center x within the SVG / container
  const getNodeX = (li) => CX + OFFSETS[li % OFFSETS.length] * AMPLITUDE;

  return (
    <div className="max-w-md mx-auto py-4 px-4">
      <AnimatePresence>
        {showOutOfHearts && (
          <OutOfHeartsModal
            onGoBack={() => setShowOutOfHearts(false)}
            onGoHome={() => navigate('/')}
          />
        )}
      </AnimatePresence>
      
      <div className="flex flex-col items-center">
        {items.map((it) => {
          if (it.banner) {
            return (
              <motion.div
                key={it.key}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`w-full rounded-2xl px-5 py-4 text-center my-5 shadow-sm ${
                  it.unlocked
                    ? 'bg-orange-500 text-white shadow-orange-200/50'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <span className="text-2xl block">{it.mod.icon}</span>
                <h2 className="text-base font-bold mt-1">{it.mod.title}</h2>
                {!it.unlocked && (
                  <p className="flex items-center justify-center gap-1 text-xs mt-1 opacity-80">
                    <Lock className="w-3 h-3" /> Pass Module {it.mod.id - 1} Quiz
                  </p>
                )}
              </motion.div>
            );
          }

          const { lesson, unlocked, accessible, done, quiz, li, firstInMod } = it;
          const curr = lesson.id === nextId;

          // Positions
          const nodeX = getNodeX(li);
          const prevX = firstInMod ? CX : getNodeX(li - 1);

          const passed = done && done.score >= 80;
          const connColor = passed ? '#22c55e' : done ? '#f59e0b' : curr ? '#fdba74' : '#e5e7eb';

          const size = curr ? 64 : 56;
          let bg, content;
          if (passed) {
            bg = quiz
              ? 'bg-yellow-400 shadow-lg shadow-yellow-200/60'
              : 'bg-green-500 shadow-lg shadow-green-200/60';
            content = <Check className="w-6 h-6 text-white" strokeWidth={3} />;
          } else if (done) {
            // Failed (score < 80)
            bg = 'bg-orange-400 shadow-lg shadow-orange-200/60';
            content = <span className="text-white text-lg font-bold">✗</span>;
          } else if (curr) {
            bg = 'bg-orange-500 shadow-xl shadow-orange-300/60 ring-[5px] ring-orange-100';
            content = quiz ? <Star className="w-6 h-6 text-white" fill="white" /> : <span className="text-lg font-bold text-white">▶</span>;
          } else if (accessible) {
            bg = 'bg-white border-[3px] border-gray-200 shadow-sm';
            content = quiz ? <Star className="w-5 h-5 text-gray-300" /> : <span className="text-sm font-bold text-gray-400">{li + 1}</span>;
          } else {
            bg = 'bg-gray-100';
            content = <Lock className="w-5 h-5 text-gray-300" />;
          }

          // Curved connector SVG — bezier from previous node center to this node center
          const svgW = CX * 2;
          const svgH = 40;
          const cpY = svgH / 2;
          const curvePath = `M ${prevX} 0 C ${prevX} ${cpY}, ${nodeX} ${cpY}, ${nodeX} ${svgH}`;

          const nodeEl = (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: li * 0.03 }}
              className="flex flex-col items-center"
              style={{ width: svgW, position: 'relative' }}
            >
              {/* Curved connector line */}
              <svg width={svgW} height={svgH} style={{ overflow: 'visible', display: 'block' }}>
                <path
                  d={curvePath}
                  fill="none"
                  stroke={connColor}
                  strokeWidth={4}
                  strokeLinecap="round"
                />
              </svg>
              {/* Node circle — positioned at nodeX */}
              <div
                className="flex flex-col items-center"
                style={{ transform: `translateX(${nodeX - CX}px)` }}
              >
                <div
                  className={`rounded-full flex items-center justify-center transition-all ${bg}`}
                  style={{ width: size, height: size }}
                >
                  {content}
                </div>
                <span
                  className={`text-xs mt-1.5 text-center max-w-[130px] leading-tight font-medium ${
                  passed ? 'text-gray-700' : done ? 'text-orange-600' : curr ? 'text-orange-600 font-semibold' : unlocked ? 'text-gray-500' : 'text-gray-300'
                  }`}
                >
                  {lesson.title}
                </span>
                {done && <span className={`text-[10px] font-semibold mt-0.5 ${passed ? 'text-green-500' : 'text-orange-500'}`}>{done.score}%</span>}
              </div>
            </motion.div>
          );

          if (!accessible) return <div key={it.key}>{nodeEl}</div>;

          const handleClick = (e) => {
            if (hearts === 0) {
              e.preventDefault();
              setShowOutOfHearts(true);
            }
          };

          return (
            <Link key={it.key} to={`/lessons/${lesson.id}`} onClick={handleClick}>
              {curr ? (
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
                  {nodeEl}
                </motion.div>
              ) : nodeEl}
            </Link>
          );
        })}

        {/* Finish crown */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col items-center mt-2 mb-6" style={{ width: CX * 2 }}>
          <svg width={CX * 2} height={40} style={{ overflow: 'visible', display: 'block' }}>
            <path
              d={`M ${getNodeX(total - 1)} 0 C ${getNodeX(total - 1)} 20, ${CX} 20, ${CX} 40`}
              fill="none" stroke="#fbbf24" strokeWidth={4} strokeLinecap="round"
            />
          </svg>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-200/50">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <span className="text-sm font-bold text-yellow-600 mt-2">Master Investor!</span>
        </motion.div>
      </div>
    </div>
  );
}
