import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const endpoint = process.env.SPACES_ENDPOINT; // e.g., https://syd1.digitaloceanspaces.com
const region = process.env.SPACES_REGION;     // e.g., syd1
const bucket = process.env.SPACES_BUCKET!;
const accessKeyId = process.env.SPACES_KEY!;
const secretAccessKey = process.env.SPACES_SECRET!;

if (!endpoint || !region || !bucket || !accessKeyId || !secretAccessKey) {
  // Do not throw here to avoid crash at import-time in tests; callers can validate.
  console.warn('[Spaces] Missing env configuration. Signing will fail until set.');
}

export const spacesClient = new S3Client({
  region,
  endpoint,
  forcePathStyle: false,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function getPresignedPutUrl(params: {
  key: string;
  contentType: string;
  expiresIn?: number; // seconds
}): Promise<{ url: string; key: string; contentType: string; expiresIn: number }>{
  const { key, contentType, expiresIn = 900 } = params; // default 15 minutes

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    // ACL: 'public-read', // optional if bucket policy already allows public read
  });

  const url = await getSignedUrl(spacesClient, command, { expiresIn });
  return { url, key, contentType, expiresIn };
}

export function publicUrlForKey(key: string): string {
  const cdn = process.env.SPACES_CDN_BASE_URL;
  if (cdn) {
    return `${cdn.replace(/\/$/, '')}/${key}`;
  }
  // Fallback to origin endpoint/bucket path-style
  const origin = process.env.SPACES_ENDPOINT?.replace(/^https?:\/\//, '') || '';
  return `https://${process.env.SPACES_BUCKET}.${origin}/${key}`;
}
