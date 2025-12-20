import axios from "axios";
import { AuthResponse, BlogPost, BlogPostRequest, LoginRequest, RegisterRequest } from "../types";


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

  createPost: (data: BlogPostRequest): Promise<BlogPost> =>
    apiClient.post("/posts", data).then((res) => res.data),

  updatePost: (id: number, data: BlogPostRequest): Promise<BlogPost> =>
    apiClient.put(`/posts/${id}`, data).then((res) => res.data),

  deletePost: (id: number): Promise<void> =>
    apiClient.delete(`/posts/${id}`).then((res) => res.data),
};
