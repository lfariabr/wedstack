'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Article, ArticleInput } from "@/lib/graphql/types/article.types";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

// Form validation schema
const articleFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string().min(1, { message: "Slug is required" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { 
      message: "Slug must contain only lowercase letters, numbers, and hyphens" 
    }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  imageUrl: z.string().url({ message: "Must be a valid URL" }),
  excerpt: z.string().max(150, { message: "Excerpt must be 150 characters or less" }).optional(),
  tags: z.array(z.string()).optional(),
});

type ArticleFormValues = z.infer<typeof articleFormSchema>;

interface ArticleFormProps {
  article?: Article;
  onSubmit: (data: ArticleInput) => Promise<void>;
  loading: boolean;
  submitLabel: string;
  cancelAction?: () => void;
}

export function ArticleForm({ 
  article, 
  onSubmit, 
  loading, 
  submitLabel,
  cancelAction 
}: ArticleFormProps) {
  const router = useRouter();
  const [tagInput, setTagInput] = useState<string>("");
  const [autoSlug, setAutoSlug] = useState(!article?.slug);
  
  // Form default values
  const defaultValues: Partial<ArticleFormValues> = {
    title: article?.title || "",
    slug: article?.slug || "",
    content: article?.content || "",
    imageUrl: article?.imageUrl || "",
    excerpt: article?.excerpt || "",
    tags: article?.tags || [],
  };
  
  // Initialize form
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues,
  });
  
  // Generate slug from title if auto-slug is enabled
  useEffect(() => {
    if (autoSlug) {
      const title = form.watch('title');
      if (title) {
        const generatedSlug = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-')     // Replace spaces with hyphens
          .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
          .trim();
        form.setValue('slug', generatedSlug);
      }
    }
  }, [form.watch('title'), autoSlug, form]);
  
  // Handle tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = tagInput.trim();
    if ((e.key === "Enter" || e.key === ",") && value) {
      e.preventDefault();
      const currentTags = form.getValues("tags") || [];
      if (!currentTags.includes(value)) {
        form.setValue("tags", [...currentTags, value]);
        setTagInput("");
      }
    }
  };
  
  // Remove tag
  const removeTag = (tag: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((t) => t !== tag)
    );
  };

  // Handle form submission
  const handleSubmit = async (data: ArticleFormValues) => {
    await onSubmit(data);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Title field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Article title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Slug field */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Slug</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={autoSlug} 
                        onCheckedChange={setAutoSlug} 
                        id="auto-slug"
                      />
                      <label 
                        htmlFor="auto-slug" 
                        className="text-sm text-muted-foreground cursor-pointer"
                      >
                        Auto-generate
                      </label>
                    </div>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="article-slug" 
                      {...field} 
                      disabled={autoSlug}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be used in the URL: /articles/your-slug
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Image URL field */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a URL to an image for this article
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Excerpt field */}
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief summary of the article (max 150 characters)"
                      className="resize-none"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be displayed in article listings
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Tags input */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        placeholder="Add tags (press Enter or comma to add)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value?.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="py-1 px-3">
                            {tag}
                            <X
                              className="ml-1 h-3 w-3 cursor-pointer"
                              onClick={() => removeTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Tags help categorize your article
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Content field */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Write your article content here..."
                      className="min-h-[300px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Form actions */}
            <div className="flex justify-end gap-4">
              {cancelAction && (
                <Button type="button" variant="outline" onClick={cancelAction}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : submitLabel}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
