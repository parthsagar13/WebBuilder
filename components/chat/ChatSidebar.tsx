"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Sparkles, 
  Code, 
  Palette, 
  Layout, 
  Smartphone,
  Globe,
  Zap,
  MessageSquare,
  User,
  Bot,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  onCodeGenerated: (code: string) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

const EXAMPLE_PROMPTS = [
  {
    icon: Layout,
    title: "Landing Page",
    description: "Create a modern landing page for a SaaS product",
    prompt: "Create a modern landing page for a SaaS product with hero section, features, pricing, and footer"
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    description: "Build a responsive mobile-first design",
    prompt: "Create a mobile-first responsive website for a food delivery app with clean design"
  },
  {
    icon: Palette,
    title: "Portfolio",
    description: "Design a creative portfolio website",
    prompt: "Create a creative portfolio website for a graphic designer with project gallery and contact form"
  },
  {
    icon: Globe,
    title: "E-commerce",
    description: "Build an online store interface",
    prompt: "Create an e-commerce product page with image gallery, product details, and add to cart functionality"
  }
];

export function ChatSidebar({ onCodeGenerated, isGenerating, setIsGenerating }: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI web builder assistant. Describe the website you'd like to create, and I'll generate it for you using modern web technologies.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (prompt?: string) => {
    const messageContent = prompt || inputValue.trim();
    if (!messageContent || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    // Simulate AI response and code generation
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I'll create ${messageContent.toLowerCase()} for you. Generating the code now...`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Generate sample code based on the prompt
      const generatedCode = generateSampleCode(messageContent);
      onCodeGenerated(generatedCode);
      
      setTimeout(() => {
        setIsGenerating(false);
        const completionMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: "✅ Website generated successfully! You can see the preview on the right. Feel free to ask for modifications or create something new.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, completionMessage]);
      }, 2000);
    }, 1000);
  };

  const generateSampleCode = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('landing') || lowerPrompt.includes('saas')) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SaaS Landing Page</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <nav class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0 flex items-center">
                        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span class="text-white font-bold">S</span>
                        </div>
                        <span class="ml-2 text-xl font-semibold">SaaSify</span>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="#" class="text-gray-600 hover:text-gray-900">Features</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">Pricing</a>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Get Started</button>
                </div>
            </div>
        </div>
    </nav>

    <main>
        <section class="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 class="text-5xl font-bold text-gray-900 mb-6">
                    Build Amazing Products <br>
                    <span class="text-blue-600">10x Faster</span>
                </h1>
                <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    Our powerful SaaS platform helps you streamline your workflow, 
                    collaborate with your team, and ship products faster than ever before.
                </p>
                <div class="flex justify-center space-x-4">
                    <button class="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700">
                        Start Free Trial
                    </button>
                    <button class="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50">
                        Watch Demo
                    </button>
                </div>
            </div>
        </section>

        <section class="py-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
                    <p class="text-lg text-gray-600">Everything you need to build and scale your business</p>
                </div>
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="text-center p-6">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Lightning Fast</h3>
                        <p class="text-gray-600">Built for speed and performance with modern technologies</p>
                    </div>
                    <div class="text-center p-6">
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Secure & Reliable</h3>
                        <p class="text-gray-600">Enterprise-grade security with 99.9% uptime guarantee</p>
                    </div>
                    <div class="text-center p-6">
                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Team Collaboration</h3>
                        <p class="text-gray-600">Work together seamlessly with real-time collaboration tools</p>
                    </div>
                </div>
            </div>
        </section>
    </main>
