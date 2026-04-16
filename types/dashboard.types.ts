
export interface DashboardStats {
  totalUsers: {
    value: number;
    trend: number;
  };
  totalLakes: {
    value: number;
    trend: number;
  };
  totalReports: {
    value: number;
    trend: number;
  };
  bassPornRequests: {
    value: number;
    trend: number;
  };
  totalCatches: {
    value: number;
    trend: number;
  };
}

export interface UserActivityData {
  day: string;
  users: number;
}

export interface ReportsSubmittedData {
  week: string;
  reports: number;
}

export interface RecentActivity {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  lake: string;
  time: string;
}

export interface DashboardData {
  stats: DashboardStats;
  userActivity: UserActivityData[];
  reportsSubmitted: ReportsSubmittedData[];
  recentActivity: RecentActivity[];
}
