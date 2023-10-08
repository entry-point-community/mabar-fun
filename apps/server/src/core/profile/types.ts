export type ApiGamesMobileLegendsVerifyAccountResponse = {
  status: 1 | 0;
  rc: number;
  message?: 'Data Found' | 'Data Not Found';
  data?: {
    is_valid: boolean;
    username: string;
  };
  ts?: number;
  error_msg?: string;
};
