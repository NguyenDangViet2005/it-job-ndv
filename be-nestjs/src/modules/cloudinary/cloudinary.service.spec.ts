import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Logger } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service.js';
import { v2 as cloudinary } from 'cloudinary';

vi.mock('cloudinary', () => ({
  v2: {
    config: vi.fn(),
    uploader: { upload_stream: vi.fn(), destroy: vi.fn() },
  },
}));

describe('CloudinaryService', () => {
  let service: CloudinaryService;
  const end = vi.fn();
  const file = (originalname = 'avatar.png', mimetype = 'image/png') =>
    ({
      originalname,
      mimetype,
      buffer: Buffer.from('file contents'),
    }) as Express.Multer.File;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new CloudinaryService();
    vi.stubEnv('CLOUDINARY_CLOUD_FOLDER', 'configured-folder');
    vi.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    vi.mocked(cloudinary.uploader.upload_stream).mockImplementation(
      (...args: unknown[]) => {
        const callback = args.at(-1) as (
          error: unknown,
          result?: unknown,
        ) => void;
        // A real stream reports completion after receiving the buffer.
        end.mockImplementation(() =>
          callback(undefined, { secure_url: 'https://cdn.test/new-file' }),
        );
        return { end } as never;
      },
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it.each([undefined, {}])(
    'rejects a missing file or buffer',
    async (input) => {
      await expect(
        service.uploadFile(input as Express.Multer.File),
      ).rejects.toThrow('Dữ liệu file');
      expect(cloudinary.uploader.upload_stream).not.toHaveBeenCalled();
    },
  );

  it('uploads the buffer with the custom folder and image optimizations', async () => {
    const input = file();
    await expect(service.uploadFile(input, 'avatars')).resolves.toMatchObject({
      secure_url: 'https://cdn.test/new-file',
    });
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
      {
        folder: 'avatars',
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      expect.any(Function),
    );
    expect(end).toHaveBeenCalledWith(input.buffer);
  });

  it('uses the configured folder when no custom folder is provided', async () => {
    await service.uploadFile(file('clip.mp4', 'video/mp4'));
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
      { folder: 'configured-folder', resource_type: 'video' },
      expect.any(Function),
    );
  });

  it('falls back to IT-JOB when no folder is configured', async () => {
    vi.stubEnv('CLOUDINARY_CLOUD_FOLDER', '');
    await service.uploadFile(file());
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
      expect.objectContaining({ folder: 'IT-JOB' }),
      expect.any(Function),
    );
  });

  it('keeps the extension in raw document public IDs', async () => {
    await service.uploadFile(file('CV.PDF', 'application/pdf'));
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
      expect.objectContaining({
        resource_type: 'raw',
        public_id: expect.stringMatching(/\.pdf$/),
      }),
      expect.any(Function),
    );
    const options = vi.mocked(cloudinary.uploader.upload_stream).mock
      .calls[0][0];
    expect(options).not.toHaveProperty('transformation');
  });

  it('propagates upload callback errors', async () => {
    const error = new Error('Cloudinary unavailable');
    vi.mocked(cloudinary.uploader.upload_stream).mockImplementation(
      (...args: unknown[]) => {
        const callback = args.at(-1) as (error: unknown) => void;
        return { end: () => callback(error) } as never;
      },
    );
    await expect(service.uploadFile(file())).rejects.toBe(error);
  });

  it('rejects a callback without a result', async () => {
    vi.mocked(cloudinary.uploader.upload_stream).mockImplementation(
      (...args: unknown[]) => {
        const callback = args.at(-1) as (
          error: undefined,
          result: undefined,
        ) => void;
        return { end: () => callback(undefined, undefined) } as never;
      },
    );
    await expect(service.uploadFile(file())).rejects.toThrow(
      'không nhận được phản hồi',
    );
  });

  it.each(['', 'not-a-cloudinary-url'])(
    'does not delete an invalid URL: %s',
    async (url) => {
      await expect(service.deleteFile(url)).resolves.toBe(false);
      expect(cloudinary.uploader.destroy).not.toHaveBeenCalled();
    },
  );

  it.each([
    ['image', 'avatars/an.png', 'avatars/an'],
    ['video', 'posts/clip.mp4', 'posts/clip'],
    ['raw', 'cvs/an.pdf', 'cvs/an.pdf'],
  ])(
    'deletes a %s using the correct public ID and resource type',
    async (type, path, publicId) => {
      vi.mocked(cloudinary.uploader.destroy).mockResolvedValue({
        result: 'ok',
      });
      await expect(
        service.deleteFile(
          `https://res.cloudinary.com/demo/${type}/upload/v123/${path}`,
        ),
      ).resolves.toBe(true);
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(publicId, {
        resource_type: type,
      });
    },
  );

  it('returns false for a file that was not found', async () => {
    vi.mocked(cloudinary.uploader.destroy).mockResolvedValue({
      result: 'not found',
    });
    await expect(
      service.deleteFile(
        'https://res.cloudinary.com/demo/image/upload/v1/a.png',
      ),
    ).resolves.toBe(false);
  });

  it('returns false instead of throwing when the SDK fails', async () => {
    vi.mocked(cloudinary.uploader.destroy).mockRejectedValue(
      new Error('network failed'),
    );
    await expect(
      service.deleteFile(
        'https://res.cloudinary.com/demo/image/upload/v1/a.png',
      ),
    ).resolves.toBe(false);
  });
});
