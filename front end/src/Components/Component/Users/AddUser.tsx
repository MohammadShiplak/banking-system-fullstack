
import React, { use } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, replace } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { User } from '../../../types/user';
import { useAppDispatch } from '../../../store';
import { AddUsers } from '../../../features/userSlice';
//import "./styles/Add.css";
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
export default function AddUser() {

const [user,setUser]=useState<User>({

id:0,
UserName:"",
Email:"",
Password:""

})
const {showToast}=useToast()
const dispatch =useAppDispatch();
const navigate=useNavigate()
const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>)=>
{

const {id,value}=e.target;

setUser(prev=>({
...prev,

[id.replace("form","")]:value

}))

}

const handleAddUser =async (e:React.FormEvent)=>{

e.preventDefault()

  try {
      const result = await dispatch(AddUsers(user)).unwrap();
      
      // Reset form
      setUser({
   id:0,
UserName:"",
Email:"",
Password:""

      })
 
      // Show success toast
      showToast("User Added Successfully!", "success");
      
      // Optionally navigate away after success
      setTimeout(() => navigate("/ListUsers"), 1500);
      
    } catch (error) {
      console.error("Failed to add client:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to add client";
      showToast(errorMessage,"danger");
    }


}







  return (
    <Container className="form-container">
      <Card className="bank-form-card">
        <Card.Header as="h5" className="text-center bank-form-header" style={{backgroundColor:"#2c3e50", color: "white" }}>
          Add New User
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleAddUser}>
          
            <Form.Group className="mb-4" controlId="formUserName">
              <Form.Label className="bank-form-label">UserName</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter username"
                className="bank-form-input"
                value ={user.UserName}
                   onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formEmail">
              <Form.Label className="bank-form-label">Email</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter email"
                className="bank-form-input"
                value ={user.Email}
                   onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label className="bank-form-label">Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter password"
                className="bank-form-input"
                value ={user.Password}
                   onChange={handleInputChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button 
                variant="primary" 
                type="submit"
                className="bank-form-btn bank-form-btn-submit"
                style={{backgroundColor:"#2c3e50", color: "white" }}
              >
                Submit
              </Button>
              <Link to ="/ListUsers">
              <Button 
                variant="outline-secondary" 
                type="button"
                className="bank-form-btn bank-form-btn-cancel"
              >
                Cancel
              </Button>
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}






















