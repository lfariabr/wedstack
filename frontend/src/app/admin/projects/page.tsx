'use client';

import { useState } from 'react';
import { useProjects } from '@/lib/hooks/useProjects';
import { useProjectMutations } from '@/lib/hooks/useProjectMutations';
import { Project } from '@/lib/graphql/types/project.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, PlusCircle, Loader2, ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminProjectsPage() {
  const { projects, loading: projectsLoading, error } = useProjects();
  const { deleteProject, loading: mutationLoading } = useProjectMutations();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  // Handle project deletion with confirmation
  const handleDeleteProject = async (project: Project) => {
    if (confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
      try {
        setDeletingId(project.id);
        await deleteProject(project.id);
        toast.success(`Project "${project.title}" deleted successfully`);
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (projectsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <p className="text-destructive">Error loading projects: {error.message}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.refresh()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-[300px] text-center">
            <h3 className="text-lg font-semibold">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first project to showcase in your portfolio
            </p>
            <Link href="/admin/projects/new">
              <Button>Create Project</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden flex flex-col">
              <div className="aspect-video relative">
                {project.imageUrl && (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex gap-3">
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-muted-foreground hover:text-foreground flex items-center text-sm gap-1"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                  <a
                    href={`/projects/${project.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground flex items-center text-sm gap-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Live
                  </a>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Link href={`/admin/projects/${project.id}/edit`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => handleDeleteProject(project)}
                  disabled={deletingId === project.id}
                >
                  {deletingId === project.id ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
