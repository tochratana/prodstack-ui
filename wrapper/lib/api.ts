import axios from "axios";
import {
  AuthResponse,
  BlogPost,
  Comment,
  CommentRequest,
  LoginRequest,
  RegisterRequest,
} from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    apiClient.post("/auth/register", data).then((res) => res.data),

  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiClient.post("/auth/login", data).then((res) => res.data),
};

// Blog Post API
export const blogAPI = {
  getAllPosts: (): Promise<BlogPost[]> =>
    apiClient.get("/posts").then((res) => res.data),

  getPostById: (id: number): Promise<BlogPost> =>
    apiClient.get(`/posts/${id}`).then((res) => res.data),

  createPost: (
    title: string,
    content: string,
    images: File[]
  ): Promise<BlogPost> => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    images.forEach((image) => formData.append("images", image));
    return apiClient
      .post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },

  updatePost: (
    id: number,
    title: string,
    content: string,
    images?: File[]
  ): Promise<BlogPost> => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (images) {
      images.forEach((image) => formData.append("images", image));
    }
    return apiClient
      .put(`/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },

  deletePost: (id: number): Promise<void> =>
    apiClient.delete(`/posts/${id}`).then((res) => res.data),

  toggleLike: (id: number): Promise<void> =>
    apiClient.post(`/posts/${id}/like`).then((res) => res.data),

  getComments: (id: number): Promise<Comment[]> =>
    apiClient.get(`/posts/${id}/comments`).then((res) => res.data),

  addComment: (id: number, data: CommentRequest): Promise<Comment> =>
    apiClient.post(`/posts/${id}/comments`, data).then((res) => res.data),

  deleteComment: (commentId: number): Promise<void> =>
    apiClient.delete(`/posts/comments/${commentId}`).then((res) => res.data),
};

// User API
export const userAPI = {
  uploadProfileImage: (file: File): Promise<{ profileImage: string }> => {
    const formData = new FormData();
    formData.append("image", file);
    return apiClient
      .post("/users/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },
};

export const getImageUrl = (path?: string) => {
  if (!path) return "/default-avatar.png";
  if (path.startsWith("http")) return path;
  return `${API_URL.replace("/api", "")}${path}`;
};
