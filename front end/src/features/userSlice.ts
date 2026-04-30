import { use } from "react";
import {
  AddUserApi,
  UpdateUser,
  DeleteUser,
  fetchUser,
  GetUserbyId,
  Login,
  fetchUserCount,
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

export const Adduser = createAsyncThunk(
  "Users/AddUsers",
  async (user: User, { rejectWithValue }) => {
    try {
      const response = await AddUserApi(user);

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
  LoginResponse, // Return type
  LoginRequest, // Input type
  { rejectValue: string } // Error type
>("user/login", async (loginData: LoginRequest, { rejectWithValue }) => {
  try {
    const email = loginData.Email || "";

    const response = await Login(email, loginData.Password);
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Deposit failed",
    );
  }
});

interface LoginRequest {
  Email?: string;

  Password: string;
}
interface LoginResponse {
  token: string;
}
interface UserCounts {
  userCount: number | null;

  // Add other counts as per your API response
}

interface UserState {
  token: string | null;

  role: string | null;

  email: string | null;

  isAuthenticated: boolean;

  status: "idle" | "pending" | "succeeded" | "failed";

  items: User[];

  userCounts: UserCounts | null;
}
// ─────────────────────────────────────────
// INITIAL STATE — read from localStorage on page load
// ─────────────────────────────────────────

// When the page loads, check if a token already exists in localStorage
// If yes, decode it immediately to get the role back

const savedToken = localStorage.getItem("authToken");
// If there's a saved token, decode it to get the role
// Otherwise role is null (user is not logged in)

const savedRole = savedToken ? (decodeToken(savedToken)?.role ?? null) : null;
const savedEmail = savedToken ? (decodeToken(savedToken)?.email ?? null) : null;
const initialState: UserState = {
  token: savedToken,
  role: savedRole,
  email: savedEmail,
  isAuthenticated: !!localStorage.getItem("authToken"),
  items: [],

  status: "idle",

  userCounts: null,
};

const UserSliceReducer = createSlice({
  name: "Users",

  initialState,

  reducers: {
    // ← NEW: Logout action — clears everything
    //

    logout(state) {
      state.token = null;
      state.role = null;
      state.email = null;
      state.isAuthenticated = false;
      localStorage.removeItem("authToken");
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
      .addCase(Adduser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(Adduser.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(Adduser.fulfilled, (state, action) => {
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
      .addCase(LoginPage.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(LoginPage.fulfilled, (state, action) => {
        state.status = "succeeded";

        const token = action.payload.token;
        // Save token to localStorage so it survives page refresh

        localStorage.setItem("authToken", token);

        //Save the raw token string in Redux
        state.token = token;

        // ← NEW: Decode the token to extract the role
        const decoded = decodeToken(token);
        // ← NEW: Save role to Redux state
        // decoded.role will be "Admin", "Teller", or "Client"
        console.log("🔍 Decoded token:", decoded);
        state.role = decoded?.role ?? null;
        // ← NEW: Save email to Redux state
        state.email = decoded?.email ?? null;
        state.isAuthenticated = true;
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
export const { logout } = UserSliceReducer.actions;
export default UserSliceReducer.reducer;
