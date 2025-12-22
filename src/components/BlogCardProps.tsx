"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Heart, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { BlogPost } from "../../wrapper/types";
import { getImageUrl } from "../../wrapper/lib/api";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const excerpt =
    post.content.substring(0, 200) + (post.content.length > 200 ? "..." : "");

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Author Header */}
      <div className="p-4 flex items-center space-x-3 border-b">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold overflow-hidden">
          {post.authorProfileImage ? (
            <Image
              src={getImageUrl(post.authorProfileImage)}
              alt={post.authorUsername}
              className="w-full h-full object-cover"
            />
          ) : (
            post.authorUsername.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{post.authorUsername}</p>
          <p className="text-xs text-gray-500">
            {format(new Date(post.createdAt), "MMM dd, yyyy")}
          </p>
        </div>
      </div>

      <Link href={`/blog/${post.id}`}>
        {/* Content */}
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition">
            {post.title}
          </h2>

          <p className="text-gray-600 mb-3">{excerpt}</p>
        </div>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div
            className={`grid gap-1 ${
              post.images.length === 1
                ? "grid-cols-1"
                : post.images.length === 2
                ? "grid-cols-2"
                : "grid-cols-2"
            }`}
          >
            {post.images.slice(0, 4).map((image, idx) => (
              <div key={idx} className="relative aspect-square bg-gray-100">
                <img
                  src={getImageUrl(image)}
                  alt={`${post.title} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {idx === 3 && post.images!.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold">
                    +{post.images!.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Link>

      {/* Engagement Stats */}
      <div className="px-4 py-3 border-t flex items-center justify-between text-gray-500 text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Heart
              className={`w-5 h-5 ${
                post.likedByCurrentUser ? "fill-red-500 text-red-500" : ""
              }`}
            />
            <span>{post.likeCount || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-5 h-5" />
            <span>{post.commentCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
