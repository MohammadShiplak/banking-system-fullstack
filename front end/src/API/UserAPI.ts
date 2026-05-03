import { User, Counts } from "../types/user";
import axiosInstance from "./axiosInstance";

export const fetchUser = async () => {
  try {
    const response = await axiosInstance.get("/api/User");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // This will trigger the rejected case
  }
};

export const fetchUserCount = async () => {
  try {
    const response = await axiosInstance.get("/api/User/GetUserCounts");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // This will trigger the rejected case
  }
};

export const AddUserApi = async (user: User) => {
  try {
    const response = await axiosInstance.post(`/api/User`, user);

    return response.data;
  } catch (error) {
    console.error("Error Adding user ", error);
    throw error;
  }
};
export const UpdateUser = async (user: any) => {
  try {
    const response = await axiosInstance.put(`/api/User`, user);

    return response.data;
  } catch (error) {
    console.error("Error update user", error);
    throw error;
  }
};

export const DeleteUser = async (Id: number) => {
  try {
    const response = await axiosInstance.delete(`/api/User/${Id}`);

    return response.data;
  } catch (error) {
    console.error("Error deleting user", error);
    throw error;
  }
};

export const GetUserbyId = async (Id: number) => {
  try {
    const response = await axiosInstance.get(`/api/User/${Id}`);

    return response.data;
  } catch (error) {
    console.error("Error ", error);
    throw error;
  }
};

export const Login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(`/api/Auth/login`, {
      Email: email,
      Password: password,
    });

    return response.data; // Return the token directly
  } catch (error) {
    console.error("Transfer failed:", error);
    throw error; // Let the thunk handle the rejection
  }
};
// ── NEW: Refresh Token API ────────────────────────────────────
// Called automatically when access token expires
// User never sees this happen
export const RefreshTokenApi = async (email: string, refreshToken: string) => {
  // Send email + refresh token to backend
  // Backend verifies refresh token and returns new tokens
  //

  try {
    const response = await axiosInstance.post(`/api/Auth/refresh`, {
      Email: email,
      RefreshToken: refreshToken,
    });

    return response.data; // Return new tokens
  } catch (error) {
    console.error("Token refresh failed:", error);
  }
};
// ── NEW: Logout API ───────────────────────────────────────────
// Tells backend to revoke the refresh token in database
// So even if someone steals the token, it won't work
export const LogoutApi = async (email: string, refreshToken: string) => {
  // Send email + refresh token to backend
  // Backend verifies refresh token and returns new tokens
  //

  try {
    const response = await axiosInstance.post(`/api/Auth/logout`, {
      Email: email,
      RefreshToken: refreshToken,
    });

    return response.data; // Return new tokens
  } catch (error) {
    console.error("Logout API failed:", error);
  }
};
