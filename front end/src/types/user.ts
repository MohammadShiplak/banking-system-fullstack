export interface User {
  id: number;

  UserName: string;

  Email: string;

  Password: string;

  token: string;
}

export interface Counts {
  userCount: number | null;
}
