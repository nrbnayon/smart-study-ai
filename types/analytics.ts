export interface PopularSubject {
  subject: string;
  scan_count: number;
}

export interface PopularSubjectsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    popular_subjects: PopularSubject[];
  };
  timestamp: string;
}

export interface DailyBreakdown {
  day: string;
  active_users: number;
}

export interface ActiveUsersAnalytics {
  today_active_users: number;
  last_7_days_active_users: number;
  last_30_days_active_users: number;
  daily_breakdown: DailyBreakdown[];
}

export interface ActiveUsersApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ActiveUsersAnalytics;
  timestamp: string;
}
