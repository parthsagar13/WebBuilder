"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { PreviewArea } from '@/components/preview/PreviewArea';
import { 
  Sparkles, 
  Code, 
  Palette, 
  Layout, 
  Smartphone,
  Globe,
  Zap,
  Github,
  Figma,
  Paperclip,
  Image,
  Send,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const EXAMPLE_PROMPTS = [
  "Create a financial app",
  "Design a directory website", 
  "Build a project management app",
  "Make a landing page",
  "Generate a CRM",
  "Build a mobile app"
];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = (promptText?: string) => {
    const text = promptText || prompt;
    if (!text.trim()) return;
    
    setShowBuilder(true);
    setIsGenerating(true);
    setPrompt('');
    
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedCode(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated App</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold text-white text-center mb-8">
            ${text}
        </h1>
        <div class="bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-4xl mx-auto">
            <p class="text-white/90 text-lg text-center">
                Your custom application has been generated successfully!
            </p>
        </div>
    </div>
</body>
</html>`);
    }, 3000);
  };

  const handleCodeGenerated = (code: string) => {
    setGeneratedCode(code);
  };

  if (showBuilder) {
    return (
      <div className="h-screen flex bg-background overflow-hidden">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 lg:hidden bg-card/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Chat Sidebar */}
        <div className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 w-full sm:w-96 transform transition-transform duration-300 ease-in-out lg:transform-none",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <ChatSidebar 
            onCodeGenerated={handleCodeGenerated}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        </div>

        {/* Preview Area */}
        <div className="flex-1 lg:ml-0">
          <PreviewArea 
            code={generatedCode}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">bolt</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Community</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Enterprise</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Resources</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </nav>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <span className="sr-only">Discord</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 sm:mb-6">
              What do you want to build?
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12">
              Create stunning apps & websites by chatting with AI.
            </p>

            {/* Main Input */}
            <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
              <div className="relative">
                <Input
                  placeholder="Type your idea and we'll bring it to life (or /command)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  className="h-12 sm:h-14 pl-4 pr-16 sm:pr-20 text-base sm:text-lg bg-card border-border/50 focus:border-primary/50 rounded-xl"
                  disabled={isGenerating}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-2">
                  <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 hidden sm:flex">
                    <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 hidden sm:flex">
                    <Image className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button 
                    onClick={() => handleSubmit()}
                    disabled={!prompt.trim() || isGenerating}
                    size="icon" 
                    className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700"
                  >
                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Import Options */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
              <span className="text-sm text-muted-foreground">or import from</span>
              <div className="flex gap-2 sm:gap-4">
                <Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm">
                  <Figma className="w-3 h-3 sm:w-4 sm:h-4" />
                  Figma
                </Button>
                <Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm">
                  <Github className="w-3 h-3 sm:w-4 sm:h-4" />
                  GitHub
                </Button>
              </div>
            </div>

            {/* Example Prompts */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {EXAMPLE_PROMPTS.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSubmit(example)}
                  disabled={isGenerating}
                  className="rounded-full border-border/50 hover:border-primary/50 hover:bg-primary/5 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isGenerating && (
            <Card className="max-w-2xl mx-auto p-6 sm:p-8 text-center bg-card/50 border-border/50">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold">Generating your app...</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                AI is analyzing your request and creating a custom application
              </p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-pink-600 to-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
              <a href="#" className="hover:text-foreground transition-colors">Blog</a>
              <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
              <a href="#" className="hover:text-foreground transition-colors">Help Center</a>
              <a href="#" className="hover:text-foreground transition-colors">Careers</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4" />
              <span>StackBlitz</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}