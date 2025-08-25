
import { createAsyncThunk, createSlice,PayloadAction } from '@reduxjs/toolkit'

import { fetchClients,AddClients,GetClientsbyId,UpdateClients,deleteClients,depositAmounts,findClients,WithdrewAmounts ,TransferFunds,fetchClientCount,fetchTotallAccountBalances} from '../API/ClientAPI'
import { Client } from '../types/client'
import { useAppDispatch } from '../store'




export  const fetchClient=createAsyncThunk("clients/fetchClients", async ()=>{

const response =await fetchClients()
  console.log("Thunk data:", response); // Debug
return response


})

export  const fetchClientsCount=createAsyncThunk<ClientsCount,void>("clients/fetchClientsCount", async ()=>{

const response =await fetchClientCount()

return response


})

export  const fetchTotallAccountBalance=createAsyncThunk<TotallBalances,void>("clients/fetchTotallAccountBalances", async ()=>{

const response =await fetchTotallAccountBalances()

return response


})

export const deleteClient=createAsyncThunk("deleteClient",async (id:number)=>{
    const response =await deleteClients(id);
    return response
})


export const depositAmount = createAsyncThunk<
  number, // Return type
  DepositParams, // Input type
  { rejectValue: string } // Error type
>(
  'client/deposit', 
  async ({ accountNumber, amount }, { rejectWithValue }) => {
    try {
      const response = await depositAmounts(accountNumber, amount);
      // Make sure the response contains the balance
 const newBalance = typeof response === 'number' 
        ? response 
        : response.accountBalance || response.balance;
      
      if (typeof newBalance !== 'number') {
        throw new Error('Invalid balance returned from server');
      }
      
      return newBalance;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Deposit failed'
      );
    }
  }
);





export const withdrewAmount = createAsyncThunk<
  number, // Return type
  DepositParams, // Input type
  { rejectValue: string } // Error type
>(
  'client/withdrew', 
  async ({ accountNumber, amount },{ rejectWithValue }) => {
    try {
      const response = await WithdrewAmounts(accountNumber, amount);
      return response.balance;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Deposit failed'
      );
    }
  }
);






export const AddClient=createAsyncThunk("clients/AddClients",async(client:Client,{rejectWithValue})=>{

  try
  {
const response =await AddClients(client)

return response.data


  }
  catch(error:any)
  {
      return rejectWithValue(error.response?.data || error.message);

  }


})

export const UpdateClient=createAsyncThunk("clients/UpdateClients",async(client:Client,{rejectWithValue})=>{

  try
  {
const response =await UpdateClients(client)

return response


  }
  catch(error:any)
  {
      return rejectWithValue(error.response?.data || error.message);

  }


})





export const GetClientbyId=createAsyncThunk("clients/GetClientbyId",async(Id:number,{rejectWithValue})=>{

  try
  {
const response =await GetClientsbyId(Id)

return response.data


  }
  catch(error:any)
  {
      return rejectWithValue(error.response?.data || error.message);

  }


})


export const findClient = createAsyncThunk(
  'client/find',
  async (accountNumber: string, { rejectWithValue }) => {
    try {
      const response = await findClients(accountNumber);
      return response;
    } catch (error: any) {
      // Return a consistent error message structure
      return rejectWithValue(error.message || 'Account not found');
    }
  }
);

export const TransferFund = createAsyncThunk<
  TransferFundResponse,
  TransferRequest,
  { rejectValue: string }
>(
  'client/Transfer',
  async ({ message,fromAccountNumber, toAccountNumber, amount }, { rejectWithValue }) => {
    try {
      const response = await TransferFunds(message,fromAccountNumber, toAccountNumber, amount);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Transfer failed'
      );
    }
  }
);


interface ClientsCount
{
totalClients:number|null

}


interface TotallBalances
{
totalBalance:number|null
}



interface ClientsState{
  id: number ;
  clientName: string;
  accountNumber: string;
  accountBalance: number;
  phone: string;
  loading: boolean;
  error: string | null;
  success: string | null;
 items: Client[];
   status: 'idle' | 'pending' | 'succeeded' | 'failed';
   clientCounts:ClientsCount|null
   totallBalances:TotallBalances|null
}


const initialState: ClientsState = {
  id: 1,
  clientName: '',
  accountNumber: '',
  accountBalance: 0,
  phone: '',
  loading: false,
  error: null,
  success: null,
  items:[],
  status:'idle',
  clientCounts:null,
  totallBalances:null
};

interface DepositParams {
  accountNumber: string;
  amount: number;
}

interface TransferRequest {

  message:string,
fromAccountNumber:string,
toAccountNumber:string,
amount:number,

}

