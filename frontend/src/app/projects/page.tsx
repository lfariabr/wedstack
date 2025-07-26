'use client';

import { MainLayout } from "@/components/layouts/MainLayout";
import { useProjects } from "@/lib/hooks/useProjects";
import { Project } from "@/lib/graphql/types/project.types";
import { AlertCircle, Loader2, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { formatDateSafe } from "@/utils/dateHandler";

export default function ProjectsPage() {
  const { projects, loading, error } = useProjects();

  return (
    <MainLayout>
      <div className="container py-12 max-w-6xl">
        <div className="space-y-2 mb-10 px-4">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            A showcase of my recent development work and technical projects.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <Alert variant="destructive" className="my-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading projects: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground">
              Projects will appear here once they are added.
            </p>
          </div>
        )}

        {/* Projects grid */}
        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`} className="relative block group">
      <div className="group rounded-lg border overflow-hidden bg-card text-card-foreground shadow hover:shadow-lg transition-all hover:scale-[1.02] h-full">
        <div className="aspect-video w-full bg-muted relative overflow-hidden">
          {project.imageUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${project.imageUrl})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/80 flex items-center justify-center text-2xl font-bold">
              {project.title}
            </div>
          )}
        </div>

        <div className="p-5 sm:p-7 flex flex-col h-full relative z-10">
          <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
          <p className="text-muted-foreground mb-2 text-sm line-clamp-3">
            {project.description.length > 150
              ? `${project.description.substring(0, 150)}...`
              : project.description}
          </p>

          {/* Display tags if available */}
          <div className="mt-4">
          {/* Tags */}
          {project.technologies?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {project.technologies.map((tech, index) => (
                <span 
                  key={index}
                  className="bg-black text-gray-300 font-mono px-3 py-1.5 rounded-md text-xs border border-gray-800 shadow-[0_0_3px_#848884]"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Date */}
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Published {formatDateSafe(project.createdAt)}</span>
          </div>
        </div>

          <div className="flex gap-3 mb-2">
            {project.githubUrl && (
              <span 
                onClick={(e) => {
                  e.preventDefault();
                  window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
                }}
                className="text-sm font-medium hover:underline z-20 cursor-pointer"
              >
                GitHub
              </span>
            )}
            <span className="text-sm font-medium text-primary hover:underline z-20">
              View Details
            </span>
          </div>

          {project.technologies?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t">
              {project.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <span className="absolute inset-0 z-10" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}