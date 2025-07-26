'use client';

import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useArticle } from "@/lib/hooks/useArticles";
import { AlertCircle, ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { format, parseISO, isValid } from "date-fns";
import { notFound } from "next/navigation";
import { MarkdownMessage } from '@/components/chat/MarkdownMessage';

interface ArticleDetailPageProps {
  params: Promise<{ id: string }>;
}

// Format date safely with fallback
const formatDateSafe = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    if (isValid(date)) {
      return format(date, 'MMMM dd, yyyy');
    }
    return 'Recently';
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Recently';
  }
};

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  // Properly unwrap params with React.use() for Next.js 15
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const { article, loading, error, notFound: articleNotFound } = useArticle(id);
  
  // If article not found, show 404
  if (articleNotFound) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="container py-16 mx-auto px-4">
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
              Error loading article: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Article details */}
        {!loading && !error && article && (
          <>
            <div className="mb-6 px-4">
              <Link href="/articles" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Articles
              </Link>
              
              <h1 className="text-4xl font-bold tracking-tight mt-2">{article.title}</h1>
              
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Published {formatDateSafe(article.createdAt)}</span>
              </div>
            </div>

            {/* Article image */}
            {article.imageUrl && (
              <div className="relative w-full rounded-lg overflow-hidden mb-8 px-4">
                <div 
                  className="aspect-video w-full bg-cover bg-center" 
                  style={{ backgroundImage: `url(${article.imageUrl})` }}
                />
              </div>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 px-4">
                {article.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Article content */}
            <div className="prose dark:prose-invert max-w-none px-4 space-y-1">
            <MarkdownMessage content={article.content} />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
