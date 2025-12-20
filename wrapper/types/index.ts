export interface User {
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  authorUsername: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostRequest {
  title: string;
  content: string;
}
