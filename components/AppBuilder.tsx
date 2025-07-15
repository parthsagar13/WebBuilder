"use client";

import { useState, useRef } from 'react';
import { ComponentPalette } from './builder/ComponentPalette';
import { BuilderCanvas } from './builder/BuilderCanvas';
import { PropertiesPanel } from './builder/PropertiesPanel';
import { BuilderToolbar } from './builder/BuilderToolbar';
import { LayerPanel } from './builder/LayerPanel';
import { Component, ComponentInstance } from '@/types/builder';
import { generateId } from '@/lib/builder-utils';

export function AppBuilder() {
  const [components, setComponents] = useState<ComponentInstance[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<ComponentInstance | null>(null);
  const [canvasMode, setCanvasMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const dragCounterRef = useRef(0);

  const handleDrop = (e: React.DragEvent, dropZone?: string) => {
    e.preventDefault();
    dragCounterRef.current = 0;
    
    const componentData = e.dataTransfer.getData('application/json');
    if (!componentData) return;

    const component: Component = JSON.parse(componentData);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newInstance: ComponentInstance = {
      id: generateId(),
      type: component.type,
      name: component.name,
      props: { ...component.defaultProps },
      position: { x: Math.max(0, x - 50), y: Math.max(0, y - 25) },
      size: { width: component.defaultProps.width || 200, height: component.defaultProps.height || 100 }
    };

    setComponents(prev => [...prev, newInstance]);
    setSelectedComponent(newInstance);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const updateComponent = (id: string, updates: Partial<ComponentInstance>) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ));
    
    if (selectedComponent?.id === id) {
      setSelectedComponent(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteComponent = (id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      <BuilderToolbar 
        canvasMode={canvasMode}
        setCanvasMode={setCanvasMode}
        isPreviewMode={isPreviewMode}
        setIsPreviewMode={setIsPreviewMode}
        components={components}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className="h-1/2 border-b border-slate-800">
            <ComponentPalette />
          </div>
          <div className="h-1/2">
            <LayerPanel 
              components={components}
              selectedComponent={selectedComponent}
              onSelectComponent={setSelectedComponent}
              onDeleteComponent={deleteComponent}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <BuilderCanvas
            components={components}
            selectedComponent={selectedComponent}
            onSelectComponent={setSelectedComponent}
            onUpdateComponent={updateComponent}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            canvasMode={canvasMode}
            isPreviewMode={isPreviewMode}
          />
        </div>

        <div className="w-80 border-l border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <PropertiesPanel
            selectedComponent={selectedComponent}
            onUpdateComponent={updateComponent}
          />
        </div>
      </div>
    </div>
  );
}