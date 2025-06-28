import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Star, Share2, X } from 'lucide-react';

interface AchievementPopupProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: {
    title: string;
    description: string;
    xp: number;
    icon: string;
    type: 'bronze' | 'silver' | 'gold' | 'platinum';
    rarity: string;
  };
}

const typeColors = {
  bronze: 'from-amber-500 to-amber-700',
  silver: 'from-gray-300 to-gray-500',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-indigo-400 to-indigo-600'
};

export default function AchievementPopup({ isOpen, onClose, achievement }: AchievementPopupProps) {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-96">
            {/* Header */}
            <div className={`bg-gradient-to-r ${typeColors[achievement.type]} p-6 relative`}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center justify-center">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1 }}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mt-4"
              >
                <h3 className="text-xl font-bold text-white">Achievement Unlocked!</h3>
                <p className="text-white/80 text-sm mt-1">You've earned a new badge</p>
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900">{achievement.title}</h4>
                <p className="text-gray-600 mt-2">{achievement.description}</p>
                
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg font-bold text-gray-900">+{achievement.xp} XP</span>
                </div>
                
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-gray-100">
                  <span className="text-sm text-gray-600">{achievement.rarity} Achievement</span>
                </div>
              </div>

              {/* Share button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  // Implement share functionality
                  if (navigator.share) {
                    navigator.share({
                      title: 'Achievement Unlocked!',
                      text: `I just earned the ${achievement.title} achievement on SpeakCEO! 🏆`,
                      url: window.location.href
                    });
                  }
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Achievement
              </motion.button>
            </div>

            {/* Progress indicator */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-1 bg-gray-200 w-full"
            >
              <div className="h-full bg-indigo-600 origin-left"></div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 