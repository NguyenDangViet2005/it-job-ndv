/**
 * Format utility functions
 * Functions for formatting data for display
 */

/**
 * Format number as Vietnamese currency
 * Example: 1000000 => "1.000.000 ₫"
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

/**
 * Format number with thousand separators
 * Example: 1000000 => "1.000.000"
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("vi-VN").format(num);
};

/**
 * Format date to Vietnamese format
 * Example: new Date() => "01/01/2024"
 */
export const formatDate = (date: Date | string, format = "dd/MM/yyyy"): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return format
    .replace("dd", day)
    .replace("MM", month)
    .replace("yyyy", String(year))
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
};

/**
 * Format date to relative time
 * Example: "2 giờ trước", "3 ngày trước"
 */
export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "Vừa xong";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} tuần trước`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} tháng trước`;
  return `${Math.floor(diffInSeconds / 31536000)} năm trước`;
};

/**
 * Format file size
 * Example: 1024 => "1 KB"
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

/**
 * Format phone number
 * Example: "0123456789" => "012 345 6789"
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
};

/**
 * Format salary range
 * Example: formatSalaryRange(10000000, 20000000) => "10 - 20 triệu"
 */
export const formatSalaryRange = (min: number, max: number): string => {
  if (min === 0 && max === 0) return "Thỏa thuận";
  
  const formatMillion = (amount: number) => {
    if (amount >= 1000000) {
      return `${amount / 1000000} triệu`;
    }
    return formatCurrency(amount);
  };

  if (min === max) return formatMillion(min);
  if (min === 0) return `Lên đến ${formatMillion(max)}`;
  if (max === 999999999) return `Từ ${formatMillion(min)}`;
  
  return `${formatMillion(min)} - ${formatMillion(max)}`;
};
