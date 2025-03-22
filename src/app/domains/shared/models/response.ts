export interface APIResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }
  
  export interface APIError {
    message: string;
    statusCode?: number;
    errors?: Record<string, string[]>;
  }
  