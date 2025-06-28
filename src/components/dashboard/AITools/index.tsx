import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AIToolsHome from './AIToolsHome';
import SpeakSmart from './SpeakSmart';
import MathMentor from './MathMentor';
import WriteRight from './WriteRight';
import MindMaze from './MindMaze';
import PitchDeckCreator from './PitchDeckCreator';
import { useAIToolsStore, useProgressStore, useUnifiedProgressStore } from '../../../lib/store';

export default function AITools() {
  const location = useLocation();
  
  console.log('AITools component rendering at path:', location.pathname);
  
  return (
    <>
      {/* Debug div to check if component is rendering */}
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        background: 'red', 
        color: 'white', 
        padding: '5px', 
        zIndex: 9999 
      }}>
        AI Tools Component Loaded: {location.pathname}
      </div>
      
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <Routes>
          <Route index element={<AIToolsHome />} />
          <Route path="speak-smart/*" element={<SpeakSmart />} />
          <Route path="math-mentor/*" element={<MathMentor />} />
          <Route path="write-right/*" element={<WriteRight />} />
          <Route path="mind-maze/*" element={<MindMaze />} />
          <Route path="pitch-deck/*" element={<PitchDeckCreator />} />
          <Route path="*" element={<Navigate to="/dashboard/ai-tools" replace />} />
        </Routes>
      </motion.div>
    </>
  );
}