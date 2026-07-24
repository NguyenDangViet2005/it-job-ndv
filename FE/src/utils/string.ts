/**
 * String utility functions
 * Pure functions for string manipulation and SEO slug creation
 */

/**
 * Remove Vietnamese tones/diacritics from string
 * Example: "Tuyển dụng Senior" => "Tuyen dung Senior"
 */
export const removeVietnameseTones = (str: string): string => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

/**
 * Convert string to slug format (supports Vietnamese)
 * Example: "Tuyển dụng Senior ReactJS!" => "tuyen-dung-senior-reactjs"
 */
export const slugify = (text: string): string => {
  if (!text) return "";
  const noTones = removeVietnameseTones(text);
  return noTones
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

/**
 * Create a friendly SEO slug combining item title/name and ID
 * Example: createSlugWithId("Senior ReactJS Developer", 12) => "senior-reactjs-developer-12"
 */
export const createSlugWithId = (title: string, id: number | string): string => {
  const slug = slugify(title);
  return slug ? `${slug}-${id}` : `${id}`;
};

/**
 * Extract numerical ID from a slug string
 * Example: extractIdFromSlug("senior-reactjs-developer-12") => 12
 * Example: extractIdFromSlug("12") => 12
 */
export const extractIdFromSlug = (slug: string): number => {
  if (!slug) return 0;
  if (/^\d+$/.test(slug)) {
    return parseInt(slug, 10);
  }
  const parts = slug.split("-");
  const lastPart = parts[parts.length - 1];
  const parsedId = parseInt(lastPart, 10);
  return isNaN(parsedId) ? 0 : parsedId;
};
