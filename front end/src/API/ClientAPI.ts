
import axios from "axios";
import { Client } from "../types/client";
import { Alert } from "react-bootstrap";
import { TransferFundResponse } from "../features/clientSlice";
export const fetchClients =async ()=>{

const response =await axios.get("/api/Client")

return response.data

}

export const AddClients =async(client:Client)=>{

try{

const response =await axios.post("/api/Client",client)

return response.data


}
catch(error)
{
    console.log("Error Adding client",error)
    throw error
}


}
export const UpdateClients =async(client:Client)=>{

try{

const response =await axios.put(`/api/Client/`,client)

return response.data


}
catch(error)
{
    console.log("Error Adding client",error)
    throw error
}


}

export const deleteClients =async (id:number)=>{
 
const response =await axios.delete(`/api/Client/${id}`)

return response.data

}







export const GetClientsbyId =async(Id:number)=>{

try{

const response =await axios.post(`/api/Client/${Id}`)

return response.data


}
catch(error)
{
    console.log("Error ",error)
    throw error
}


}
export const depositAmounts = async (accountNumber: string, amount: number) => {


  try {
    const response = await axios.post(
      `/api/Client/${accountNumber}/deposit`,
      {amount}, // Send as raw number
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
        console.log('Deposit response:', response.data);
    return response.data;
  } catch (error) {
    // ... error handling
  }
};

export const WithdrewAmounts = async (accountNumber: string, amount: number) => {


  try {
    const response = await axios.post(
      `/api/Client/${accountNumber}/withdrew`,
      {amount}, // Send as raw number
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
      
    return response.data;
  } catch (error) {
    // ... error handling
  }

}

export const fetchClientCount = async () => {
  try {
    const response = await axios.get("/api/Client/GetAllClientCount");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // This will trigger the rejected case
  }
};

export const fetchTotallAccountBalances = async () => {
  try {
    const response = await axios.get("/api/Client/GetTotallAccountBalance");
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error; // This will trigger the rejected case
  }
};








export const findClients = async (accountNumber: string) => {
  try {
    const response = await axios.get(`/api/Client/account/${accountNumber}`);

    return response.data;
  } catch (error) {

    if (axios.isAxiosError(error)) {
      // For 404 errors, return a consistent error structure
      if (error.response?.status === 404) {
        throw new Error(`Account ${accountNumber} not found`);
      }
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error('An unexpected error occurred');
   
  }
};

export const TransferFunds = async (
  message:string,
  fromAccountNumber: string,
  toAccountNumber: string,
  amount: number
) => {
  try {
    const response = await axios.post(`/api/Client/Transfer`, {
     Message: message,
      FromAccount:fromAccountNumber,
      ToAccount:toAccountNumber,
      Amount:amount
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










