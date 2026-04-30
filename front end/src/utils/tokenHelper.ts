import { jwtDecode } from "jwt-decode";
import { JWTClaims } from "../types/auth";
// This function takes the raw token string
// and returns the data inside it

// These are the exact key names .NET puts inside JWT tokens
// They look ugly but this is the standard Microsoft uses
const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const EMAIL_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

export const decodeToken = (token: string) => {
  try {
    // Decode the raw token into an object
    const decoded: any = jwtDecode(token);

    return {
      // Try the long .NET URI key first, then fall back to the short key
      role: decoded[ROLE_CLAIM] ?? decoded["role"] ?? null,
      email:
        decoded[EMAIL_CLAIM] ?? decoded["email"] ?? decoded["email"] ?? null,
      exp: decoded["exp"] ?? null,
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};
export const isTokenEXpired = (token: string): boolean => {
  const decoded = decodeToken(token);

  if (!decoded) return true; // If we can't decode, treat it as expired
  // exp is in seconds, Date.now() is in milliseconds
  // so we divide Date.now() by 1000 to compare
  //
  const currentTime = Date.now() / 1000;

  return decoded.exp < currentTime;
};