export interface TransferFundResponse {
  fromAccount: Client;
  toAccount: Client;
  amount:number;
  message: string;
}




interface DepositResponse {
  balance: number;
}

 const clientSliceReducer = createSlice({
  name: 'clients',
  initialState,
  reducers: {   setAccountNumber(state, action: PayloadAction<string>) {
      state.accountNumber = action.payload;
    },
    resetClientState(state) {
  
      
      state.error = null;
    },},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClient.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(fetchClient.fulfilled, (state, action: PayloadAction<Client[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchClient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch clients';
      }).addCase(AddClient.pending,(state)=>{
  state.status = 'pending';

      }).addCase(AddClient.fulfilled,(state,action)=>{
state.status='succeeded';
state.items.push(action.payload)

      }).addCase(AddClient.rejected,(state)=>{
    state.status = 'failed';
      }).addCase(GetClientbyId.pending,(state)=>{
  state.status = 'pending';

      }).addCase(GetClientbyId.fulfilled,(state,action)=>{
state.status='succeeded';
state.items.push(action.payload)

      }).addCase(GetClientbyId.rejected,(state)=>{
    state.status = 'failed';
      }).addCase(UpdateClient.pending,(state)=>{
  state.status = 'pending';

      }).addCase(UpdateClient.fulfilled,(state,action)=>{
state.status='succeeded';

state.items =state.items.map(item=>
  item.id === action.payload.id ?action.payload :item
)
      }).addCase(UpdateClient.rejected,(state)=>{
    state.status = 'failed';
      }).addCase(deleteClient.pending,(state)=>{
  state.status = 'pending';

      }).addCase(deleteClient.fulfilled,(state,action)=>{
state.status='succeeded';

state.status =action.payload
  })
      .addCase(deleteClient.rejected,(state)=>{
    state.status = 'failed';
      })
      .addCase(depositAmount.fulfilled, (state, action) => {
        state.accountBalance = action.payload;
  if (state.items) {
    state.items = state.items.map(client => 
      client.AccountNumber === action.meta.arg.accountNumber
        ? { ...client, accountBalance: action.payload}
        : client
    );
  }
   
      })
      .addCase(depositAmount.rejected, (state, action) => {
  
        state.error = action.payload as string;
      }).addCase(findClient.pending, (state) => {
      //  state.loading = true;
        state.error = null;
      //  state.success = null;
      }).addCase(findClient.rejected, (state, action) => {
       // state.loading = false;
        state.error = action.payload as string;
      }).addCase(findClient.fulfilled, (state, action) => {
       // state.loading = false;
  state.id = action.payload.id;
  state.clientName = action.payload.clientName;
  state.accountNumber = action.payload.accountNumber;
  state.accountBalance = action.payload.accountBalance;
  state.phone = action.payload.phone;
       // state.accountBalance = action.payload.accountBalance;
        state.success = 'Account found successfully!';
      }).addCase(withdrewAmount.pending, (state) => {
        
        state.error = null;
      }).addCase(withdrewAmount.rejected, (state) => {
        
        state.error = null;
      }).addCase(withdrewAmount.fulfilled, (state, action) => {
  if (action.payload !== undefined) {
    state.accountBalance = action.payload;
    
    if (state.items) {
      state.items = state.items.map(client => 
        client.AccountNumber === action.meta.arg.accountNumber
          ? { ...client, accountBalance: action.payload }
          : client
      );
    }
  }
}).addCase(TransferFund.fulfilled, (state, action: PayloadAction<TransferFundResponse>) => {
  state.status = 'succeeded';
  state.loading = false;
  state.error = null;
  
  // Update accounts in state



})
      .addCase(TransferFund.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Transfer failed';
      }).addCase(fetchClientsCount.pending, (state)=>{
      
      state.status="pending";
      
      
      })
      .addCase(fetchClientsCount.fulfilled,(state,action)=>{
      
              state.status = 'succeeded';
              state.clientCounts = action.payload;
      
      })
      .addCase(fetchClientsCount.rejected,(state)=>{
      
      state.status="failed";
      
      }).addCase(fetchTotallAccountBalance.pending, (state)=>{
      
      state.status="pending";
      
      
      })
      .addCase(fetchTotallAccountBalance.fulfilled,(state,action)=>{
      
              state.status = 'succeeded';
              state.totallBalances = action.payload;
      
      })
      .addCase(fetchTotallAccountBalance.rejected,(state)=>{
      
      state.status="failed";;
  
      })
      







  },
});

export default clientSliceReducer.reducer;


export const {setAccountNumber , resetClientState } = clientSliceReducer.actions;

















