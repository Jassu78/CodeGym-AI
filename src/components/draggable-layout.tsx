'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableLayoutProps {
  children: React.ReactNode[];
  className?: string;
}

interface PanelPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

const defaultPositions: Record<string, PanelPosition> = {
  problem: { x: 0, y: 0, width: 50, height: 40 },
  editor: { x: 50, y: 0, width: 50, height: 40 },
  feedback: { x: 0, y: 40, width: 100, height: 30 },
};

export function DraggableLayout({ children, className }: DraggableLayoutProps) {
  // Initialize positions with all available panel keys
  const [positions, setPositions] = useState(() => {
    const initialPositions = { ...defaultPositions };
    // Ensure all children have positions
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.key) {
        const panelId = child.key as string;
        if (!initialPositions[panelId]) {
          // Create a default position for any missing panels
          initialPositions[panelId] = { x: 0, y: 0, width: 50, height: 40 };
        }
      }
    });
    return initialPositions;
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [draggedPanel, setDraggedPanel] = useState<string | null>(null);
  const [resizedPanel, setResizedPanel] = useState<string | null>(null);

  const resetLayout = useCallback(() => {
    setPositions(defaultPositions);
  }, []);

  const toggleFullscreen = useCallback((panelId: string) => {
    setPositions(prev => {
      const newPos = { ...prev };
      if (newPos[panelId].width === 100 && newPos[panelId].height === 70) {
        // Restore original size
        newPos[panelId] = defaultPositions[panelId];
      } else {
        // Make fullscreen
        newPos[panelId] = { x: 0, y: 0, width: 100, height: 70 };
      }
      return newPos;
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, panelId: string, type: 'drag' | 'resize') => {
    e.preventDefault();
    if (type === 'drag') {
      setDraggedPanel(panelId);
    } else {
      setResizedPanel(panelId);
    }
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    if (draggedPanel) {
      setPositions(prev => {
        const panel = prev[draggedPanel];
        const deltaX = e.movementX;
        const deltaY = e.movementY;
        
        return {
          ...prev,
          [draggedPanel]: {
            ...panel,
            x: Math.max(0, Math.min(100 - panel.width, panel.x + deltaX / 10)),
            y: Math.max(0, Math.min(70 - panel.height, panel.y + deltaY / 10)),
          }
        };
      });
    }

    if (resizedPanel) {
      setPositions(prev => {
        const panel = prev[resizedPanel];
        const deltaX = e.movementX;
        const deltaY = e.movementY;
        
        return {
          ...prev,
          [resizedPanel]: {
            ...panel,
            width: Math.max(20, Math.min(100 - panel.x, panel.width + deltaX / 10)),
            height: Math.max(20, Math.min(70 - panel.y, panel.height + deltaY / 10)),
          }
        };
      });
    }
  }, [isDragging, draggedPanel, resizedPanel]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedPanel(null);
    setResizedPanel(null);
  }, []);

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className={cn('relative w-full h-full min-h-[600px]', className)}>
      {/* Layout Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowControls(!showControls)}
          className="h-8 w-8 p-0"
        >
          <Settings className="h-4 w-4" />
        </Button>
        
        {showControls && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={resetLayout}
              className="h-8 px-2 text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFullscreen('problem')}
                className="h-8 px-2 text-xs"
              >
                <Maximize2 className="h-3 w-3 mr-1" />
                Problem
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFullscreen('editor')}
                className="h-8 px-2 text-xs"
              >
                <Maximize2 className="h-3 w-3 mr-1" />
                Editor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFullscreen('feedback')}
                className="h-8 px-2 text-xs"
              >
                <Maximize2 className="h-3 w-3 mr-1" />
                Feedback
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Panels Container */}
      <div className="relative w-full h-full">
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            const panelId = child.key as string;
            // Ensure the panel has a valid position, fallback to default if missing
            const position = positions[panelId] || defaultPositions[panelId];
            
            if (!position) {
              console.warn(`No position found for panel: ${panelId}`);
              return null;
            }
            
            return (
              <div
                key={panelId}
                className="absolute border-2 border-gray-200 rounded-lg bg-white shadow-lg"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  width: `${position.width}%`,
                  height: `${position.height}%`,
                  zIndex: isDragging && (draggedPanel === panelId || resizedPanel === panelId) ? 10 : 1,
                }}
              >
                {React.cloneElement(child, {
                  onMouseDown: (e: React.MouseEvent) => handleMouseDown(e, panelId, 'drag'),
                  onResizeMouseDown: (e: React.MouseEvent) => handleMouseDown(e, panelId, 'resize'),
                })}
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Drag Instructions */}
      {!isDragging && (
        <div className="fixed bottom-4 left-4 bg-background/80 backdrop-blur-sm border rounded-lg px-3 py-2 text-xs text-muted-foreground z-20">
          💡 Drag panels to move • Resize corners to adjust • Use controls to reset
        </div>
      )}
    </div>
  );
}

// Individual panel wrapper components
export function ProblemPanelWrapper({ children, className, onMouseDown, onResizeMouseDown }: { 
  children: React.ReactNode; 
  className?: string;
  onMouseDown?: (e: React.MouseEvent) => void;
  onResizeMouseDown?: (e: React.MouseEvent) => void;
}) {
  return (
    <div className={cn('w-full h-full bg-card border rounded-lg shadow-sm overflow-hidden', className)}>
      <div 
        className="drag-handle bg-muted/50 px-4 py-2 border-b cursor-move hover:bg-muted/70 transition-colors"
        onMouseDown={onMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <span className="text-sm font-medium">Problem Display</span>
        </div>
      </div>
      <div className="p-4 h-full overflow-auto">
        {children}
      </div>
      {/* Resize handle */}
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-blue-500 opacity-50 hover:opacity-100"
        onMouseDown={onResizeMouseDown}
      />
    </div>
  );
}

export function EditorPanelWrapper({ children, className, onMouseDown, onResizeMouseDown }: { 
  children: React.ReactNode; 
  className?: string;
  onMouseDown?: (e: React.MouseEvent) => void;
  onResizeMouseDown?: (e: React.MouseEvent) => void;
}) {
  return (
    <div className={cn('w-full h-full bg-card border rounded-lg shadow-sm overflow-hidden', className)}>
      <div 
        className="drag-handle bg-muted/50 px-4 py-2 border-b cursor-move hover:bg-muted/70 transition-colors"
        onMouseDown={onMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium">Code Editor</span>
        </div>
      </div>
      <div className="p-4 h-full overflow-auto">
        {children}
      </div>
      {/* Resize handle */}
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-green-500 opacity-50 hover:opacity-100"
        onMouseDown={onResizeMouseDown}
      />
    </div>
  );
}

export function FeedbackPanelWrapper({ children, className, onMouseDown, onResizeMouseDown }: { 
  children: React.ReactNode; 
  className?: string;
  onMouseDown?: (e: React.MouseEvent) => void;
  onResizeMouseDown?: (e: React.MouseEvent) => void;
}) {
  return (
    <div className={cn('w-full h-full bg-card border rounded-lg shadow-sm overflow-hidden', className)}>
      <div 
        className="drag-handle bg-muted/50 px-4 py-2 border-b cursor-move hover:bg-muted/70 transition-colors"
        onMouseDown={onMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium">AI Feedback</span>
        </div>
      </div>
      <div className="p-4 h-full overflow-auto">
        {children}
      </div>
      {/* Resize handle */}
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-blue-500 opacity-50 hover:opacity-100"
        onMouseDown={onResizeMouseDown}
      />
    </div>
  );
}
