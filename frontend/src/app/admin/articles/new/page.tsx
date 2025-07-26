'use client';

import { ArticleForm } from "@/components/forms/ArticleForm";
import { Button } from "@/components/ui/button";
import { ArticleInput } from "@/lib/graphql/types/article.types";
import { useArticleMutations } from "@/lib/hooks/useArticleMutations";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewArticlePage() {
  const router = useRouter();
  const { createArticle, loading } = useArticleMutations();

  const handleSubmit = async (data: ArticleInput) => {
    const result = await createArticle(data);
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
        <h1 className="text-3xl font-bold tracking-tight">Create New Article</h1>
      </div>

      <div className="max-w-3xl mx-auto">
        <ArticleForm
          onSubmit={handleSubmit}
          loading={loading.create}
          submitLabel="Create Article"
          cancelAction={() => router.push('/admin/articles')}
        />
      </div>
    </div>
  );
}
