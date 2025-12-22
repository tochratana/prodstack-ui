export interface User {
  username: string;
  email: string;
  profileImage?: string;
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
  authorProfileImage?: string;
  images?: string[];
  likeCount: number;
  commentCount?: number;
  likedByCurrentUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostRequest {
  title: string;
  content: string;
}

export interface Comment {
  id: number;
  content: string;
  username: string;
  userProfileImage?: string;
  createdAt: string;
}

export interface CommentRequest {
  content: string;
}
