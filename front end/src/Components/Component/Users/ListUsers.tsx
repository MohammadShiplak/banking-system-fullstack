

import { Link } from 'react-router-dom';
import { Container, Card, Table, Button } from 'react-bootstrap';
//import './styles/Home.css'; // Make sure this file exists in the same directory
import { useAppSelector,useAppDispatch } from '../../../store';
import { fetchUsers,DeleteUsers } from '../../../features/userSlice';
import { useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
export default function ListUsers() {
  // Sample data - replace with your actual data


const dispatch =useAppDispatch();

const {items,status}=useAppSelector((state)=>state.users)
const {showToast}=useToast()
 useEffect(() => {
  dispatch(fetchUsers());
}, [dispatch]);


 const handleDeleteUser = async (Id:number)=>{

    if (!window.confirm("Are you sure you want to delete this product?")) return;
try 
{


await dispatch(DeleteUsers(Id))

showToast("User deleted Successfully :-)","info")

await dispatch(fetchUsers())

}
catch(error)
{
console.error("Delete error:", error);
showToast("User Failed to delete  :-)","danger")
}


 }

  const uniqueItems = items.filter(
    (item, index, self) => index === self.findIndex(t => t.id === item.id)
  );


  return (
    <Container className="home-container">
      <Card className="bank-form-card">
        <Card.Header as="h5" className="text-center bank-form-header" style={{backgroundColor:"#2c3e50", color: "white" }}>
          Users Management
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Users List</h5>
            <Link to="/AddUser">
              <Button variant="primary" className="bank-form-btn bank-form-btn-submit">
               
                Add New User
              </Button>
            </Link>
          </div>

          <Table striped bordered hover responsive className="bank-table">
            <thead className="bank-table-header">
              <tr>
                <th>ID</th>
                <th>User Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
  {items && Array.isArray(items) && items.length > 0 ? (
    items.map((client: any) => (
      client && client.id ? ( // Additional check for client and client.id
        <tr key={client.id}>
          <td>{client.id}</td>
          <td>{client.userName  || 'N/A'}</td>
          <td>{client.email || 'N/A'}</td>
      
          <td>{client.password|| 'N/A'}</td>
          <td className="action-buttons">
            <Link to={`/EditUser/${client.id}`}>
              <Button variant="outline-warning" size="sm" className="me-2 bank-form-btn">
                Update
              </Button>
            </Link>
            <Button onClick={()=>{
             handleDeleteUser (client.id)
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
















