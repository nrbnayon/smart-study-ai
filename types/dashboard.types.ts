// types/dashboard.types.ts

export interface DashboardApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    total_users: number;
    subscribed_users: number;
    subscription_note: string;
  };
  timestamp: string;
}

