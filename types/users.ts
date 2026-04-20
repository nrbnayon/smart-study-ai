// types/user.ts

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  signup_date: string;
  account_status: "verified" | "not_verified";
  subscription_status: string;
  current_plan: string;
  start_date: string;
  expiry_date: string;
}

export interface UserApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    success: boolean;
    statusCode: number;
    message: string;
    data: User;
  };
  timestamp: string;
}

export interface UserListApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
      count: number;
      next: string | null;
      previous: string | null;
      results: User[];
    };
  };
  timestamp: string;
}
