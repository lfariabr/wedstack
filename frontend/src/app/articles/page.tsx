'use client';

import { MainLayout } from "@/components/layouts/MainLayout";
import { usePublishedArticles } from "@/lib/hooks/useArticles";
import { Article } from "@/lib/graphql/types/article.types";
import { AlertCircle, Calendar, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { formatDateSafe } from "@/utils/dateHandler";

export default function ArticlesPage() {
  const { articles, loading, error } = usePublishedArticles();

  return (
    <MainLayout>
      <div className="container py-12 max-w-6xl">
        <div className="space-y-2 mb-10 px-4">
          <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
          <p className="text-muted-foreground">
            Latest thoughts, tutorials, and insights
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
              Error loading articles: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Empty state */}
        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-lg font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              Articles will appear here once they are published.
            </p>
          </div>
        )}

        {/* Articles list */}
        {!loading && !error && articles.length > 0 && (
          <div className="space-y-10 px-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function ArticleCard({ article }: { article: Article }) {
  // Create a preview of the content
  const contentPreview = article.excerpt || (article.content.length > 200
    ? `${article.content.substring(0, 200)}...`
    : article.content);

  return (
    <Link href={`/articles/${article.id}`} className="block group border-b pb-8 last:border-b-0">
      <div className="flex flex-col md:flex-row gap-6 relative">
        {/* Article image */}
        {article.imageUrl && (
          <div className="w-full md:w-1/3 aspect-video bg-muted overflow-hidden rounded-lg">
            <div 
              className="w-full h-full bg-cover bg-center" 
              style={{ backgroundImage: `url(${article.imageUrl})` }}
            />
          </div>
        )}
        
        {/* Article content */}
        <div className="w-full md:w-2/3 space-y-4">
          <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
            {article.title}
          </h2>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Published {formatDateSafe(article.createdAt)}</span>
          </div>
          
          <p className="text-muted-foreground">{contentPreview}</p>
          
          {/* Display tags if available */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <span className="inline-block text-sm font-medium text-primary hover:underline">
            Read more
          </span>
        </div>

        {/* Overlay for better click handling */}
        <span className="absolute inset-0 z-10" aria-hidden="true" />
      </div>
    </Link>
  );
}
