import Photo from '../../models/Photo';
import { logger } from '../../utils/logger';
import { getPresignedPutUrl, publicUrlForKey } from '../../services/spaces';
import { isValidUploadPasscode } from '../../utils/passcode';
import crypto from 'crypto';

function makeKey(filename: string): string {
  const ts = new Date();
  const y = ts.getUTCFullYear();
  const m = String(ts.getUTCMonth() + 1).padStart(2, '0');
  const d = String(ts.getUTCDate()).padStart(2, '0');
  const base = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const id = crypto.randomUUID();
  return `uploads/${y}/${m}/${d}/${id}-${base}`;
}

export const photoMutations = {
  getPhotoUploadUrl: async (
    _: any,
    { filename, contentType, passcode }: { filename: string; contentType: string; passcode: string }
  ) => {
    try {
      if (!isValidUploadPasscode(passcode)) {
        logger.warn('Invalid upload passcode provided');
        throw new Error('Invalid passcode');
      }

      if (!contentType.startsWith('image/')) {
        throw new Error('Only image uploads are allowed');
      }

      const key = makeKey(filename);
      const { url, expiresIn } = await getPresignedPutUrl({ key, contentType, expiresIn: 15 * 60 });

      return { url, key, contentType, expiresIn };
    } catch (err) {
      logger.error('Error generating photo upload URL:', err);
      throw new Error('Failed to generate upload URL');
    }
  },

  addPhoto: async (
    _: any,
    { input }: { input: { key: string; url: string; contentType: string; width?: number; height?: number; uploaderName?: string } }
  ) => {
    try {
      // Basic validation
      if (!input.key || !input.url || !input.contentType) {
        throw new Error('key, url and contentType are required');
      }
      if (!input.contentType.startsWith('image/')) {
        throw new Error('Only image uploads are allowed');
      }

      // Optionally ensure url matches our expected public URL for the key
      const expectedUrlPrefix = publicUrlForKey(input.key).replace(/\?.*$/, '');
      const urlNormalized = input.url.replace(/\?.*$/, '');
      if (!urlNormalized.startsWith(expectedUrlPrefix.split(input.key)[0])) {
        logger.warn('addPhoto url does not match expected public base; continuing for MVP');
      }

      const created = await Photo.create({
        key: input.key,
        url: input.url,
        contentType: input.contentType,
        width: input.width,
        height: input.height,
        uploaderName: input.uploaderName,
      });

      return {
        id: (created._id as string).toString(),
        ...created.toObject(),
      };
    } catch (err) {
      logger.error('Error adding photo metadata:', err);
      throw new Error('Failed to save photo');
    }
  },
};
