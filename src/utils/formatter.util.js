const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

const formatCurrency = (amount, currency = "VND") => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

module.exports = {
  formatDate,
  formatCurrency,
  slugify,
};
