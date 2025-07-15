"use client";

import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ComponentInstance } from '@/types/builder';
import { cn } from '@/lib/utils';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2,
  Type,
  Square,
  Image,
  MousePointer
} from 'lucide-react';

interface LayerPanelProps {
  components: ComponentInstance[];
  selectedComponent: ComponentInstance | null;
  onSelectComponent: (component: ComponentInstance) => void;
  onDeleteComponent: (id: string) => void;
}

export function LayerPanel({ 
  components, 
  selectedComponent, 
  onSelectComponent, 
  onDeleteComponent 
}: LayerPanelProps) {
  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'text':
      case 'heading':
        return Type;
      case 'button':
        return MousePointer;
      case 'container':
        return Square;
      case 'image':
        return Image;
      default:
        return Square;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/30">
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h2 className="text-lg font-semibold text-white">Layers</h2>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {components.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No components added yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {components.map((component, index) => {
                const Icon = getComponentIcon(component.type);
                const isSelected = selectedComponent?.id === component.id;
                
                return (
                  <div
                    key={component.id}
                    className={cn(
                      "group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200",
                      isSelected
                        ? "bg-purple-500/20 border border-purple-500/30"
                        : "hover:bg-slate-800/40 border border-transparent"
                    )}
                    onClick={() => onSelectComponent(component)}
                  >
                    <Icon className={cn(
                      "w-4 h-4",
                      isSelected ? "text-purple-400" : "text-slate-400"
                    )} />
                    
                    <span className={cn(
                      "flex-1 text-sm truncate",
                      isSelected ? "text-white font-medium" : "text-slate-300"
                    )}>
                      {component.name}
                    </span>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6 p-0 text-slate-400 hover:text-white"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6 p-0 text-slate-400 hover:text-white"
                      >
                        <Unlock className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteComponent(component.id);
                        }}
                        className="w-6 h-6 p-0 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}