import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { getLessonById, ALL_BADGES, isLessonAccessible } from '../data/lessons';
import { HeartsDisplay } from '../components/Gamification';
import {
  CorrectAnswerFeedback,
  WrongAnswerFeedback,
  LessonCompleteModal,
  BadgeUnlockModal,
  HeartLostAnimation,
  OutOfHeartsModal,
} from '../components/Feedback';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export default function LessonScreen() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const {
    hearts, loseHeart, addXP, xp, completeLesson, completedLessons,
    earnBadge, earnedBadges, recordStreak, hasHearts,
  } = useStore();

  const lesson = getLessonById(lessonId);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  const [wrongExplanation, setWrongExplanation] = useState('');
  const [showComplete, setShowComplete] = useState(false);
  const [showBadge, setShowBadge] = useState(null);
  const [showHeartLoss, setShowHeartLoss] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answered, setAnswered] = useState(false);

  if (!lesson) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Lesson not found</h2>
        <button onClick={() => navigate('/lessons')} className="btn-primary mt-4">
          Back to Lessons
        </button>
      </div>
    );
  }

  // Block access to lessons that haven't been unlocked yet
  if (!isLessonAccessible(lessonId, completedLessons)) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Lesson Locked</h2>
        <p className="text-gray-500 text-sm mb-6">Complete the previous lessons first to unlock this one.</p>
        <button onClick={() => navigate('/lessons')} className="btn-primary mt-4">
          Back to Lessons
        </button>
      </div>
    );
  }

  const step = lesson.content[stepIndex];
  const progress = ((stepIndex + 1) / lesson.content.length) * 100;

  const handleAnswer = useCallback(
    (optionIndex) => {
      if (answered) return;
      setSelectedAnswer(optionIndex);
      setAnswered(true);

      if (step.type === 'quiz') {
        setTotalQuestions((p) => p + 1);
        if (optionIndex === step.correctIndex) {
          setCorrectCount((p) => p + 1);
          setShowCorrect(true);
          addXP(10);
          setTimeout(() => setShowCorrect(false), 1500);
        } else {
          setShowWrong(true);
          setWrongExplanation(step.explanation || '');
          const wasLastHeart = hearts === 1;
          loseHeart();
          setShowHeartLoss(true);
          setTimeout(() => {
            setShowWrong(false);
            setShowHeartLoss(false);
            if (wasLastHeart) {
              setShowOutOfHearts(true);
            }
          }, 2000);
        }
      }
    },
    [answered, step, addXP, loseHeart, hearts]
  );

  const handleNext = useCallback(() => {
    // Block finishing when out of hearts
    if (!hasHearts()) return;
    if (stepIndex < lesson.content.length - 1) {
      setStepIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      setShowCorrect(false);
      setShowWrong(false);
    } else {
      // Lesson complete
      const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100;
      const passed = score >= 80;
      completeLesson(lesson.id, score);

      if (passed) {
        addXP(lesson.xpReward);
        recordStreak();

        // Check for badge awards
        const lessonsNow = [...completedLessons, { lessonId: lesson.id }];
        if (lessonsNow.length === 1) {
          const badge = ALL_BADGES.find((b) => b.id === 'first-steps');
          if (badge && !earnedBadges.find((b) => b.id === badge.id)) {
            earnBadge(badge);
            setShowBadge(badge);
          }
        }

        // Check module completion badges
        const moduleMatch = lesson.id.match(/^module-(\d+)-quiz$/);
        if (moduleMatch) {
          const modNum = parseInt(moduleMatch[1], 10);
          const badge = ALL_BADGES.find((b) => b.id === `module-${modNum}`);
          if (badge && !earnedBadges.find((b) => b.id === badge.id)) {
            earnBadge(badge);
            setShowBadge(badge);
          }
        }
      }

      if (!showBadge) setShowComplete(true);
    }
  }, [
    stepIndex, lesson, totalQuestions, correctCount, completeLesson,
    addXP, recordStreak, completedLessons, earnBadge, earnedBadges, showBadge, hasHearts,
  ]);

  const noHearts = !hasHearts();
  const [showOutOfHearts, setShowOutOfHearts] = useState(false);

  // Show blocking modal when hearts hit 0 during a lesson
  useEffect(() => {
    if (noHearts && step?.type === 'quiz' && !answered) {
      setShowOutOfHearts(true);
    }
  }, [noHearts, step?.type, answered]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Out of hearts — blocks lesson */}
      <AnimatePresence>
        {showOutOfHearts && noHearts && (
          <OutOfHeartsModal
            onGoBack={() => navigate('/lessons')}
            onGoHome={() => navigate('/')}
          />
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/lessons')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Progress bar */}
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <HeartsDisplay hearts={hearts} />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="card mb-6"
        >
          {step.type === 'info' ? (
            <div>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-base">
                {step.text.split('**').map((part, i) =>
                  i % 2 === 1 ? (
                    <strong key={i} className="text-gray-900 font-semibold">
                      {part}
                    </strong>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </div>
              <button
                onClick={handleNext}
                className="btn-primary mt-6 w-full flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : step.type === 'quiz' ? (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">{step.question}</h3>
              <div className="space-y-3">
                {step.options.map((option, i) => {
                  let optionStyle = 'border-gray-200 hover:border-green-300 hover:bg-green-50';
                  if (answered) {
                    if (i === step.correctIndex) {
                      optionStyle = 'border-green-500 bg-green-50 text-green-700';
                    } else if (i === selectedAnswer && i !== step.correctIndex) {
                      optionStyle = 'border-red-500 bg-red-50 text-red-700';
                    } else {
                      optionStyle = 'border-gray-200 opacity-50';
                    }
                  } else if (i === selectedAnswer) {
                    optionStyle = 'border-green-500 bg-green-50';
                  }

                  return (
                    <motion.button
                      key={i}
                      whileHover={!answered ? { scale: 1.01 } : {}}
                      whileTap={!answered ? { scale: 0.99 } : {}}
                      onClick={() => !noHearts && handleAnswer(i)}
                      disabled={answered || noHearts}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-colors font-medium ${noHearts && !answered ? 'opacity-50 cursor-not-allowed' : ''} ${optionStyle}`}
                    >
                      <span className="text-sm">{option}</span>
                    </motion.button>
                  );
                })}
              </div>

              {answered && !noHearts && (
                <button
                  onClick={handleNext}
                  className="btn-primary mt-6 w-full flex items-center justify-center gap-2"
                >
                  {stepIndex < lesson.content.length - 1 ? 'Continue' : 'Finish Lesson'}{' '}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {/* Feedback overlays */}
      <CorrectAnswerFeedback visible={showCorrect} />
      <WrongAnswerFeedback visible={showWrong} explanation={wrongExplanation} />
      {showHeartLoss && <HeartLostAnimation />}

      {/* Completion modals */}
      {showComplete && (() => {
        const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100;
        const passed = score >= 80;
        if (!passed) {
          // Failed - navigate back to lessons without showing modal
          setTimeout(() => navigate('/lessons'), 100);
          return null;
        }
        return (
          <LessonCompleteModal
            xpEarned={lesson.xpReward}
            onContinue={() => navigate('/lessons')}
          />
        );
      })()}

      <AnimatePresence>
        {showBadge && (
          <BadgeUnlockModal
            badge={showBadge}
            onClose={() => {
              setShowBadge(null);
              setShowComplete(true);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
