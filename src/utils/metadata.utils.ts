import { Metadata } from "next";

export const getMetadata = (title: string, description?: string): Metadata => {
  return {
    title,
    description: description || title,
    icons: {
      icon: [
        { url: "/icons/icon.svg", sizes: "any" },
        { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
    },
  };
};
