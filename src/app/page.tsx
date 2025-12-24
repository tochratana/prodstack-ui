"use client";

import { useEffect, useState } from "react";
import { Loader2, BookOpen } from "lucide-react";
import { BlogPost } from "../../wrapper/types";
import { blogAPI } from "../../wrapper/lib/api";
import BlogCard from "@/components/BlogCardProps";

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await blogAPI.getAllPosts();
      setPosts(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold dark:text-white text-black mb-4 flex items-center justify-center space-x-3">
          <BookOpen className="w-12 h-12 text-blue-600" />
          <span>Latest Blog Posts</span>
        </h1>
        <p className="text-xl text-gray-600">
          Discover amazing stories from our community
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            No posts yet
          </h2>
          <p className="text-gray-500">Be the first to create a blog post!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
