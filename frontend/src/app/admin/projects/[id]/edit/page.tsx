'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectMutations } from '@/lib/hooks/useProjectMutations';
import { ProjectUpdateInput } from '@/lib/graphql/types/project.types';
import ProjectForm from '@/components/projects/ProjectForm';
import { useProject } from '@/lib/hooks/useProjects';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  // Properly unwrap params with React.use() for Next.js 15
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateProject } = useProjectMutations();
  const { project, loading, error } = useProject(id);
  const router = useRouter();
  
  const handleUpdateProject = async (projectData: ProjectUpdateInput) => {
    try {
      setIsSubmitting(true);
      await updateProject(id, projectData);
      router.push('/admin/projects');
      // Success toast is handled in the useProjectMutations hook
    } catch (error) {
      // Error toast is handled in the useProjectMutations hook
      console.error('Error updating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <p className="text-destructive">
          {error ? `Error loading project: ${error}` : 'Project not found'}
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.push('/admin/projects')}
        >
          Return to Projects
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
        <p className="text-muted-foreground">
          Update project "{project.title}"
        </p>
      </div>
      
      <div className="max-w-2xl">
        <ProjectForm 
          project={project}
          onSubmit={handleUpdateProject}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
