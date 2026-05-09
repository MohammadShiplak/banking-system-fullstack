import axios from "axios";
import { User, Counts } from "../types/user";
import axiosInstance from "./axiosInstance";

const plainAxios = axios.create({
  baseURL: "https://localhost:7259",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

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

export const registerApi = async (userData: any) => {
  try {
    const response = await plainAxios.post(`/api/Auth/register`, userData);

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
    const response = await plainAxios.post(`/api/Auth/login`, {
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
// Refresh — no longer sends refreshToken in body
// Browser sends it automatically via cookie
export const refreshTokenApi = async (email: string) => {
  try {
    const response = await plainAxios.post(
      "/api/Auth/refresh",
      {}, // empty body
      {
        headers: {
          // Send email so backend can find the user
          "X-User-Email": email,
        },
      },
    );

    // Returns only { accessToken }
    return response.data;
  } catch (error) {
    throw error;
  }
};
// ── NEW: Logout API ───────────────────────────────────────────
// Tells backend to revoke the refresh token in database
// So even if someone steals the token, it won't work
export const logoutApi = async (email: string) => {
  try {
    await plainAxios.post(
      "/api/Auth/logout",
      {},
      {
        headers: { "X-User-Email": email },
      },
    );
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
