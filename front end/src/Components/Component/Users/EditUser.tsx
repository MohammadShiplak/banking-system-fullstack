
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { User } from '../../../types/user';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../../store';
import axios from 'axios';
import { fetchUsers ,UpdateUsers} from '../../../features/userSlice';
import { useToast } from '../contexts/ToastContext';
//import "./styles/Add.css";
export default function EditUser() {

  const {showToast}=useToast();
const [user,setUser]=useState<User>({

id:0,
UserName:"",
Email:"",
Password:""

})


const {Id} =useParams<{Id:string}>();

const dispatch =useAppDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser(prev => ({
      ...prev,
      [id.replace("form", "")]: value
    }));
  };

useEffect(()=>{

const fetchUsersbyId=async ()=>{

try{


const response =await axios.get(`/api/User/${Id}`)
console.log(response.data)
setUser({

id:response.data.id,
UserName:response.data.userName ,
Email:response.data.email,
Password:response.data.password

})

}
catch(ex)
{
  console.error(ex);
}

}

  if (Id) {
      fetchUsersbyId();
    }



},[Id,dispatch])

const handleUpdateUser =async (e:React.FormEvent)=>{

e.preventDefault()

try
{

const updatedUser=await dispatch(UpdateUsers(user)).unwrap()


if(updatedUser)
{

setUser({

id:0,
UserName:"",
Email:"",
Password:""

})

showToast("User Updated Successfully :-)","info")


}
}
catch(error)
{
showToast(`${error}`,"danger")
}


}



  return (
    <Container className="form-container">
      <Card className="bank-form-card">
        <Card.Header as="h5" className="text-center bank-form-header" style={{backgroundColor:"#2c3e50", color: "white" }}>
          Update User
        </Card.Header>
        <Card.Body>

          <Form onSubmit={handleUpdateUser}>
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
                placeholder="Enter Email "
                className="bank-form-input"
                 value ={user.Email}
                   onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label className="bank-form-label">Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter Password "
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
              >
                Update
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










