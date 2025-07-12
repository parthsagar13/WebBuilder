import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Code, Download, ExternalLink } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface GenerationResponse {
  id: string;
  prompt: string;
  uiLibrary: string;
  generationType: string;
  status: string;
  frontendCode?: string;
  backendCode?: string;
}

export default function AIGenerator() {
  const [prompt, setPrompt] = useState('');
  const [uiLibrary, setUILibrary] = useState('tailwind');
  const [generationType, setGenerationType] = useState('full-stack');
  const [projectName, setProjectName] = useState('');
  const [generatedProject, setGeneratedProject] = useState<GenerationResponse | null>(null);
  
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: async (data: {
      prompt: string;
      uiLibrary: string;
      generationType: string;
      projectName: string;
    }) => {
      const response = await apiRequest('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          userId: 'demo-user' // In a real app, this would come from authentication
        }),
      });
      return response;
    },
    onSuccess: (data) => {
      setGeneratedProject(data);
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !projectName.trim()) return;
    
    generateMutation.mutate({
      prompt: prompt.trim(),
      uiLibrary,
      generationType,
      projectName: projectName.trim(),
    });
  };

  const downloadProject = () => {
    if (!generatedProject) return;
    
    // Create a simple download (in a real app, this would be a proper ZIP file)
    const projectData = {
      frontend: generatedProject.frontendCode ? JSON.parse(generatedProject.frontendCode) : {},
      backend: generatedProject.backendCode ? JSON.parse(generatedProject.backendCode) : {},
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName || 'generated-project'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          AI App Generator
        </h1>
        <p className="text-muted-foreground mt-2">
          Describe your app idea and let AI generate a complete MERN stack application for you.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Generation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Your App</CardTitle>
            <CardDescription>
              Enter a detailed description of the application you want to build.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Awesome App"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">App Description</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Create a blog application with user authentication, post creation, comments, and a dashboard for managing posts..."
                  rows={4}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Be specific about features, functionality, and any special requirements.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="uiLibrary">UI Library</Label>
                  <Select value={uiLibrary} onValueChange={setUILibrary}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tailwind">Tailwind CSS</SelectItem>
                      <SelectItem value="bootstrap">Bootstrap</SelectItem>
                      <SelectItem value="material-ui">Material UI</SelectItem>
                      <SelectItem value="chakra-ui">Chakra UI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="generationType">Generation Type</Label>
                  <Select value={generationType} onValueChange={setGenerationType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-stack">Full Stack (React + Node.js)</SelectItem>
                      <SelectItem value="frontend-only">Frontend Only (React)</SelectItem>
                      <SelectItem value="backend-only">Backend Only (Node.js)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={generateMutation.isPending || !prompt.trim() || !projectName.trim()}
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Your App...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate App
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Generation Result */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Project</CardTitle>
            <CardDescription>
              {generatedProject 
                ? "Your app has been generated! Review the code and download it."
                : "Your generated project will appear here."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generateMutation.isPending && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    AI is generating your application...
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This usually takes 30-60 seconds
                  </p>
                </div>
              </div>
            )}

            {generateMutation.isError && (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <Code className="h-12 w-12 mx-auto mb-2" />
                  <p>Generation failed</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Please try again or modify your prompt.
                </p>
              </div>
            )}

            {generatedProject && (
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Project Details</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Name:</span> {projectName}</p>
                    <p><span className="font-medium">Type:</span> {generationType}</p>
                    <p><span className="font-medium">UI Library:</span> {uiLibrary}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {generatedProject.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Generated Prompt</h3>
                  <p className="text-sm text-muted-foreground">{generatedProject.prompt}</p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={downloadProject} className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download Project
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Preview
                  </Button>
                </div>

                {generatedProject.frontendCode && (
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Frontend Code Preview</h3>
                    <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                      <code>
                        {JSON.stringify(JSON.parse(generatedProject.frontendCode), null, 2).slice(0, 500)}
                        {JSON.stringify(JSON.parse(generatedProject.frontendCode), null, 2).length > 500 && '...'}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {!generatedProject && !generateMutation.isPending && !generateMutation.isError && (
              <div className="text-center py-12">
                <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Fill out the form and click "Generate App" to get started.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}