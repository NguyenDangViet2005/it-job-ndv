import { v2 as cloudinary } from 'cloudinary';

export type CloudinaryResourceType = 'image' | 'video' | 'raw';

// 1. Cấu hình SDK Cloudinary
export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

// 2. Xác định Resource Type từ File (image, video, raw cho document/pdf)
export const getResourceTypeFromFile = (
  file: Express.Multer.File,
): CloudinaryResourceType => {
  const mimetype = file.mimetype || '';

  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('image/')) return 'image';

  const filename = file.originalname || '';
  const ext = filename.toLowerCase().split('.').pop() || '';

  const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv'];
  if (videoExtensions.includes(ext)) return 'video';

  const documentExtensions = [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
  ];
  if (documentExtensions.includes(ext)) return 'raw';

  return 'image';
};

// 3. Xác định Resource Type từ URL đã upload
export const getResourceTypeFromUrl = (url: string): CloudinaryResourceType => {
  if (!url) return 'image';

  const ext = url.toLowerCase().split('.').pop()?.split('?')[0] || '';

  const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv'];
  if (videoExtensions.includes(ext)) return 'video';

  const documentExtensions = [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
  ];
  if (documentExtensions.includes(ext)) return 'raw';

  return 'image';
};

// 4. Trích xuất Public ID từ URL Cloudinary để xóa
export const getPublicIdFromUrl = (url: string): string | null => {
  if (!url) return null;
  try {
    const resourceType = getResourceTypeFromUrl(url);
    if (resourceType === 'raw') {
      const regex = /\/upload\/(?:v\d+\/)?(.+)$/;
      const match = url.match(regex);
      return match ? match[1] : null;
    }
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  } catch {
    return null;
  }
};