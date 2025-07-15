"use client";

import { useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ComponentRenderer } from './ComponentRenderer';
import { ComponentInstance } from '@/types/builder';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, RotateCcw, Maximize } from 'lucide-react';

interface BuilderCanvasProps {
  components: ComponentInstance[];
  selectedComponent: ComponentInstance | null;
  onSelectComponent: (component: ComponentInstance | null) => void;
  onUpdateComponent: (id: string, updates: Partial<ComponentInstance>) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  canvasMode: 'desktop' | 'tablet' | 'mobile';
  isPreviewMode: boolean;
}

export function BuilderCanvas({
  components,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent,
  onDrop,
  onDragOver,
  canvasMode,
  isPreviewMode
}: BuilderCanvasProps) {
  const [zoom, setZoom] = useState(100);
  const canvasRef = useRef<HTMLDivElement>(null);

  const getCanvasSize = () => {
    switch (canvasMode) {
      case 'desktop': return { width: 1200, height: 800 };
      case 'tablet': return { width: 768, height: 1024 };
      case 'mobile': return { width: 375, height: 667 };
      default: return { width: 1200, height: 800 };
    }
  };

  const canvasSize = getCanvasSize();
  const scaleFactor = zoom / 100;

  return (
    <div className="flex-1 flex flex-col bg-slate-800/20">
      {!isPreviewMode && (
        <div className="h-12 border-b border-slate-700 bg-slate-900/40 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-300">Canvas</span>
            <span className="text-xs text-slate-500">
              {canvasSize.width} × {canvasSize.height}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(Math.max(25, zoom - 25))}
              className="text-slate-400 hover:text-white"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <span className="text-sm font-medium text-slate-300 min-w-[60px] text-center">
              {zoom}%
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              className="text-slate-400 hover:text-white"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(100)}
              className="text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 p-8">
        <div 
          className="mx-auto bg-white shadow-2xl border border-slate-300 relative overflow-hidden"
          style={{
            width: canvasSize.width * scaleFactor,
            height: canvasSize.height * scaleFactor,
            transform: `scale(${scaleFactor})`,
            transformOrigin: 'top center'
          }}
        >
          <div
            ref={canvasRef}
            className="w-full h-full relative"
            onDrop={onDrop}
            onDragOver={onDragOver}
            onClick={() => !isPreviewMode && onSelectComponent(null)}
          >
            {/* Grid pattern for alignment */}
            {!isPreviewMode && (
              <div className="absolute inset-0 opacity-30 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            )}

            {components.map((component) => (
              <ComponentRenderer
                key={component.id}
                component={component}
                isSelected={selectedComponent?.id === component.id}
                onSelect={() => !isPreviewMode && onSelectComponent(component)}
                onUpdate={(updates) => onUpdateComponent(component.id, updates)}
                isPreviewMode={isPreviewMode}
              />
            ))}

            {components.length === 0 && !isPreviewMode && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <Maximize className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Start Building</h3>
                  <p className="text-sm">Drag components from the palette to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}