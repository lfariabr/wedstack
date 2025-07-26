'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectMutations } from '@/lib/hooks/useProjectMutations';
import { ProjectInput } from '@/lib/graphql/types/project.types';
import ProjectForm from '@/components/projects/ProjectForm';
import { toast } from 'sonner';

export default function NewProjectPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createProject } = useProjectMutations();
  const router = useRouter();
  
  const handleCreateProject = async (projectData: ProjectInput) => {
    try {
      setIsSubmitting(true);
      await createProject(projectData);
      router.push('/admin/projects');
      // Success toast is handled in the useProjectMutations hook
    } catch (error) {
      // Error toast is handled in the useProjectMutations hook
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Project</h1>
        <p className="text-muted-foreground">
          Add a new project to your portfolio
        </p>
      </div>
      
      <div className="max-w-2xl">
        <ProjectForm 
          onSubmit={handleCreateProject}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
