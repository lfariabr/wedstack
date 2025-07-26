'use client';

import { useProjects } from "@/lib/hooks/useProjects";
import { useArticles } from "@/lib/hooks/useArticles";
import { useAuth } from "@/lib/auth/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FolderKanban, Users, BarChart3, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { projects, loading: projectsLoading } = useProjects();
  const { articles, loading: articlesLoading } = useArticles();
  const { user } = useAuth();
  
  // Simple statistics for the dashboard
  const stats = [
    {
      title: "Total Projects",
      value: projectsLoading ? "..." : projects.length,
      description: "Projects in your portfolio",
      icon: FolderKanban,
      color: "text-blue-500",
      link: "/admin/projects"
    },
    {
      title: "Total Articles",
      value: articlesLoading ? "..." : articles.length,
      description: "Published and draft articles",
      icon: FileText,
      color: "text-green-500",
      link: "/admin/articles"
    },
    {
      title: "User Role",
      value: user?.role || "...",
      description: "Your current permission level",
      icon: Users,
      color: "text-orange-500",
      link: "/admin/settings"
    },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your portfolio.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground pt-1">
                {stat.description}
              </p>
              <Link href={stat.link} className="mt-3 inline-block">
                <Button variant="ghost" size="sm" className="h-7 gap-1">
                  View <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>
                Add a new project to your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/projects/new">
                <Button>New Project</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Write New Article</CardTitle>
              <CardDescription>
                Create a new article or blog post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/articles/new">
                <Button>New Article</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Recent Activity (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
          <CardDescription>
            Your latest actions and updates
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div className="p-8 text-center">
            <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground/60" />
            <p className="mt-2">Activity tracking coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
