/**
 * Format date to Vietnamese string
 * @param date date string or Date object
 * @param format type of format: 'default' (17/01/2026), 'long' (17 tháng 01, 2026), 'full' (Thứ Bảy, 17 tháng 01, 2026)
 * @returns formatted string
 */
export const formatDate = (
  date: string | Date | number,
  format: 'default' | 'long' | 'full' = 'default'
): string => {
  if (!date) return "";
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return "";

  switch (format) {
    case 'long':
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    case 'full':
      return d.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    default:
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
  }
};
