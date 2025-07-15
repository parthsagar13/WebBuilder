"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, Type, Square, Image, MousePointer, Layout, Grid3X3, List, Calendar, BarChart3, Table, FormInput, CheckSquare, Radio, Sliders as Slider, ToggleLeft } from 'lucide-react';
import { Component } from '@/types/builder';

const COMPONENT_CATEGORIES = {
  layout: {
    name: 'Layout',
    icon: Layout,
    components: [
      {
        type: 'container',
        name: 'Container',
        icon: Square,
        category: 'layout',
        defaultProps: { width: 300, height: 200, padding: 16, backgroundColor: '#ffffff', borderRadius: 8 }
      },
      {
        type: 'grid',
        name: 'Grid',
        icon: Grid3X3,
        category: 'layout',
        defaultProps: { width: 400, height: 300, columns: 3, gap: 16 }
      },
      {
        type: 'flex',
        name: 'Flex Container',
        icon: Layout,
        category: 'layout',
        defaultProps: { width: 300, height: 150, direction: 'row', gap: 8 }
      }
    ]
  },
  content: {
    name: 'Content',
    icon: Type,
    components: [
      {
        type: 'text',
        name: 'Text',
        icon: Type,
        category: 'content',
        defaultProps: { content: 'Your text here', fontSize: 16, color: '#000000', fontWeight: 'normal' }
      },
      {
        type: 'heading',
        name: 'Heading',
        icon: Type,
        category: 'content',
        defaultProps: { content: 'Heading', level: 1, fontSize: 32, color: '#000000', fontWeight: 'bold' }
      },
      {
        type: 'image',
        name: 'Image',
        icon: Image,
        category: 'content',
        defaultProps: { src: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Image', width: 200, height: 150 }
      }
    ]
  },
  interactive: {
    name: 'Interactive',
    icon: MousePointer,
    components: [
      {
        type: 'button',
        name: 'Button',
        icon: MousePointer,
        category: 'interactive',
        defaultProps: { text: 'Click me', variant: 'default', size: 'default' }
      },
      {
        type: 'input',
        name: 'Input',
        icon: FormInput,
        category: 'interactive',
        defaultProps: { placeholder: 'Enter text...', type: 'text' }
      },
      {
        type: 'checkbox',
        name: 'Checkbox',
        icon: CheckSquare,
        category: 'interactive',
        defaultProps: { label: 'Check me', checked: false }
      }
    ]
  },
  data: {
    name: 'Data Display',
    icon: BarChart3,
    components: [
      {
        type: 'table',
        name: 'Table',
        icon: Table,
        category: 'data',
        defaultProps: { columns: ['Name', 'Email', 'Status'], rows: [['John Doe', 'john@example.com', 'Active']] }
      },
      {
        type: 'chart',
        name: 'Chart',
        icon: BarChart3,
        category: 'data',
        defaultProps: { type: 'bar', data: [{ name: 'A', value: 30 }, { name: 'B', value: 80 }] }
      },
      {
        type: 'list',
        name: 'List',
        icon: List,
        category: 'data',
        defaultProps: { items: ['Item 1', 'Item 2', 'Item 3'], ordered: false }
      }
    ]
  }
};

export function ComponentPalette() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, component: Component) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const filteredCategories = Object.entries(COMPONENT_CATEGORIES).map(([key, category]) => ({
    key,
    ...category,
    components: category.components.filter(component =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.components.length > 0);

  return (
    <div className="h-full flex flex-col bg-slate-900/30">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-white mb-3">Components</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-400"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {filteredCategories.map((category) => (
            <div key={category.key} className="space-y-3">
              <div className="flex items-center gap-2">
                <category.icon className="w-4 h-4 text-purple-400" />
                <h3 className="font-medium text-slate-200">{category.name}</h3>
                <Badge variant="secondary" className="bg-slate-800 text-slate-400 text-xs">
                  {category.components.length}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {category.components.map((component) => (
                  <div
                    key={`${category.key}-${component.type}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component)}
                    className="p-3 bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105 group"
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <component.icon className="w-6 h-6 text-slate-300 group-hover:text-purple-400 transition-colors" />
                      <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                        {component.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}