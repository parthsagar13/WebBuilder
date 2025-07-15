"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Code, 
  Download, 
  ExternalLink,
  RefreshCw,
  Eye,
  Settings,
  Loader2,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PreviewAreaProps {
  code: string;
  isGenerating: boolean;
}

type ViewMode = 'desktop' | 'tablet' | 'mobile';

export function PreviewArea({ code, isGenerating }: PreviewAreaProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [showCode, setShowCode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getPreviewDimensions = () => {
    switch (viewMode) {
      case 'desktop': 
        return { width: '100%', height: '1024px', maxWidth: 'none' };
      case 'tablet': 
        return { width: '768px', height: '1024px', maxWidth: '768px' };
      case 'mobile': 
        return { width: '375px', height: '667px', maxWidth: '375px' };
      default: 
        return { width: '100%', height: '100%', maxWidth: 'none' };
    }
  };

  const dimensions = getPreviewDimensions();

  const EmptyState = () => (
    <div className="h-full flex items-center justify-center bg-slate-900">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">AI Web Builder</h2>
        <p className="text-slate-400 mb-6">
          Start by describing the website you want to create in the chat. 
          I'll generate a beautiful, responsive website for you in seconds.
        </p>
        <div className="space-y-2 text-sm text-slate-500">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>AI-powered generation</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Responsive design</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Modern technologies</span>
          </div>
        </div>
      </div>
    </div>
  );

  const LoadingState = () => (
    <div className="h-full flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Generating Your Website</h3>
        <p className="text-slate-400 mb-6">AI is crafting your custom website...</p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-pink-600 to-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-900 min-h-0">
      {/* Toolbar */}
      <div className="h-14 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-white">Preview</span>
          </div>
          
          {code && (
            <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
              Generated
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('desktop')}
              className={cn(
                "h-7 px-3 text-xs",
                viewMode === 'desktop' 
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" 
                  : "text-slate-400 hover:text-white hover:bg-slate-700"
              )}
            >
              <Monitor className="w-3 h-3 mr-1" />
              Desktop
            </Button>
            <Button
              variant={viewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('tablet')}
              className={cn(
                "h-7 px-3 text-xs",
                viewMode === 'tablet' 
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" 
                  : "text-slate-400 hover:text-white hover:bg-slate-700"
              )}
            >
              <Tablet className="w-3 h-3 mr-1" />
              Tablet
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('mobile')}
              className={cn(
                "h-7 px-3 text-xs",
                viewMode === 'mobile' 
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" 
                  : "text-slate-400 hover:text-white hover:bg-slate-700"
              )}
            >
              <Smartphone className="w-3 h-3 mr-1" />
              Mobile
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 bg-slate-700" />

          {/* Actions */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCode(!showCode)}
            disabled={!code}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Code className="w-4 h-4 mr-2" />
            {showCode ? 'Preview' : 'Code'}
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            disabled={!code}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            disabled={!code}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            disabled={!code}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden bg-slate-800 min-h-0">
        {isGenerating ? (
          <LoadingState />
        ) : !code ? (
          <EmptyState />
        ) : showCode ? (
          <div className="h-full bg-slate-950 text-slate-100 overflow-auto">
            <div className="p-6">
              <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
                  <span className="text-sm font-medium text-slate-300">Generated Code</span>
                </div>
                <pre className="p-4 text-sm overflow-auto max-h-[calc(100vh-200px)]">
                  <code className="text-slate-300">{code}</code>
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-6 overflow-auto">
            <div 
              className={cn(
                "bg-white shadow-2xl border border-slate-600 overflow-hidden transition-all duration-300",
                viewMode === 'desktop' ? "w-full h-full rounded-none" : "rounded-lg",
                isFullscreen && "fixed inset-0 z-50 rounded-none"
              )}
              style={{
                width: dimensions.width,
                height: dimensions.height,
                maxWidth: dimensions.maxWidth,
                minHeight: viewMode !== 'desktop' ? dimensions.height : '600px'
              }}
            >
              {/* Browser Chrome for non-desktop modes */}
              {viewMode !== 'desktop' && (
                <div className="bg-slate-200 border-b border-slate-300 px-4 py-2 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-slate-600 mx-4">
                    localhost:3000
                  </div>
                </div>
              )}
              
              <div className="w-full h-full">
                <iframe
                  srcDoc={code}
                  className="w-full h-full border-0 bg-white"
                  title="Website Preview"
                  sandbox="allow-scripts allow-same-origin"
                  style={{
                    height: viewMode !== 'desktop' ? 'calc(100% - 40px)' : '100%'
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      {code && (
        <div className="h-8 bg-slate-900 border-t border-slate-800 px-6 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <div className="flex items-center gap-4">
            <span>Ready</span>
            <span>•</span>
            <span>{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Generated with AI</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}