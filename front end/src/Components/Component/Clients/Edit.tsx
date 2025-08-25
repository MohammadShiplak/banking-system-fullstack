
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/Add.css";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Client } from '../../../types/client';
import { useAppDispatch } from '../../../store';
import { UpdateClient } from '../../../features/clientSlice';
import { useToast } from '../contexts/ToastContext';
export default function Edit() {
 const [client, setClient] = useState<Client>({
    id: 0,
    ClientName: "",
    AccountNumber: "",
    AccountBalance: 0,
    Phone: ""
  });

  
  const {showToast}=useToast();
  const { Id } = useParams<{ Id: string }>(); // Make sure your route parameter is 'id'
  const dispatch = useAppDispatch();

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setClient(prev => ({
      ...prev,
      [id.replace("form", "")]: id === "formAccountBalance" ? Number(value) : value
    }));
  };




useEffect(() => {
    const fetchClient = async () => {
      try {
     
        const response = await axios.get(`/api/Client/${Id}`);
       // console.log(response)
        setClient({
          id: response.data.id,
          ClientName: response.data.clientName ,
          AccountNumber: response.data.accountNumber,
          AccountBalance: response.data.accountBalance,
          Phone: response.data.phone
        });
      } catch (err) {
    
        console.error(err);
      } 
    };

    if (Id) {
      fetchClient();
    }
  }, [Id, dispatch]);

const handleUpdateClient=async (e:React.FormEvent)=>{

e.preventDefault()

try
{

const updatedClient=await dispatch(UpdateClient(client)).unwrap()

if(updatedClient)
{

  setClient({
        id: 0,
        ClientName: "",
        AccountNumber: "",
        AccountBalance: 0,
        Phone: ""
      });

showToast("Client Updated Successfully :-)","info")

}

}
catch(error)
{
showToast(`${error}`,"info")


}

}


  return (
    <Container className="form-container">
      <Card className="bank-form-card">
        <Card.Header as="h5" className="text-center bank-form-header" style={{backgroundColor:"#2c3e50", color: "white" }} >
          Update  Client
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleUpdateClient}>
            <Form.Group className="mb-4" controlId="formClientName">
              <Form.Label className="bank-form-label">Client Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter full name"
                className="bank-form-input"
                value ={client.ClientName}
                   onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formAccountNumber">
              <Form.Label className="bank-form-label">Account Number</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter account number"
                className="bank-form-input"
                     value ={client.AccountNumber}
                   onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formAccountBalance">
              <Form.Label className="bank-form-label">Account Balance ($)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="0.00"
                className="bank-form-input"
                     value ={client.AccountBalance}
                   onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPhone">
              <Form.Label className="bank-form-label">Phone Number</Form.Label>
              <Form.Control 
                type="tel" 
                placeholder="(123) 456-7890"
                className="bank-form-input"
                     value ={client.Phone}
                   onChange={handleInputChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button 
                variant="primary" 
                type="submit"
                className="bank-form-btn bank-form-btn-submit"
              >
                Submit
              </Button>
              
              <Link to ="/ListClients">
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

