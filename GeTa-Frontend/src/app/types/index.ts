export interface User {
  id: string;
  name: string;
  email: string;
  career: string;
  careerId?: string;
  avatar?: string;
  bio?: string;
}

export interface Career {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  likes: number;
  career: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, career: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}