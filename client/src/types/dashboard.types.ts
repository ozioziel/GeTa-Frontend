import type { Career } from './career.types';

export type DashboardView =
  | 'feed'
  | 'career'
  | 'explore'
  | 'search'
  | 'saved'
  | 'notifications'
  | 'messages'
  | 'profile';

export type DashboardChecklistItem = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

export type DashboardOverview = {
  profile: {
    fullName: string;
    email: string;
    campus: string;
    career: Career | null;
  };
  metrics: {
    myPosts: number;
    careerPosts: number;
    savedPosts: number;
    unreadNotifications: number;
    unreadMessages: number;
    followers: number;
    following: number;
    pendingItems: number;
  };
  checklist: DashboardChecklistItem[];
  highlight: {
    profileCompletion: number;
    engagementScore: number;
    focusMessage: string;
  };
};
