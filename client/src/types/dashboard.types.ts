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
  highlight: {
    profileCompletion: number;
    engagementScore: number;
    focusMessage: string;
  };
};
