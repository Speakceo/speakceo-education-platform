import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { motion } from 'framer-motion';

interface AnimatedSectionProps {
  animationUrl: string;
  title: string;
  description: string;
  reverse?: boolean;
}

export default function AnimatedSection({ animationUrl, title, description, reverse = false }: AnimatedSectionProps) {
  return (
    <motion.div
      className={`py-16 flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 will-change-transform`}
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.div 
        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2"
        style={{ willChange: 'transform' }}
      >
        <Player
          autoplay
          loop
          src={animationUrl}
          style={{ height: '100%', width: '100%' }}
          speed={1}
          rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
        />
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, x: reverse ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2"
        style={{ willChange: 'transform' }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4 drop-shadow-sm transition-colors duration-300 hover:text-blue-600">{title}</h2>
        <p className="text-lg text-gray-600 transition-colors duration-300 hover:text-pink-500">{description}</p>
      </motion.div>
    </motion.div>
  );
} 