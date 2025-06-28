import React from 'react';
import { motion } from 'framer-motion';

interface TestimonialCardProps {
  content: string;
  author: string;
  role: string;
  avatarUrl: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ content, author, role, avatarUrl }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="group p-8 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col"
    >
      <div className="flex items-center mb-6">
        <div className="flex-shrink-0 mr-4">
          <img 
            src={avatarUrl} 
            alt={`${author}`} 
            className="h-14 w-14 rounded-full border-2 border-mint-300 object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-white text-lg">{author}</h4>
          <p className="text-mint-200">{role}</p>
        </div>
      </div>
      <p className="text-white mb-6 flex-grow leading-relaxed">{content}</p>
      <div className="flex text-yellow-300">
        {[...Array(5)].map((_, i) => (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
        ))}
      </div>
    </motion.div>
  );
};

export default TestimonialCard; 