</body>
</html>`;
    }

    if (lowerPrompt.includes('directory')) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Directory</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <span class="text-white font-bold">D</span>
                    </div>
                    <span class="ml-2 text-xl font-semibold">DirectoryPro</span>
                </div>
                <nav class="flex space-x-8">
                    <a href="#" class="text-gray-600 hover:text-gray-900">Browse</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">Categories</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">Add Business</a>
                    <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Sign In</button>
                </nav>
            </div>
        </div>
    </header>

    <main>
        <section class="py-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 class="text-5xl font-bold mb-6">Find Local Businesses</h1>
                <p class="text-xl mb-8 opacity-90">Discover the best businesses in your area with our comprehensive directory</p>
                <div class="max-w-2xl mx-auto">
                    <div class="flex gap-4">
                        <input type="text" placeholder="What are you looking for?" class="flex-1 px-4 py-3 rounded-lg text-gray-900">
                        <input type="text" placeholder="Location" class="w-64 px-4 py-3 rounded-lg text-gray-900">
                        <button class="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">Search</button>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-3xl font-bold text-center mb-12">Popular Categories</h2>
                <div class="grid md:grid-cols-4 gap-6">
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold mb-2">Restaurants</h3>
                        <p class="text-gray-600 text-sm">Find the best dining experiences</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold mb-2">Shopping</h3>
                        <p class="text-gray-600 text-sm">Discover local stores and boutiques</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold mb-2">Services</h3>
                        <p class="text-gray-600 text-sm">Professional services and contractors</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                        <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold mb-2">Health & Beauty</h3>
                        <p class="text-gray-600 text-sm">Wellness and beauty services</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-16 bg-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-3xl font-bold text-center mb-12">Featured Businesses</h2>
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="bg-white rounded-lg shadow-md overflow-hidden">
                        <div class="h-48 bg-gradient-to-br from-blue-400 to-purple-500"></div>
                        <div class="p-6">
                            <h3 class="text-xl font-semibold mb-2">The Coffee House</h3>
                            <p class="text-gray-600 mb-4">Premium coffee and pastries in downtown</p>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <span class="text-yellow-400">★★★★★</span>
                                    <span class="ml-2 text-sm text-gray-600">4.8 (124 reviews)</span>
                                </div>
                                <span class="text-green-600 font-semibold">Open</span>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-md overflow-hidden">
                        <div class="h-48 bg-gradient-to-br from-green-400 to-blue-500"></div>
                        <div class="p-6">
                            <h3 class="text-xl font-semibold mb-2">Green Spa & Wellness</h3>
                            <p class="text-gray-600 mb-4">Relaxation and rejuvenation services</p>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <span class="text-yellow-400">★★★★★</span>
                                    <span class="ml-2 text-sm text-gray-600">4.9 (89 reviews)</span>
                                </div>
                                <span class="text-green-600 font-semibold">Open</span>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-md overflow-hidden">
                        <div class="h-48 bg-gradient-to-br from-purple-400 to-pink-500"></div>
                        <div class="p-6">
                            <h3 class="text-xl font-semibold mb-2">Tech Solutions Pro</h3>
                            <p class="text-gray-600 mb-4">IT consulting and support services</p>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <span class="text-yellow-400">★★★★★</span>
                                    <span class="ml-2 text-sm text-gray-600">4.7 (156 reviews)</span>
                                </div>
                                <span class="text-green-600 font-semibold">Open</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <div class="flex items-center mb-4">
                        <div class="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <span class="text-white font-bold">D</span>
                        </div>
                        <span class="ml-2 text-xl font-semibold">DirectoryPro</span>
                    </div>
                    <p class="text-gray-400">Your trusted local business directory</p>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">For Businesses</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white">Add Your Business</a></li>
                        <li><a href="#" class="hover:text-white">Business Login</a></li>
                        <li><a href="#" class="hover:text-white">Pricing</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Support</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white">Help Center</a></li>
                        <li><a href="#" class="hover:text-white">Contact Us</a></li>
                        <li><a href="#" class="hover:text-white">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Connect</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white">Facebook</a></li>
                        <li><a href="#" class="hover:text-white">Twitter</a></li>
                        <li><a href="#" class="hover:text-white">Instagram</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>`;
    }
    if (lowerPrompt.includes('portfolio')) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-black text-white">
    <nav class="fixed top-0 w-full bg-black/80 backdrop-blur-md z-50 border-b border-gray-800">
        <div class="max-w-6xl mx-auto px-6 py-4">
            <div class="flex justify-between items-center">
                <div class="text-2xl font-bold">Alex Chen</div>
                <div class="flex space-x-8">
                    <a href="#work" class="hover:text-purple-400 transition-colors">Work</a>
                    <a href="#about" class="hover:text-purple-400 transition-colors">About</a>
                    <a href="#contact" class="hover:text-purple-400 transition-colors">Contact</a>
                </div>
            </div>
        </div>
    </nav>

    <main class="pt-20">
        <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-blue-900">
            <div class="text-center">
                <h1 class="text-6xl font-bold mb-6">
                    Creative <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Designer</span>
                </h1>
                <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    I craft beautiful digital experiences that blend creativity with functionality. 
                    Specializing in brand identity, web design, and digital art.
                </p>
                <button class="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:scale-105 transition-transform">
                    View My Work
                </button>
            </div>
        </section>

        <section id="work" class="py-20 px-6">
            <div class="max-w-6xl mx-auto">
                <h2 class="text-4xl font-bold text-center mb-16">Featured Projects</h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div class="group cursor-pointer">
                        <div class="bg-gradient-to-br from-purple-600 to-blue-600 h-64 rounded-lg mb-4 group-hover:scale-105 transition-transform"></div>
                        <h3 class="text-xl font-semibold mb-2">Brand Identity Design</h3>
                        <p class="text-gray-400">Complete brand identity for a tech startup</p>
                    </div>
                    <div class="group cursor-pointer">
                        <div class="bg-gradient-to-br from-green-600 to-teal-600 h-64 rounded-lg mb-4 group-hover:scale-105 transition-transform"></div>
                        <h3 class="text-xl font-semibold mb-2">E-commerce Website</h3>
                        <p class="text-gray-400">Modern e-commerce platform design</p>
                    </div>
                    <div class="group cursor-pointer">
                        <div class="bg-gradient-to-br from-orange-600 to-red-600 h-64 rounded-lg mb-4 group-hover:scale-105 transition-transform"></div>
                        <h3 class="text-xl font-semibold mb-2">Mobile App UI</h3>
                        <p class="text-gray-400">Intuitive mobile app interface design</p>
                    </div>
                </div>
            </div>
        </section>
    </main>
