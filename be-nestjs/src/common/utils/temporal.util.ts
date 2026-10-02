import { Temporal } from '@js-temporal/polyfill';

/**
 * Trả về PlainDate hiện tại (VD: 2026-09-30) cho các trường `Date` trong database (deadline, dateofbirth)
 */
export const nowPlainDate = (): Temporal.PlainDate => {
  return Temporal.Now.plainDateISO();
};

/**
 * Trả về PlainDateTime hiện tại cho các trường `Timestamp` trong database (updatedat, createdat)
 */
export const nowPlainDateTime = (): Temporal.PlainDateTime => {
  return Temporal.Now.plainDateTimeISO();
};

/**
 * Trả về mốc 00:00:00 đầu ngày hôm nay dưới dạng Temporal.PlainDateTime
 */
export const startOfTodayPlainDateTime = (): Temporal.PlainDateTime => {
  return Temporal.Now.plainDateISO().toPlainDateTime({ hour: 0, minute: 0, second: 0 });
};

/**
 * Trả về mốc 00:00:00 ngày mai dưới dạng Temporal.PlainDateTime
 */
export const endOfTodayPlainDateTime = (): Temporal.PlainDateTime => {
  return Temporal.Now.plainDateISO().add({ days: 1 }).toPlainDateTime({ hour: 0, minute: 0, second: 0 });
};

/**
 * Chuyển đổi an toàn chuỗi ngày/Date/Temporal sang Temporal.PlainDate
 */
export const toPlainDate = (
  val: string | Date | Temporal.PlainDate | null | undefined,
): Temporal.PlainDate | null => {
  if (!val) return null;
  if (val instanceof Temporal.PlainDate) return val;
  if (typeof (val as any).toPlainDate === 'function') {
    return (val as any).toPlainDate();
  }
  if (val instanceof Date) {
    return Temporal.PlainDate.from(val.toISOString().split('T')[0]);
  }
  const str = String(val).split('T')[0];
  return Temporal.PlainDate.from(str);
};

/**
 * Định dạng an toàn PlainDate, Date hoặc string thành 'YYYY-MM-DD'
 */
export const formatDateString = (
  val: string | Date | Temporal.PlainDate | null | undefined,
): string | null => {
  if (!val) return null;
  if (typeof val === 'string') return val.split('T')[0];
  if (val instanceof Date) return val.toISOString().split('T')[0];
  return val.toString().split('T')[0];
};

/**
 * Kiểm tra xem hạn nộp đã qua hay chưa (so với hôm nay)
 */
export const isDeadlinePassed = (
  deadline: string | Date | Temporal.PlainDate | null | undefined,
): boolean => {
  if (!deadline) return false;
  try {
    const target = toPlainDate(deadline);
    if (!target) return false;
    return Temporal.PlainDate.compare(target, nowPlainDate()) < 0;
  } catch {
    return false;
  }
};
