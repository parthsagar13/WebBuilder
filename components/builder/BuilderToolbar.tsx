"use client";

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Eye, 
  Code, 
  Save, 
  Download,
  Undo,
  Redo,
  Settings,
  Play
} from 'lucide-react';
import { ComponentInstance } from '@/types/builder';

interface BuilderToolbarProps {
  canvasMode: 'desktop' | 'tablet' | 'mobile';
  setCanvasMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  isPreviewMode: boolean;
  setIsPreviewMode: (preview: boolean) => void;
  components: ComponentInstance[];
}

export function BuilderToolbar({ 
  canvasMode, 
  setCanvasMode, 
  isPreviewMode, 
  setIsPreviewMode,
  components 
}: BuilderToolbarProps) {
  return (
    <div className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <Code className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">WebBuilder Pro</h1>
          </div>
        </div>

        <Separator orientation="vertical" className="h-8 bg-slate-700" />

        <div className="flex items-center gap-1">
          <Button
            variant={canvasMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCanvasMode('desktop')}
            className="text-slate-300 hover:text-white"
          >
            <Monitor className="w-4 h-4 mr-2" />
            Desktop
          </Button>
          <Button
            variant={canvasMode === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCanvasMode('tablet')}
            className="text-slate-300 hover:text-white"
          >
            <Tablet className="w-4 h-4 mr-2" />
            Tablet
          </Button>
          <Button
            variant={canvasMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCanvasMode('mobile')}
            className="text-slate-300 hover:text-white"
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="bg-slate-800 text-slate-300">
          {components.length} components
        </Badge>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <Redo className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8 bg-slate-700" />

        <Button
          variant={isPreviewMode ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="text-slate-300 hover:text-white"
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>

        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>

        <Button 
          size="sm" 
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Play className="w-4 h-4 mr-2" />
          Publish
        </Button>
      </div>
    </div>
  );
}