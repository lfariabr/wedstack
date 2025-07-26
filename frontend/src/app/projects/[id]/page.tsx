'use client';

import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useProject } from "@/lib/hooks/useProjects";
import { AlertCircle, ArrowLeft, Calendar, Github, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import { notFound } from "next/navigation";
import { MarkdownMessage } from '@/components/chat/MarkdownMessage';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

// Format date safely with fallback
const formatDateSafe = (dateString: string) => {
  try {
    // First try to parse the ISO string
    const date = parseISO(dateString);
    
    // Check if the result is a valid date
    if (isValid(date)) {
      return `${formatDistanceToNow(date)} ago`;
    }
    
    // If it's not a valid ISO date, try direct Date constructor
    const fallbackDate = new Date(dateString);
    if (isValid(fallbackDate)) {
      return `${formatDistanceToNow(fallbackDate)} ago`;
    }
    
    // If all parsing fails, return a fallback
    return 'recently';
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'recently';
  }
};

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  // Properly unwrap params with React.use() for Next.js 15
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const { project, loading, error, notFound: projectNotFound } = useProject(id);
  
  // If project not found, show 404
  if (projectNotFound) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="container py-16 mx-auto px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Loading project...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="my-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading project: {error}
            </AlertDescription>
          </Alert>
        ) : project ? (
          <div className="space-y-8 px-4">
            <Button variant="outline" size="sm" asChild className="mb-4">
              <Link href="/projects" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
            
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{project.title}</h1>
              <p className="text-muted-foreground mt-2 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Last updated {formatDateSafe(project.updatedAt)}
              </p>
            </div>
            
            {project.imageUrl && (
              <div className="overflow-hidden rounded-lg border">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-auto object-cover max-h-[400px]"
                />
              </div>
            )}
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">About this project</h2>
              <div className="prose prose-stone dark:prose-invert space-y-1">
                <MarkdownMessage content={project.description} />
              </div>
            </div>
            
            {project.technologies && project.technologies.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <div key={i} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {project.githubUrl && (
              <div className="pt-4">
                <Button variant="outline" asChild>
                  <a 
                    href={project.githubUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
}
