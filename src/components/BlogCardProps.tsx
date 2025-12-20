"use client";

import Link from "next/link";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { BlogPost } from "../../wrapper/types";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const excerpt =
    post.content.substring(0, 150) + (post.content.length > 150 ? "..." : "");

  return (
    <Link href={`/blog/${post.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300 transform hover:-translate-y-1">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition line-clamp-2">
            {post.title}
          </h2>

          <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="font-medium">{post.authorUsername}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(post.createdAt), "MMM dd, yyyy")}</span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
            Read More →
          </div>
        </div>
      </div>
    </Link>
  );
}
