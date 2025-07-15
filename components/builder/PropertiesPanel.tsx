"use client";

import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { ComponentInstance } from '@/types/builder';
import { Settings, Palette, Layout, Type } from 'lucide-react';

interface PropertiesPanelProps {
  selectedComponent: ComponentInstance | null;
  onUpdateComponent: (id: string, updates: Partial<ComponentInstance>) => void;
}

export function PropertiesPanel({ selectedComponent, onUpdateComponent }: PropertiesPanelProps) {
  if (!selectedComponent) {
    return (
      <div className="h-full flex flex-col bg-slate-900/30">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Select a component to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  const updateProp = (key: string, value: any) => {
    onUpdateComponent(selectedComponent.id, {
      props: { ...selectedComponent.props, [key]: value }
    });
  };

  const updatePosition = (axis: 'x' | 'y', value: number) => {
    onUpdateComponent(selectedComponent.id, {
      position: { ...selectedComponent.position, [axis]: value }
    });
  };

  const updateSize = (dimension: 'width' | 'height', value: number) => {
    onUpdateComponent(selectedComponent.id, {
      size: { ...selectedComponent.size, [dimension]: value }
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/30">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-white mb-2">Properties</h2>
        <p className="text-sm text-slate-400">{selectedComponent.name}</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Layout Properties */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Layout className="w-4 h-4 text-blue-400" />
              <h3 className="font-medium text-slate-200">Layout</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">X Position</Label>
                <Input
                  type="number"
                  value={selectedComponent.position.x}
                  onChange={(e) => updatePosition('x', parseInt(e.target.value) || 0)}
                  className="bg-slate-800/50 border-slate-700 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Y Position</Label>
                <Input
                  type="number"
                  value={selectedComponent.position.y}
                  onChange={(e) => updatePosition('y', parseInt(e.target.value) || 0)}
                  className="bg-slate-800/50 border-slate-700 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Width</Label>
                <Input
                  type="number"
                  value={selectedComponent.size.width}
                  onChange={(e) => updateSize('width', parseInt(e.target.value) || 0)}
                  className="bg-slate-800/50 border-slate-700 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Height</Label>
                <Input
                  type="number"
                  value={selectedComponent.size.height}
                  onChange={(e) => updateSize('height', parseInt(e.target.value) || 0)}
                  className="bg-slate-800/50 border-slate-700 text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Component-specific Properties */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" />
              <h3 className="font-medium text-slate-200">Appearance</h3>
            </div>

            {(selectedComponent.type === 'text' || selectedComponent.type === 'heading') && (
              <>
                <div className="space-y-2">
                  <Label className="text-slate-300">Content</Label>
                  <Textarea
                    value={selectedComponent.props.content}
                    onChange={(e) => updateProp('content', e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Font Size</Label>
                  <Slider
                    value={[selectedComponent.props.fontSize]}
                    onValueChange={([value]) => updateProp('fontSize', value)}
                    min={8}
                    max={72}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-slate-400 text-center">
                    {selectedComponent.props.fontSize}px
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Color</Label>
                  <Input
                    type="color"
                    value={selectedComponent.props.color}
                    onChange={(e) => updateProp('color', e.target.value)}
                    className="w-full h-10 bg-slate-800/50 border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Font Weight</Label>
                  <Select
                    value={selectedComponent.props.fontWeight}
                    onValueChange={(value) => updateProp('fontWeight', value)}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="lighter">Lighter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {selectedComponent.type === 'button' && (
              <>
                <div className="space-y-2">
                  <Label className="text-slate-300">Button Text</Label>
                  <Input
                    value={selectedComponent.props.text}
                    onChange={(e) => updateProp('text', e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Variant</Label>
                  <Select
                    value={selectedComponent.props.variant}
                    onValueChange={(value) => updateProp('variant', value)}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="destructive">Destructive</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="ghost">Ghost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {selectedComponent.type === 'container' && (
              <>
                <div className="space-y-2">
                  <Label className="text-slate-300">Background Color</Label>
                  <Input
                    type="color"
                    value={selectedComponent.props.backgroundColor}
                    onChange={(e) => updateProp('backgroundColor', e.target.value)}
                    className="w-full h-10 bg-slate-800/50 border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Border Radius</Label>
                  <Slider
                    value={[selectedComponent.props.borderRadius]}
                    onValueChange={([value]) => updateProp('borderRadius', value)}
                    min={0}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-slate-400 text-center">
                    {selectedComponent.props.borderRadius}px
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Padding</Label>
                  <Slider
                    value={[selectedComponent.props.padding]}
                    onValueChange={([value]) => updateProp('padding', value)}
                    min={0}
                    max={100}
                    step={4}
                    className="w-full"
                  />
                  <div className="text-sm text-slate-400 text-center">
                    {selectedComponent.props.padding}px
                  </div>
                </div>
              </>
            )}

            {selectedComponent.type === 'image' && (
              <>
                <div className="space-y-2">
                  <Label className="text-slate-300">Image URL</Label>
                  <Input
                    value={selectedComponent.props.src}
                    onChange={(e) => updateProp('src', e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-slate-200"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Alt Text</Label>
                  <Input
                    value={selectedComponent.props.alt}
                    onChange={(e) => updateProp('alt', e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-slate-200"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}