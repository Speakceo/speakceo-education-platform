import React, { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Tooltip } from 'react-tooltip';
import { Download, Save, Share2, Sparkles, X, RefreshCw, HelpCircle } from 'lucide-react';
import { useSimulatorStore } from '../../lib/store';
import { analyzeBusinessModel } from '../../lib/openai';
import type { Component, Position, GridCell } from '../../lib/types/simulators';
import { GRID_CELLS, GRID_SIZE, pixelToGrid, gridToPixel, isValidGridPosition } from '../../lib/types/simulators';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

interface DraggableComponentProps {
  component: Component;
  onMove: (id: string, position: Position) => void;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

function DraggableComponent({ component, onMove, onEdit, onDelete }: DraggableComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { 
      id: component.id, 
      type: component.type,
      gridPosition: component.gridPosition 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
  };

  const cell = GRID_CELLS.find(c => c.type === component.type);

  return (
    <div
      ref={drag}
      style={{
        position: 'absolute',
        left: gridToPixel(component.gridPosition.row, component.gridPosition.col).x,
        top: gridToPixel(component.gridPosition.row, component.gridPosition.col).y,
        opacity: isDragging ? 0.5 : 1,
        width: `${cell?.width ? cell.width * (GRID_SIZE.CELL_WIDTH + GRID_SIZE.GAP) - GRID_SIZE.GAP : 200}px`,
        height: `${cell?.height ? cell.height * (GRID_SIZE.CELL_HEIGHT + GRID_SIZE.GAP) - GRID_SIZE.GAP : 120}px`
      }}
      className={`bg-white rounded-lg shadow-md p-4 transition-all duration-300 ${
        isEditing ? 'ring-2 ring-indigo-500' : ''
      }`}
      onClick={() => setIsEditing(true)}
      data-tooltip-id={`component-${component.id}`}
      data-tooltip-content={cell?.description}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-700">{cell?.label}</h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(component.id);
          }}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={component.content}
        onChange={(e) => onEdit(component.id, e.target.value)}
        onBlur={handleBlur}
        className={`w-full h-[calc(100%-2rem)] text-sm border rounded-md p-2 resize-none transition-colors ${
          isEditing 
            ? 'border-indigo-500 focus:ring-2 focus:ring-indigo-500' 
            : 'border-transparent hover:border-gray-200'
        }`}
        placeholder={`Add your ${cell?.label.toLowerCase()} here...`}
        maxLength={500}
      />
      <Tooltip id={`component-${component.id}`} />
    </div>
  );
}

export default function BusinessModelCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const { 
    businessModel, 
    updateBusinessModel, 
    resetBusinessModel,
    saveBusinessModel 
  } = useSimulatorStore();

  const [, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: { id: string; gridPosition: GridPosition }, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return;

      const currentPos = item.gridPosition;
      const newGridPos = pixelToGrid(
        gridToPixel(currentPos.row, currentPos.col).x + delta.x,
        gridToPixel(currentPos.row, currentPos.col).y + delta.y
      );

      const cell = GRID_CELLS.find(c => c.type === item.type);
      if (!cell || !isValidGridPosition(newGridPos, cell)) return;

      const components = businessModel.components.map(comp => {
        if (comp.id === item.id) {
          return {
            ...comp,
            gridPosition: newGridPos,
            position: gridToPixel(newGridPos.row, newGridPos.col)
          };
        }
        return comp;
      });

      updateBusinessModel(components);
    }
  }));

  const handleAddComponent = (type: Component['type']) => {
    const cell = GRID_CELLS.find(c => c.type === type);
    if (!cell) return;

    const gridPos = { row: cell.y, col: cell.x };
    const pixelPos = gridToPixel(gridPos.row, gridPos.col);

    const newComponent: Component = {
      id: Date.now().toString(),
      type,
      content: '',
      position: pixelPos,
      gridPosition: gridPos
    };

    updateBusinessModel([...businessModel.components, newComponent]);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const { suggestions } = await analyzeBusinessModel(businessModel.components);
      updateBusinessModel(businessModel.components, suggestions);
    } catch (error) {
      console.error('Error analyzing business model:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'png') => {
    if (!canvasRef.current) return;

    const canvas = await html2canvas(canvasRef.current);
    
    if (format === 'png') {
      const link = document.createElement('a');
      link.download = 'business-model-canvas.png';
      link.href = canvas.toDataURL();
      link.click();
    } else {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('business-model-canvas.pdf');
    }
  };

  const handleSubmit = async () => {
    // Validate all sections are filled
    const missingComponents = GRID_CELLS.filter(cell => 
      !businessModel.components.some(comp => 
        comp.type === cell.type && comp.content.trim().length > 0
      )
    );

    if (missingComponents.length > 0) {
      alert(`Please fill in the following sections:\n${missingComponents.map(c => c.label).join('\n')}`);
      return;
    }

    try {
      await saveBusinessModel();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setShowSubmitConfirm(false);
    } catch (error) {
      console.error('Error submitting business model:', error);
      alert('Failed to submit business model. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isAnalyzing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            <span>{isAnalyzing ? 'Analyzing...' : 'Get AI Suggestions'}</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExport('png')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export PNG</span>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset Canvas</span>
          </button>
          <button
            onClick={() => saveBusinessModel()}
            disabled={!businessModel.isDirty}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Submit for Review</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reset Canvas?
            </h3>
            <p className="text-gray-600 mb-6">
              This will clear all your work. Are you sure you want to reset the canvas? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetBusinessModel();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reset Canvas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Submit for Review?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you ready to submit your business model for review? Make sure all sections are complete.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        <div
          ref={drop}
          className="flex-1 relative bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 h-[800px] overflow-hidden"
        >
          <div ref={canvasRef} className="absolute inset-0 grid grid-cols-6 gap-4 p-6">
            {GRID_CELLS.map((cell) => (
              <div
                key={cell.type}
                style={{
                  gridColumn: `span ${cell.width}`,
                  gridRow: `span ${cell.height}`
                }}
                className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
                data-tooltip-id={`cell-${cell.type}`}
                data-tooltip-content={cell.description}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">{cell.label}</h3>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </div>
                <button
                  onClick={() => handleAddComponent(cell.type)}
                  className="text-xs text-indigo-600 hover:text-indigo-700"
                >
                  + Add Component
                </button>
                <Tooltip id={`cell-${cell.type}`} />
              </div>
            ))}
            {businessModel.components.map((component) => (
              <DraggableComponent
                key={component.id}
                component={component}
                onMove={(id, position) => {
                  const components = businessModel.components.map(comp => {
                    if (comp.id === id) {
                      return { ...comp, position };
                    }
                    return comp;
                  });
                  updateBusinessModel(components);
                }}
                onEdit={(id, content) => {
                  const components = businessModel.components.map(comp => {
                    if (comp.id === id) {
                      return { ...comp, content };
                    }
                    return comp;
                  });
                  updateBusinessModel(components);
                }}
                onDelete={(id) => {
                  const components = businessModel.components.filter(comp => comp.id !== id);
                  updateBusinessModel(components);
                }}
              />
            ))}
          </div>
        </div>

        {businessModel.suggestions.length > 0 && (
          <div className="w-80 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Suggestions</h3>
            <div className="space-y-4">
              {businessModel.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-indigo-50 text-sm text-indigo-700"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}