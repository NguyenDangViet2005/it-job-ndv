import { Logger } from '@nestjs/common';

export interface LeakyBucketOptions {
  /**
   * Dung lượng tối đa của hàng đợi đệm (Buffer Capacity)
   * Ví dụ: 50 requests
   */
  capacity: number;

  /**
   * Tốc độ rò rỉ / xử lý request mỗi giây (Leak Rate - requests/sec)
   * Ví dụ: 5 requests / giây
   */
  leakRatePerSecond: number;
}

/**
 * Thuật toán Leaky Bucket (Xô rò rỉ):
 * - Mục đích: Làm phẳng lưu lượng (Traffic Smoothing), xử lý dồn ứ request liên tục.
 * - Cơ chế: Khi các request đổ về ồ ạt (burst), thay vì từ chối ngay hoặc để database quá tải:
 *   1. Request được đưa vào hàng đợi đệm (buffer queue).
 *   2. Request được "rỉ" ra và thực thi với tốc độ cố định (constant rate).
 *   3. Nếu hàng đợi bị đầy (overflow), các request đến sau mới bị từ chối (429 / 503).
 */
export class LeakyBucketQueue {
  private readonly logger = new Logger(LeakyBucketQueue.name);
  private readonly queue: Array<() => Promise<void>> = [];
  private isProcessing = false;
  private readonly capacity: number;
  private readonly intervalMs: number;

  constructor(options: LeakyBucketOptions) {
    this.capacity = options.capacity;
    this.intervalMs = Math.max(1, Math.floor(1000 / options.leakRatePerSecond));
  }

  /**
   * Tổng tải hiện tại (tác vụ đang xử lý + tác vụ trong hàng đợi)
   */
  get currentLoad(): number {
    return this.queue.length + (this.isProcessing ? 1 : 0);
  }

  /**
   * Đưa một tác vụ vào hàng đợi Leaky Bucket để xử lý với tốc độ ổn định
   * @returns true nếu đưa vào hàng đợi thành công, false nếu hàng đợi đã đầy (overflow)
   */
  enqueue<T>(task: () => Promise<T>): Promise<T> {
    if (this.currentLoad >= this.capacity) {
      this.logger.warn(`⚠️ [LEAKY_BUCKET_OVERFLOW] Hàng đợi đã đầy (${this.currentLoad}/${this.capacity}). Request bị drop.`);
      return Promise.reject(new Error('Hàng đợi xử lý đang quá tải. Vui lòng thử lại sau giây lát.'));
    }

    return new Promise<T>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });

      void this.processQueue();
    });
  }

  /**
   * Số lượng tác vụ đang chờ trong hàng đợi
   */
  get queueLength(): number {
    return this.queue.length;
  }

  /**
   * Bộ xử lý rò rỉ theo chu kỳ thời gian cố định
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        await task().catch(() => {});
      }
      // Rò rỉ với khoảng cách thời gian cố định
      await new Promise((resolve) => setTimeout(resolve, this.intervalMs));
    }

    this.isProcessing = false;
  }
}
