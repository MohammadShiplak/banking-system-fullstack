import { use } from "react";
import {
  registerApi,
  UpdateUser,
  DeleteUser,
  fetchUser,
  GetUserbyId,
  Login,
  fetchUserCount,
  RefreshTokenApi,
  LogoutApi,
} from "../API/UserAPI";
import { User } from "../types/user";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthState } from "../types/auth";
import { decodeToken } from "../utils/tokenHelper";
export const fetchUsers = createAsyncThunk("Users/fetchUsers", async () => {
  const response = await fetchUser();

  return response;
});

export const fetchUserCounts = createAsyncThunk<UserCounts, void>(
  "user/fetchCounts",
  async () => {
    const response = await fetchUserCount();
    return response;
  },
);

export const RegisterUser = createAsyncThunk(
  "Users/AddUsers",
  async (registerData: any, { rejectWithValue }) => {
    try {
      const response = await registerApi(registerData);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const UpdateUsers = createAsyncThunk(
  "Users/UpdateUsers",
  async (user: any, { rejectWithValue }) => {
    try {
      const response = await UpdateUser(user);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const DeleteUsers = createAsyncThunk(
  "Users/DeleteUsers",
  async (Id: number, { rejectWithValue }) => {
    try {
      const response = await DeleteUser(Id);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const GetUsersbyId = createAsyncThunk(
  "Users/GetUsersbyId",
  async (Id: number, { rejectWithValue }) => {
    try {
      const response = await GetUserbyId(Id);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
export const LoginPage = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: string }
>("user/login", async (loginData: LoginRequest, { rejectWithValue }) => {
  try {
    const email = loginData.Email || "";
    const response = await Login(email, loginData.Password);
    return response;
  } catch (error: any) {
    // ✅ Check if the backend sent a specific HTTP status code
    if (error.response) {
      if (error.response.status === 429) {
        return rejectWithValue("429"); // Tells LoginForm it's a rate limit!
      }
      if (error.response.status === 401) {
        return rejectWithValue("401"); // Tells LoginForm it's a bad password!
      }

      // Return whatever custom message the backend sent, if any
      return rejectWithValue(
        error.response.data?.message || error.response.data || "Login failed",
      );
    }

    // Fallback if the server is completely down
    return rejectWithValue("Network error or server is down");
  }
});
// ── NEW: Refresh Token thunk ──────────────────────────────────
// This is called AUTOMATICALLY by axiosInstance interceptor
// when a 401 error happens
// The user never calls this manually
export const RefreshToken = createAsyncThunk(
  "user/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    // Get the current refresh

    try {
      // token and email from Redux state
      // getState() gives us the entire Redux store
      //
      const state = getState() as any;
      const refreshToken = state.users.refreshToken;
      const email = state.users.email;

      if (!refreshToken || !email) {
        return rejectWithValue("No refresh token or email available");
      }
      const response = await RefreshTokenApi(email, refreshToken);
      return response; // This should contain the new access token (and maybe a new refresh token)
    } catch (error) {
      return rejectWithValue("session expired, please login gain");
    }
  },
); // ── NEW: Logout thunk ─────────────────────────────────────────
// Clears everything from Redux and localStorage
// Also tells backend to revoke the refresh token

export const Logout = createAsyncThunk(
  "user/logout",
  async (_, { getState }) => {
    const state = getState() as any;
    const refreshToken = state.users.refreshToken;
    const email = state.users.email; // Tell backend to revoke refresh token

    if (refreshToken && email) {
      await LogoutApi(email, refreshToken);
    }
  },
);
interface LoginRequest {
  Email?: string;

  Password: string;
}
// updated to handle two tokens
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
interface UserCounts {
  userCount: number | null;

  // Add other counts as per your API response
}

interface UserState {
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;

  email: string | null;

  isAuthenticated: boolean;

  status: "idle" | "pending" | "succeeded" | "failed";

  items: User[];

  userCounts: UserCounts | null;

  // New: Rate limiting State
  isRateLimited: boolean;
  rateLimitedMessage: string | null;
  rateLimitSeconds: number;
  failedAttempts: number; // <-- NEW
}
// ─────────────────────────────────────────
// INITIAL STATE — read from localStorage on page load
// ─────────────────────────────────────────

// When the page loads, check if a token already exists in localStorage
// If yes, decode it immediately to get the role back

const savedToken = localStorage.getItem("authToken");
// If there's a saved token, decode it to get the role
// Otherwise role is null (user is not logged in)
// ── Initial State ─────────────────────────────────────────────
// When page loads, check if tokens already exist in localStorage
// This keeps user logged in after page refresh

const savedAccessToken = localStorage.getItem("accessToken");
const savedRefreshToken = localStorage.getItem("refreshToken");

const savedDecoded = savedAccessToken ? decodeToken(savedAccessToken) : null;
/*
const savedRole = savedToken ? (decodeToken(savedToken)?.role ?? null) : null;
const savedEmail = savedToken ? (decodeToken(savedToken)?.email ?? null) : null;
*/
const initialState: UserState = {
  accessToken: savedAccessToken,
  refreshToken: savedRefreshToken,
  role: savedDecoded?.role ?? null,
  email: savedDecoded?.email ?? null,
  isAuthenticated: !!localStorage.getItem("authToken"),
  items: [],

  status: "idle",

  userCounts: null,

  //-----NEW : Rate Limiting defaults
  isRateLimited: false,
  rateLimitedMessage: "",
  rateLimitSeconds: 0,
  failedAttempts: 0, // <-- NEW (Starts at 0)
};

const UserSliceReducer = createSlice({
  name: "Users",

  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.email = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }, // ← NEW: Logout action — clears everything
    //
    // 1. Put the user in timeout
    setRateLimit: (state, action) => {
      state.isRateLimited = action.payload.messsage;
      state.rateLimitSeconds = action.payload.seconds; // e.g., 60 seconds
    },
    // 2. Tick the clock down by 1 second
    decrementTimer: (state) => {
      if (state.rateLimitSeconds > 0) {
        state.rateLimitSeconds -= 1;
      }
    },
    // 3. Let them out of timeout
    clearRateLimit: (state) => {
      state.isRateLimited = false;
      state.rateLimitSeconds = 0;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(RegisterUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(RegisterUser.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(RegisterUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(UpdateUsers.pending, (state) => {
        state.status = "pending";
      })
      .addCase(UpdateUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        );
      })
      .addCase(UpdateUsers.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(DeleteUsers.pending, (state) => {
        state.status = "pending";
      })
      .addCase(DeleteUsers.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(DeleteUsers.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.items = state.items.filter((item) => item.id != action.meta.arg);
      })
      .addCase(GetUsersbyId.pending, (state) => {
        state.status = "pending";
      })
      .addCase(GetUsersbyId.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(GetUsersbyId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(LoginPage.pending, (state) => {
        state.status = "pending";
      })
      .addCase(LoginPage.rejected, (state, action) => {
        state.status = "failed"; // ❌ If the backend says 401 (Wrong Password)
        if (action.payload === "401") {
          // 1. Add a strike to the counter
          state.failedAttempts += 1;

          // 2. Did they hit 3 strikes?
          if (state.failedAttempts >= 3) {
            // LOCK THE DOOR!
            state.isRateLimited = true;
            state.rateLimitedMessage = "Too many failed attempts. Please wait.";
            state.rateLimitSeconds = 60; // They must wait 60 seconds

            // Reset the counter so it's ready for the next time they try
            state.failedAttempts = 0;
          }
        }
        // ❌ If the backend itself triggers a 429
        else if (action.payload === "429") {
          state.isRateLimited = true;
          state.rateLimitedMessage = "Too many requests. Please wait.";
          state.rateLimitSeconds = 60;
        }
      })
      .addCase(LoginPage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.failedAttempts = 0;
        const { accessToken, refreshToken } = action.payload;

        // Save token to localStorage so it survives page refresh

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        // ← NEW: Decode the token to extract the role
        const decoded = decodeToken(accessToken);
        // ← NEW: Save role to Redux state
        // decoded.role will be "Admin", "Teller", or "Client"
        console.log("🔍 Decoded token:", decoded);
        state.role = decoded?.role ?? null;
        // ← NEW: Save email to Redux state
        state.email = decoded?.email ?? null;
        state.isAuthenticated = true;
      })
      .addCase(RefreshToken.fulfilled, (state, action) => {
        const { accessToken, refreshToken } = action.payload;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        state.accessToken = accessToken;
        state.refreshToken = refreshToken;

        const decoded = decodeToken(accessToken);

        state.role = decoded?.role ?? null;
        state.email = decoded?.email ?? null;
        state.isAuthenticated = true;
      })
      .addCase(RefreshToken.rejected, (state) => {
        // Refresh failed → force full logout
        // This happens when refresh token is also expired (after 7 days)
        state.accessToken = null;
        state.refreshToken = null;
        state.role = null;
        state.email = null;
        state.isAuthenticated = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      })
      .addCase(Logout.fulfilled, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.role = null;
        state.email = null;
        state.isAuthenticated = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      })
      .addCase(fetchUserCounts.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchUserCounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userCounts = action.payload;
      })
      .addCase(fetchUserCounts.rejected, (state) => {
        state.status = "failed";
      });
  },
});
// Export the logout action so components can use it
export const { logout, setRateLimit, decrementTimer, clearRateLimit } =
  UserSliceReducer.actions;
export default UserSliceReducer.reducer;
