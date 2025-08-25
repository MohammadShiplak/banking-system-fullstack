
import { Link } from 'react-router-dom';
import { Container, Card, Table, Button } from 'react-bootstrap';
import './styles/Home.css'; // Make sure this file exists in the same directory
import { useEffect } from 'react';
import { useAppDispatch,useAppSelector } from '../../../store';
import { fetchClient,deleteClient } from '../../../features/clientSlice';
import { Client } from '../../../types/client';
import { useToast } from '../contexts/ToastContext';
export default function ListClients() {
  // Sample data - replace with your actual data


const dispatch=useAppDispatch()

  const { items, status, error } = useAppSelector((state:any) => state.clients);
const {showToast}=useToast()
console.log("Full clients state:",);



useEffect(() => {
  dispatch(fetchClient());
}, [dispatch]);

 const handleDeleteClient = async (id:number)=>{

    if (!window.confirm("Are you sure you want to delete this product?")) return;
try 
{


const deletedClient =await dispatch(deleteClient(id)).unwrap()

if(deletedClient)
{

await dispatch(fetchClient())

showToast("Client Deleted Sucessfully :-)","info")
}

}
catch(error)
{
console.error("Delete error:", error);
showToast(`${error}`,"info")
}


 }










  return (
    <Container className="home-container">
      <Card className="bank-form-card">
        <Card.Header as="h5" className="text-center bank-form-header" style={{backgroundColor:"#2c3e50", color: "white" }}>
          Clients Management
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Clients List</h5>
            <Link to="/Add">
              <Button variant="primary" className="bank-form-btn bank-form-btn-submit">
               
                Add New Client
              </Button>
            </Link>
          </div>

          <Table striped bordered hover responsive className="bank-table">
            <thead className="bank-table-header">
              <tr>
                <th>ID</th>
                <th>Client Name</th>
                <th>Account Number</th>
                <th>Balance ($)</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
<tbody>
  {items && Array.isArray(items) && items.length > 0 ? (
    items.map((client: {

id:number;
clientName?:string;
accountNumber?:string;
accountBalance?:number;
phone?:string;



    }) => (
      client && client.id ? ( // Additional check for client and client.id
        <tr key={client.id}>
          <td>{client.id}</td>
          <td>{client.clientName || 'N/A'}</td>
          <td>{client.accountNumber || 'N/A'}</td>
          <td>{client.accountBalance?.toFixed(2) || '0.00'}</td>
          <td>{client.phone || 'N/A'}</td>
          <td className="action-buttons">
            <Link to={`/Edit/${client.id}`}>
              <Button variant="outline-warning" size="sm" className="me-2 bank-form-btn">
                Update
              </Button>
            </Link>
            <Button onClick={()=>{
              handleDeleteClient (client.id)
            }}  variant="outline-danger" size="sm" className="bank-form-btn">
              Delete
            </Button>
          </td>
        </tr>
      ) : null
    ))
  ) : (
    <tr>
      <td colSpan={6} className="text-center">
        {status === 'loading' ? 'Loading...' : 'No clients found.'}
      </td>
    </tr>
  )}
</tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}















