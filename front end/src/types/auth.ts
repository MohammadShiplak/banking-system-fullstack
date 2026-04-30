export interface JWTClaims {
  email: string; //refere to email
  role: string;
  exp: number;
  nameId: string;
}
// This describes what's INSIDE your JWT token
// Your .NET backend puts these fields in the token

//This describes the auth state we'll store in Redux
export interface AuthState {
  token: string | null;
  role: string | null;
  email: string | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
}
