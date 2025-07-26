import Article from '../../models/Article';

export const articleQueries = {
  articles: async (_: any, { limit = 10, offset = 0 }: { limit?: number, offset?: number }) => {
    return await Article.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
  },
  
  article: async (_: any, { id }: { id: string }) => {
    return await Article.findById(id);
  },
  
  articleBySlug: async (_: any, { slug }: { slug: string }) => {
    return await Article.findOne({ slug });
  },
  
  publishedArticles: async (_: any, { limit = 10, offset = 0 }: { limit?: number, offset?: number }) => {
    return await Article.find({ published: true })
      .sort({ publishedAt: -1 })
      .skip(offset)
      .limit(limit);
  },
  
  articlesByCategory: async (_: any, { 
    category, 
    limit = 10, 
    offset = 0 
  }: { 
    category: string, 
    limit?: number, 
    offset?: number 
  }) => {
    return await Article.find({ 
      categories: category,
      published: true 
    })
      .sort({ publishedAt: -1 })
      .skip(offset)
      .limit(limit);
  },
  
  articlesByTag: async (_: any, { 
    tag, 
    limit = 10, 
    offset = 0 
  }: { 
    tag: string, 
    limit?: number, 
    offset?: number 
  }) => {
    return await Article.find({ 
      tags: tag,
      published: true 
    })
      .sort({ publishedAt: -1 })
      .skip(offset)
      .limit(limit);
  },
};
