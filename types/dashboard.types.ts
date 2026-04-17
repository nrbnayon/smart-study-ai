// types/dashboard.types.ts

export interface StatItem {
  value: number;
  trend: string;
  isUp: boolean;
}

export interface DashboardStats {
  totalUsers: StatItem;
  subscribedUsers: StatItem;
  totalQuestions?: StatItem;
  totalQuizzes?: StatItem;
}

export interface RecentUserRegistration {
  id: number | string;
  name: string;
  email: string;
  signupDate: string;
  status: "active" | "pending" | "inactive";
  avatar?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentUsers: RecentUserRegistration[];
}

