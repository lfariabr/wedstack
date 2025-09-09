import Photo from '../../models/Photo';
import { logger } from '../../utils/logger';

export const photoQueries = {
  photos: async () => {
    try {
      logger.info('Fetching all photos from database');
      const docs = await Photo.find({}).sort({ createdAt: -1 }).lean();
      return docs.map((p: any) => ({ 
        ...p, 
        id: p._id.toString(),
        createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: p.updatedAt ? p.updatedAt.toISOString() : new Date().toISOString()
      }));
    } catch (err) {
      logger.error('Error fetching photos:', err);
      throw new Error('Failed to fetch photos');
    }
  },

  photosPaginated: async (_: any, { limit = 20, offset = 0 }: { limit?: number; offset?: number }) => {
    try {
      logger.info(`Fetching photos with pagination - limit: ${limit}, offset: ${offset}`);
      const docs = await Photo.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .lean();

      const total = await Photo.countDocuments({});
      return {
        photos: docs.map((p: any) => ({ 
          ...p, 
          id: p._id.toString(),
          createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
          updatedAt: p.updatedAt ? p.updatedAt.toISOString() : new Date().toISOString()
        })),
        total,
        hasMore: offset + limit < total,
      };
    } catch (err) {
      logger.error('Error fetching paginated photos:', err);
      throw new Error('Failed to fetch photos');
    }
  },
};
