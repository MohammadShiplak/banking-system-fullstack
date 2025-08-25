
import axios from "axios";
import { User,Counts } from "../types/user";

export const fetchUser = async () => {
  try {
    const response = await axios.get("/api/User");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // This will trigger the rejected case
  }
};

export const fetchUserCount = async () => {
  try {
    const response = await axios.get("/api/User/GetUserCounts");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // This will trigger the rejected case
  }
};










export const AddUser=async  (user:User)=>{

try
{

const response =await axios.post(`/api/User`,user);

return response.data;
}
catch (error)
{
  console.log("Error Adding user ",error)
    throw error
}

}
export const UpdateUser=async  (user:User)=>{

try
{

const response =await axios.put(`/api/User`,user);

return response.data;
}
catch (error)
{
  console.log("Error update user",error)
    throw error
}

}

export const DeleteUser=async  (Id:number)=>{

try
{
const response =await axios.delete(`/api/User/${Id}`)

return response.data

}
catch (error)
{
  console.log("Error deleting user",error)
    throw error
}

}

export const GetUserbyId =async(Id:number)=>{

try{

const response =await axios.get(`/api/User/${Id}`)

return response.data


}
catch(error)
{
    console.log("Error ",error)
    throw error
}


}


export const Login = async (
  userName:string,
  Password: string,
  
) => {
  try {
    const response = await axios.post(`/api/User/login`, {
     Username: userName,
      Password:Password,
   
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Transfer failed:", error);
    throw error; // Let the thunk handle the rejection
  }
}













