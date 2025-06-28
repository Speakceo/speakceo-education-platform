import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ErrorBoundary from '../ErrorBoundary';

interface SimulatorProviderProps {
  children: React.ReactNode;
}

export default function SimulatorProvider({ children }: SimulatorProviderProps) {
  return (
    <ErrorBoundary>
      <DndProvider backend={HTML5Backend}>
        {children}
      </DndProvider>
    </ErrorBoundary>
  );
}