</body>
</html>`;
    }

    // Default template
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Your Website</h1>
            <p class="text-lg text-gray-600 mb-8">Generated based on: "${prompt}"</p>
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                    </svg>
                </div>
                <h2 class="text-xl font-semibold mb-2">Website Created!</h2>
                <p class="text-gray-600">Your custom website has been generated successfully.</p>
            </div>
        </div>
    </div>
</body>
</html>`;
  };

  return (
    <div className="w-96 border-r border-border bg-card flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">AI Web Builder</h1>
            <p className="text-sm text-muted-foreground">Powered by AI</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            Fast
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Code className="w-3 h-3 mr-1" />
            Modern
          </Badge>
        </div>
      </div>

      {/* Example Prompts */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">Quick Start</h3>
        <div className="grid grid-cols-2 gap-2">
          {EXAMPLE_PROMPTS.map((example, index) => (
            <Card 
              key={index}
              className="p-3 cursor-pointer hover:bg-accent transition-colors group"
              onClick={() => handleSendMessage(example.prompt)}
            >
              <example.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary mb-2" />
              <h4 className="text-xs font-medium mb-1">{example.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{example.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn(
              "flex gap-3",
              message.type === 'user' ? 'justify-end' : 'justify-start'
            )}>
              {message.type === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={cn(
                "max-w-[80%] rounded-lg p-3 text-sm",
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground ml-auto' 
                  : 'bg-muted'
              )}>
                {message.content}
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          
          {isGenerating && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="bg-muted rounded-lg p-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-muted-foreground">Generating...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Describe the website you want to create..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isGenerating}
            className="flex-1"
          />
          <Button 
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isGenerating}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Describe your website and I'll generate it for you
        </p>
      </div>
    </div>
  );
}