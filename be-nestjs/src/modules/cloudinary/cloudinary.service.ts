import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  v2 as cloudinary,
  type UploadApiResponse,
  type UploadApiErrorResponse,
} from 'cloudinary';
import { getResourceTypeFromFile, getResourceTypeFromUrl, configureCloudinary, getPublicIdFromUrl } from './cloudinary.config.js';


@Injectable()
export class CloudinaryService implements OnModuleInit {
  private readonly logger = new Logger(CloudinaryService.name);

  onModuleInit() {
    configureCloudinary();
    this.logger.log('Cloudinary configured successfully');
  }

  /**
   * Upload file từ Multer buffer lên Cloudinary
   */
  async uploadFile(
    file: Express.Multer.File,
    customFolder?: string,
  ): Promise<UploadApiResponse> {
    if (!file || !file.buffer) {
      throw new Error('File buffer is required');
    }

    const targetFolder =
      customFolder || process.env.CLOUDINARY_CLOUD_FOLDER || 'IT-JOB';
    const resourceType = getResourceTypeFromFile(file);

    const uploadOptions: Record<string, any> = {
      folder: targetFolder,
      resource_type: resourceType,
    };

    if (resourceType === 'raw' && file.originalname) {
      const randomString = Math.random().toString(36).substring(2, 10);
      const ext = file.originalname.toLowerCase().split('.').pop();
      uploadOptions.public_id = `${randomString}_${Date.now()}.${ext}`;
    }

    if (resourceType === 'image') {
      uploadOptions.transformation = [
        { quality: 'auto', fetch_format: 'auto' },
      ];
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Cloudinary upload returned empty result'));
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  /**
   * Xóa file khỏi Cloudinary bằng URL
   */
  async deleteFile(url: string): Promise<boolean> {
    try {
      if (!url) return false;

      const publicId = getPublicIdFromUrl(url);
      if (!publicId) return false;

      const resourceType = getResourceTypeFromUrl(url);

      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });

      return result.result === 'ok';
    } catch (error) {
      this.logger.error(`Error deleting file from Cloudinary: ${url}`, error);
      return false;
    }
  }
}
