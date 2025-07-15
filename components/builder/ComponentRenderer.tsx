"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ComponentInstance } from '@/types/builder';
import { cn } from '@/lib/utils';
import { Trash2, Move, Copy } from 'lucide-react';

interface ComponentRendererProps {
  component: ComponentInstance;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<ComponentInstance>) => void;
  isPreviewMode: boolean;
}

export function ComponentRenderer({
  component,
  isSelected,
  onSelect,
  onUpdate,
  isPreviewMode
}: ComponentRendererProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isPreviewMode) return;

    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;

    onUpdate({
      position: {
        x: Math.max(0, component.position.x + deltaX),
        y: Math.max(0, component.position.y + deltaY)
      }
    });

    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const renderComponent = () => {
    switch (component.type) {
      case 'text':
        return (
          <div
            style={{
              fontSize: component.props.fontSize,
              color: component.props.color,
              fontWeight: component.props.fontWeight
            }}
            className="p-2 select-none"
          >
            {component.props.content}
          </div>
        );

      case 'heading':
        const HeadingTag = `h${component.props.level}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            style={{
              fontSize: component.props.fontSize,
              color: component.props.color,
              fontWeight: component.props.fontWeight
            }}
            className="p-2 select-none m-0"
          >
            {component.props.content}
          </HeadingTag>
        );

      case 'button':
        return (
          <Button
            variant={component.props.variant}
            size={component.props.size}
            className="select-none"
          >
            {component.props.text}
          </Button>
        );

      case 'container':
        return (
          <div
            style={{
              backgroundColor: component.props.backgroundColor,
              borderRadius: component.props.borderRadius,
              padding: component.props.padding
            }}
            className="border border-dashed border-slate-300 min-h-[50px] flex items-center justify-center text-slate-500 text-sm"
          >
            Container
          </div>
        );

      case 'image':
        return (
          <img
            src={component.props.src}
            alt={component.props.alt}
            className="w-full h-full object-cover rounded"
          />
        );

      case 'input':
        return (
          <input
            type={component.props.type}
            placeholder={component.props.placeholder}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        );

      default:
        return (
          <div className="p-4 bg-slate-100 border border-dashed border-slate-300 rounded text-center text-slate-500">
            {component.name}
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        "absolute cursor-pointer transition-all duration-200",
        isSelected && !isPreviewMode && "ring-2 ring-purple-500 ring-offset-2",
        isDragging && "z-50"
      )}
      style={{
        left: component.position.x,
        top: component.position.y,
        width: component.size.width,
        height: component.size.height
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {renderComponent()}

      {isSelected && !isPreviewMode && (
        <div className="absolute -top-8 left-0 flex gap-1 bg-purple-600 rounded px-2 py-1">
          <button className="text-white hover:text-purple-200">
            <Move className="w-3 h-3" />
          </button>
          <button className="text-white hover:text-purple-200">
            <Copy className="w-3 h-3" />
          </button>
          <button className="text-white hover:text-red-200">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Resize handles */}
      {isSelected && !isPreviewMode && (
        <>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-500 rounded-full cursor-se-resize" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full cursor-ne-resize" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-500 rounded-full cursor-sw-resize" />
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-purple-500 rounded-full cursor-nw-resize" />
        </>
      )}
    </div>
  );
}