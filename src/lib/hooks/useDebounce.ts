import { useEffect, useState } from "react";

/**
 * Custom hook để debounce giá trị input
 * @param value - Giá trị cần debounce
 * @param delay - Thời gian delay (ms), mặc định 1000ms
 * @returns Giá trị đã được debounce
 */
export function useDebounce<T>(value: T, delay: number = 1000): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timeout để cập nhật giá trị sau delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: clear timeout nếu value thay đổi trước khi delay kết thúc
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
