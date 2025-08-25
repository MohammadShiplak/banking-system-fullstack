import React from 'react';
import Home from './Components/Component/Clients/ListClients';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route,Routes,Link ,BrowserRouter} from "react-router";
import Add from './Components/Component/Clients/Add';
import Edit from './Components/Component/Clients/Edit';
import DepositForm from './Components/Component/Transactions/Deposit';
import WithdrewForm from './Components/Component/Transactions/Withdrew';
import TransferForm from './Components/Component/Transactions/Transfer';
import LoginForm from './Components/Component/Login/Login';
import BankDashboard from './Components/Component/Dashbord/Dashbord';
import Main from './Components/Main/Main';
import AddUser from './Components/Component/Users/AddUser';
import ListUsers from './Components/Component/Users/ListUsers';
import ListClients from './Components/Component/Clients/ListClients';
import EditUser from './Components/Component/Users/EditUser';
import { ToastProvider } from './Components/Component/contexts/ToastContext';
function App() {
  return (
 <ToastProvider>
 <BrowserRouter>

    <div className="App">

  
    <Routes> 
     <Route path="/" element={<LoginForm/>}/>
            <Route path="/Add" element={<Add/>}/>
            <Route path="/EditUser/:Id" element={<EditUser />} />

 <Route path="/Edit/:Id" element={<Edit />} />

            <Route path="/AddUser" element={<AddUser/>}/>
            <Route path="/ListUsers" element={<ListUsers/>}/>

            <Route path="/ListClients" element={<ListClients/>}/>
 <Route path="/Main" element={<Main/>}/>
  
     </Routes>

    </div>
    </BrowserRouter>

</ToastProvider>

  );
}

export default App;
