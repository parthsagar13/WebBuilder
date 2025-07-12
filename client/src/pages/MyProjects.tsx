import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  Calendar, 
  Code, 
  Download, 
  ExternalLink, 
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Link } from 'wouter';

interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  prompt: string;
  status: 'generating' | 'completed' | 'failed' | 'draft';
  uiLibrary: string;
  generationType: string;
  frontendCode?: string;
  backendCode?: string;
  previewUrl?: string;
  downloadUrl?: string;
  githubRepoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyProjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects?userId=demo-user');
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    },
  });

  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
            <p className="text-muted-foreground">Loading your projects...</p>
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
              <FolderOpen className="h-8 w-8 text-primary" />
              My Projects
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and access all your AI-generated applications.
            </p>
          </div>
          <Link href="/ai-generator">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="generating">Generating</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {projects.length === 0 ? 'No projects yet' : 'No projects match your search'}
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {projects.length === 0 
                ? 'Start building your first AI-generated application by describing what you want to create.'
                : 'Try adjusting your search terms or filters to find the project you\'re looking for.'
              }
            </p>
            {projects.length === 0 && (
              <Link href="/ai-generator">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Project
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: Project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {project.description || 'No description'}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Code className="h-4 w-4" />
                      <span>{project.generationType} • {project.uiLibrary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Created {formatDate(project.createdAt)}</span>
                    </div>
                  </div>

                  {project.prompt && (
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {project.prompt}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {project.status === 'completed' && (
                      <>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="mr-2 h-3 w-3" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <ExternalLink className="mr-2 h-3 w-3" />
                          Preview
                        </Button>
                      </>
                    )}
                    {project.status === 'generating' && (
                      <Button size="sm" variant="outline" className="w-full" disabled>
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-2"></div>
                        Generating...
                      </Button>
                    )}
                    {project.status === 'failed' && (
                      <Button size="sm" variant="outline" className="w-full">
                        Retry Generation
                      </Button>
                    )}
                    {project.status === 'draft' && (
                      <Button size="sm" className="w-full">
                        Continue Editing
                      </Button>
                    )}
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