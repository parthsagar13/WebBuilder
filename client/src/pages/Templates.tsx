import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye,
  Tag,
  TrendingUp
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  frontendTemplate: string;
  backendTemplate: string;
  popularity: number;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
}

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['/api/templates'],
    queryFn: async () => {
      const response = await fetch('/api/templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      return response.json();
    },
  });

  // Mock templates data since we don't have any yet
  const mockTemplates: Template[] = [
    {
      id: '1',
      name: 'Blog Platform',
      description: 'Complete blog platform with user authentication, post creation, comments, and admin dashboard.',
      category: 'blog',
      tags: ['authentication', 'cms', 'dashboard', 'comments'],
      frontendTemplate: '{}',
      backendTemplate: '{}',
      popularity: 156,
      isPublic: true,
      createdBy: 'AI Builder Team',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      name: 'E-commerce Store',
      description: 'Full-featured online store with product catalog, shopping cart, payment integration, and order management.',
      category: 'ecommerce',
      tags: ['payments', 'shopping', 'products', 'orders'],
      frontendTemplate: '{}',
      backendTemplate: '{}',
      popularity: 203,
      isPublic: true,
      createdBy: 'AI Builder Team',
      createdAt: '2024-01-10T14:30:00Z',
    },
    {
      id: '3',
      name: 'Task Management',
      description: 'Project management tool with boards, tasks, team collaboration, and progress tracking.',
      category: 'productivity',
      tags: ['tasks', 'collaboration', 'boards', 'tracking'],
      frontendTemplate: '{}',
      backendTemplate: '{}',
      popularity: 89,
      isPublic: true,
      createdBy: 'AI Builder Team',
      createdAt: '2024-01-20T09:15:00Z',
    },
    {
      id: '4',
      name: 'Social Media Dashboard',
      description: 'Social media management platform with post scheduling, analytics, and multi-account support.',
      category: 'social',
      tags: ['social-media', 'analytics', 'scheduling', 'dashboard'],
      frontendTemplate: '{}',
      backendTemplate: '{}',
      popularity: 134,
      isPublic: true,
      createdBy: 'AI Builder Team',
      createdAt: '2024-01-12T16:45:00Z',
    },
    {
      id: '5',
      name: 'Learning Management System',
      description: 'Educational platform with courses, quizzes, progress tracking, and certification.',
      category: 'education',
      tags: ['courses', 'quizzes', 'learning', 'certification'],
      frontendTemplate: '{}',
      backendTemplate: '{}',
      popularity: 67,
      isPublic: true,
      createdBy: 'AI Builder Team',
      createdAt: '2024-01-18T11:20:00Z',
    },
    {
      id: '6',
      name: 'Real Estate Platform',
      description: 'Property listing website with search filters, virtual tours, and agent management.',
      category: 'business',
      tags: ['properties', 'search', 'tours', 'agents'],
      frontendTemplate: '{}',
      backendTemplate: '{}',
      popularity: 92,
      isPublic: true,
      createdBy: 'AI Builder Team',
      createdAt: '2024-01-08T13:30:00Z',
    },
  ];

  const allTemplates = templates.length > 0 ? templates : mockTemplates;

  const categories = ['all', ...new Set(allTemplates.map(t => t.category))];

  const filteredTemplates = allTemplates
    .filter((template: Template) => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a: Template, b: Template) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading templates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              App Templates
            </h1>
            <p className="text-muted-foreground mt-2">
              Jumpstart your development with pre-built application templates.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <TrendingUp className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search terms or filters to find the template you're looking for.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template: Template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {template.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {template.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-current text-yellow-400" />
                    <span>{template.popularity} uses</span>
                    <span>•</span>
                    <span>By {template.createdBy}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="mr-2 h-3 w-3" />
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Download className="mr-2 h-3 w-3" />
                      Use Template
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Added {formatDate(template.createdAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}