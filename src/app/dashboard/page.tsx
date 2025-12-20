"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Plus, Edit, Trash2, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../wrapper/store/authStore";
import { BlogPost } from "../../../wrapper/types";
import { blogAPI } from "../../../wrapper/lib/api";

function DashboardContent() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const allPosts = await blogAPI.getAllPosts();
      const myPosts = allPosts.filter(
        (post) => post.authorUsername === user?.username
      );
      setPosts(myPosts);
    } catch (err) {
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await blogAPI.deletePost(id);
      toast.success("Post deleted successfully");
      fetchMyPosts();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete post");
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            My Blog Posts
          </h1>
          <p className="text-gray-600">Manage your published articles</p>
        </div>

        <button
          onClick={() => router.push("/dashboard/create")}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Post</span>
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
          <Plus className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            No posts yet
          </h2>
          <p className="text-gray-500 mb-6">
            Create your first blog post to get started
          </p>
          <button
            onClick={() => router.push("/dashboard/create")}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Create Post</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2
                    className="text-2xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition cursor-pointer"
                    onClick={() => router.push(`/blog/${post.id}`)}
                  >
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(post.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 ml-4">
                  <button
                    onClick={() => router.push(`/dashboard/edit/${post.id}`)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(post.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
