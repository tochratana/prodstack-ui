"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  User,
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  Heart,
  MessageCircle,
  Send,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { BlogPost, Comment } from "../../../../wrapper/types";
import { useAuthStore } from "../../../../wrapper/store/authStore";
import { blogAPI, getImageUrl } from "../../../../wrapper/lib/api";
import Image from "next/image";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await blogAPI.getPostById(Number(params.id));
      setPost(data);
    } catch (err: any) {
      toast.error("Failed to fetch post");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await blogAPI.getComments(Number(params.id));
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments");
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated()) {
      toast.error("Please login to like posts");
      return;
    }
    try {
      await blogAPI.toggleLike(post!.id);
      fetchPost();
    } catch (err) {
      toast.error("Failed to toggle like");
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      toast.error("Please login to comment");
      return;
    }
    if (!commentText.trim()) return;

    try {
      setSubmitting(true);
      await blogAPI.addComment(post!.id, { content: commentText });
      setCommentText("");
      fetchComments();
      fetchPost();
      toast.success("Comment added");
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await blogAPI.deleteComment(commentId);
      fetchComments();
      fetchPost();
      toast.success("Comment deleted");
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await blogAPI.deletePost(post!.id);
      toast.success("Post deleted successfully");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete post");
    }
  };

  const isOwner = isAuthenticated() && user?.username === post?.authorUsername;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-8 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Author Header */}
        <div className="p-6 flex items-center justify-between border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold overflow-hidden">
              {post.authorProfileImage ? (
                <img
                  src={getImageUrl(post.authorProfileImage)}
                  alt={post.authorUsername}
                  className="w-full h-full object-cover"
                />
              ) : (
                post.authorUsername.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {post.authorUsername}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(post.createdAt), "MMMM dd, yyyy")}
              </p>
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push(`/dashboard/edit/${post.id}`)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {post.title}
          </h1>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
            {post.content}
          </div>

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-6">
              {post.images.map((image, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(image)}
                  alt={`${post.title} ${idx + 1}`}
                  className="w-full rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        {/* Engagement Bar */}
        <div className="px-6 py-3 border-t border-b flex items-center justify-between">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
              post.likedByCurrentUser
                ? "text-red-500 bg-red-50"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                post.likedByCurrentUser ? "fill-red-500" : ""
              }`}
            />
            <span className="font-medium">{post.likeCount || 0} Likes</span>
          </button>
          <div className="flex items-center space-x-2 text-gray-600">
            <MessageCircle className="w-5 h-5" />
            <span>{comments.length} Comments</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Comments</h2>

          {/* Add Comment */}
          {isAuthenticated() && (
            <form
              onSubmit={handleComment}
              className="mb-6 flex items-start space-x-3"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold overflow-hidden flex-shrink-0">
                {user?.profileImage ? (
                  <img
                    src={getImageUrl(user.profileImage)}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.username.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={submitting || !commentText.trim()}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold overflow-hidden flex-shrink-0">
                  {comment.userProfileImage ? (
                    <img
                      src={getImageUrl(comment.userProfileImage)}
                      alt={comment.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    comment.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <p className="font-semibold text-sm">{comment.username}</p>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 px-4">
                    <span className="text-xs text-gray-500">
                      {format(new Date(comment.createdAt), "MMM dd, yyyy")}
                    </span>
                    {user?.username === comment.username && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
