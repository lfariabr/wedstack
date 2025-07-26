'use client';

import React from "react";
import { ArticleForm } from "@/components/forms/ArticleForm";
import { Button } from "@/components/ui/button";
import { ArticleUpdateInput } from "@/lib/graphql/types/article.types";
import { useArticleMutations } from "@/lib/hooks/useArticleMutations";
import { useArticle } from "@/lib/hooks/useArticles";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { notFound } from "next/navigation";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  // Properly unwrap params with React.use() for Next.js 15
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const router = useRouter();
  const { article, loading: articleLoading, error, notFound: articleNotFound } = useArticle(id);
  const { updateArticle, loading } = useArticleMutations();

  // If article not found, show 404
  if (articleNotFound) {
    notFound();
  }

  const handleSubmit = async (data: ArticleUpdateInput) => {
    const result = await updateArticle(id, data);
    if (result) {
      router.push('/admin/articles');
    }
  };

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" asChild className="mr-4">
          <Link href="/admin/articles" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Article</h1>
      </div>

      {/* Loading state */}
      {articleLoading && (
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

      {/* Edit form */}
      {!articleLoading && !error && article && (
        <div className="max-w-3xl mx-auto">
          <ArticleForm
            article={article}
            onSubmit={handleSubmit}
            loading={loading.update}
            submitLabel="Update Article"
            cancelAction={() => router.push('/admin/articles')}
          />
        </div>
      )}
    </div>
  );
}
