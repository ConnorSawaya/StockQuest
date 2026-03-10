import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Award, Flame, Heart, Clock } from 'lucide-react';

export function CorrectAnswerFeedback({ visible, xpEarned = 10 }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-0 left-0 right-0 md:left-64 bg-green-50 border-t-2 border-green-500 p-4 z-50"
        >
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <CheckCircle className="w-7 h-7 text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-bold text-green-600 text-base">Correct!</div>
              <div className="text-sm text-green-500 font-medium">+{xpEarned} XP</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function WrongAnswerFeedback({ visible, explanation }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-0 left-0 right-0 md:left-64 bg-red-50 border-t-2 border-red-500 p-4 z-50"
        >
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <Heart className="w-7 h-7 text-red-400" />
            <div className="flex-1">
              <div className="font-bold text-red-600 text-base">Incorrect</div>
              {explanation && <div className="text-sm text-red-500 mt-0.5">{explanation}</div>}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function BadgeUnlockModal({ badge, onClose }) {
  if (!badge) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-7xl mb-4"
        >
          {badge.icon}
        </motion.div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Award className="w-5 h-5 text-warning-500" />
          <span className="text-sm font-bold text-warning-500 uppercase tracking-wide">Badge Unlocked!</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">{badge.name}</h3>
        <p className="text-gray-500 text-sm mb-6">{badge.description}</p>
        <button onClick={onClose} className="btn-primary w-full">
          Awesome!
        </button>
      </motion.div>
    </motion.div>
  );
}

export function LessonCompleteModal({ xpEarned, onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-10 h-10 text-green-500" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Lesson Complete!</h3>
        <div className="flex items-center justify-center gap-1.5 text-lg font-bold text-yellow-500 mb-6">
          <span>+{xpEarned} XP</span>
        </div>
        <button onClick={onContinue} className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-base transition-colors">
          Continue
        </button>
      </motion.div>
    </motion.div>
  );
}

export function HeartLostAnimation() {
  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: 0, scale: 2, y: -30 }}
      transition={{ duration: 0.6 }}
      className="fixed top-20 right-8 text-3xl z-50 pointer-events-none"
    >
      💔
    </motion.div>
  );
}

export function StreakCelebration({ count }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
        className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
      >
        <Flame className="w-16 h-16 text-warning-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{count} Day Streak! 🔥</h3>
        <p className="text-gray-500 mb-6">You're on fire! Keep learning every day!</p>
        <div className="text-orange-600 font-bold mb-4">
          +{count >= 30 ? 200 : count >= 7 ? 50 : 20} Bonus XP
        </div>
      </motion.div>
    </motion.div>
  );
}

export function OutOfHeartsModal({ onGoBack, onGoHome }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
      >
        {/* Broken heart */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
          className="relative mx-auto mb-5 w-24 h-24"
        >
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-red-300" fill="currentColor" />
          </div>
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -10, 10, -5, 0] }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute -top-1 -right-1 text-2xl"
          >
            💔
          </motion.div>
        </motion.div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">You ran out of hearts!</h2>
        <p className="text-sm text-gray-500 mb-2">
          You need hearts to continue lessons.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-6">
          <Clock className="w-4 h-4" />
          <span>Hearts refill every 15 min</span>
        </div>

        <button
          onClick={onGoBack}
          className="btn-primary w-full mb-3"
        >
          Back to Lessons
        </button>
        <button
          onClick={onGoHome}
          className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
        >
          Go Home
        </button>
      </motion.div>
    </motion.div>
  );
}
