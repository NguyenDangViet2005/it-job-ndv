"use client";

import { Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";
import { PostCardProps } from "@/types/post.type";

export default function PostCard({ post, toggleLike, likeState }: PostCardProps) {
  return (
    <div
      key={post.id}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={post.avatar}
          alt={post.author}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            {post.author}
          </h3>
          <p className="text-sm text-gray-500">{post.role}</p>
        </div>
      </div>

      {/* Body */}
      <div className="px-4">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          {post.title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-3">{post.content}</p>
      </div>

      {post.image && (
        <div className="w-full h-60 relative">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t dark:border-gray-700">
        <button
          onClick={() => toggleLike(post.id)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-red-500"
        >
          <Heart
            size={20}
            fill={likeState[post.id] ? "red" : "none"}
            strokeWidth={2}
          />
          <span>{post.likes + (likeState[post.id] ? 1 : 0)}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-500">
          <MessageCircle size={20} />
          <span>{post.comments}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-500">
          <Share2 size={20} />
          <span>Chia sẻ</span>
        </button>
      </div>
    </div>
  );
}
