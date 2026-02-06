"use client";

import { Attachment } from "@/types";
import { Play } from "lucide-react";

interface PostMediaProps {
  attachments?: Attachment[]; // From API
  // Legacy support props (optional)
  images?: string[];
  video?: string;
  onOpenLightbox: (
    media: { url: string; type: "image" | "video" }[],
    startIndex: number,
  ) => void;
}

export default function PostMedia({
  attachments,
  images: legacyImages,
  video: legacyVideo,
  onOpenLightbox,
}: PostMediaProps) {
  // Extract images and video from attachments (API structure)
  const apiImages =
    attachments?.filter((a) => a.filetype === "image").map((a) => a.fileurl) ||
    [];
  const apiVideo = attachments?.find((a) => a.filetype === "video")?.fileurl;

  // Merge with legacy props if provided (prioritize API)
  const images = apiImages.length > 0 ? apiImages : legacyImages || [];
  const video = apiVideo || legacyVideo;

  // Video
  if (video) {
    return (
      <div
        className="rounded-lg overflow-hidden mb-4 group cursor-target max-h-[400px] relative"
        onClick={() => onOpenLightbox([{ url: video, type: "video" }], 0)}
      >
        <video src={video} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="h-16 w-16 text-white" />
        </div>
      </div>
    );
  }

  // Images
  if (images.length === 0) return null;

  return (
    <div
      className={`mb-4 gap-2 ${
        images.length === 1
          ? "grid grid-cols-1"
          : images.length === 2
            ? "grid grid-cols-2"
            : images.length === 3
              ? "grid grid-cols-2"
              : images.length === 4
                ? "grid grid-cols-2"
                : "grid grid-cols-3"
      }`}
    >
      {images.slice(0, 5).map((img, imgIdx) => (
        <div
          key={imgIdx}
          onClick={() => {
            const allMedia = images.map((url) => ({
              url,
              type: "image" as const,
            }));
            onOpenLightbox(allMedia, imgIdx);
          }}
          className={`relative rounded-lg overflow-hidden group cursor-target max-h-[300px] ${
            images.length === 3 && imgIdx === 0
              ? "col-span-2"
              : images.length >= 5 && imgIdx === 4
                ? "relative"
                : ""
          }`}
        >
          <img
            src={img}
            alt={`Post image ${imgIdx + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {images.length > 3 && imgIdx === 2 && (
            <div
              className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white hover:bg-black/70 transition-colors duration-300 cursor-target"
              onClick={(e) => {
                e.stopPropagation();
                const allMedia = images.map((url) => ({
                  url,
                  type: "image" as const,
                }));
                onOpenLightbox(allMedia, 0);
              }}
            >
              <span className="text-4xl font-bold">+{images.length - 3}</span>
              <span className="text-sm mt-2">Xem thêm</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
