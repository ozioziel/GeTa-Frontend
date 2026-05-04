import type { Career } from './career.types';

export type Profile = {
  id?: string;
  userId?: string;
  fullName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  campus?: string;
  careerId?: string;
  career?: Career;
};

export type User = {
  id: string;
  email: string;
  role?: string;
  profile?: Profile;
};