import { use } from "react";
import { AddUser,UpdateUser,DeleteUser,fetchUser,GetUserbyId,Login,fetchUserCount } from "../API/UserAPI";
import { User } from "../types/user";
import { createAsyncThunk, createSlice,PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchUsers=createAsyncThunk("Users/fetchUsers",async ()=>{

const response =await fetchUser();

return response


})

/*
export const fetchUserCounts = createAsyncThunk<UserCounts, void, { rejectValue: string }>(
  'user/fetchUserCounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUser();
      return response.data;
    } catch (error) {
    //  return rejectWithValue(error.response?.data?.message || 'Failed to fetch user counts');
    }
  }
);
*/

export const fetchUserCounts = createAsyncThunk<UserCounts, void>(
  'user/fetchCounts',
  async () => {
    const response = await fetchUserCount();
    return response;
  }
);






export const AddUsers=createAsyncThunk("Users/AddUsers",async (user:User,{rejectWithValue})=>{

try
{

const response =await AddUser(user);

return response

}
catch(error:any)
{

return rejectWithValue(error.response?.data || error.message);

}

})

export const UpdateUsers=createAsyncThunk("Users/UpdateUsers",async (user:User,{rejectWithValue})=>{

try
{

const response =await UpdateUser(user);

return response

}
catch(error:any)
{

return rejectWithValue(error.response?.data || error.message);

}

})

export const DeleteUsers=createAsyncThunk("Users/DeleteUsers",async (Id:number,{rejectWithValue})=>{

try
{

const response =await DeleteUser(Id);

return response

}
catch(error:any)
{

return rejectWithValue(error.response?.data || error.message);

}

})

export const GetUsersbyId=createAsyncThunk("Users/GetUsersbyId",async (Id:number,{rejectWithValue})=>{

try
{

const response =await GetUserbyId(Id);

return response

}
catch(error:any)
{

return rejectWithValue(error.response?.data || error.message);

}

})


export const LoginPage = createAsyncThunk<
  User, // Return type
  LoginRequest, // Input type
  { rejectValue: string } // Error type
>(
  'client/withdrew', 
  async ({ Username, Password  },{ rejectWithValue }) => {
    try {
      const response = await Login(Username, Password );
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Deposit failed'
      );
    }
  }
);

interface LoginRequest {
  Username: string;
 Password : string;
}

interface UserCounts {
 userCount : number|null;

  // Add other counts as per your API response
}


interface UserState 
{

  Id :number;

   UserName :string;

   Email :string;

   Password :string;

status: 'idle' | 'pending' | 'succeeded' | 'failed';

items:User[]

userCounts:UserCounts|null

}

const initialState:UserState ={

Id:1,

UserName:"",

Email:"",

Password:"",

items:[],

status:'idle',

userCounts:null

}







 const UserSliceReducer =createSlice({

name:"Users",

initialState,

reducers:
{

},

extraReducers:(builder)=>{

builder.addCase(fetchUsers.pending, (state)=>{

state.status="pending";


})
.addCase(fetchUsers.fulfilled,(state,action:PayloadAction<User[]>)=>{

        state.status = 'succeeded';
        state.items = action.payload;

})
.addCase(fetchUsers.rejected,(state)=>{

state.status="failed";

})
.addCase(AddUsers.pending,(state)=>{
state.status="pending";
})
.addCase(AddUsers.rejected,(state)=>{
state.status="failed"
})
.addCase(AddUsers.fulfilled,(state,action)=>{
state.status="succeeded";
  state.items.push(action.payload)
})
.addCase(UpdateUsers.pending,(state)=>{
state.status="pending";
})
.addCase(UpdateUsers.fulfilled,(state,action)=>{
state.status="succeeded";
state.items=state.items.map(item=>

item.id === action.payload.id ?action.payload :item

)
})
.addCase(UpdateUsers.rejected, (state)=>{
state.status="failed"
})
.addCase(DeleteUsers.pending,(state)=>{
state.status="pending"
})
.addCase(DeleteUsers.rejected,(state)=>{
state.status="failed"
})
.addCase(DeleteUsers.fulfilled,(state,action)=>{
state.status="succeeded";

state.status =action.payload

})
.addCase(GetUsersbyId.pending,(state)=>{
state.status="pending";
})
.addCase(GetUsersbyId.rejected,(state)=>{
state.status="failed"
})
.addCase(GetUsersbyId.fulfilled,(state,action)=>{
state.status="succeeded";
  state.items.push(action.payload)
})
.addCase(LoginPage.pending,(state)=>{
state.status="pending";
})
.addCase(LoginPage.rejected,(state)=>{
state.status="failed"
})
.addCase(LoginPage.fulfilled,(state,action)=>{
state.status="succeeded";
  state.UserName=action.payload.UserName
  state.Password=action.payload.Password

  
}).addCase(fetchUserCounts.pending, (state)=>{

state.status="pending";


})
.addCase(fetchUserCounts.fulfilled,(state,action)=>{

        state.status = 'succeeded';
        state.userCounts = action.payload;

})
.addCase(fetchUserCounts.rejected,(state)=>{

state.status="failed";

})




}

})


export default UserSliceReducer.reducer


