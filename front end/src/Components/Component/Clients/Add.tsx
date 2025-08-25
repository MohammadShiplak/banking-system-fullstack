
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/Add.css";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AppDispatch,useAppDispatch,useAppSelector } from '../../../store';
import { AddClient } from '../../../features/clientSlice';
import { Client } from '../../../types/client';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
export default function Add() {

const [client,setClient]=useState<Client>({
  id: 0,
  ClientName: "",
  AccountNumber: "",
  AccountBalance: 0,
  Phone: ""
});
const dispatch=useAppDispatch()
const {showToast}=useToast();
  const navigate = useNavigate();
const handleAddClient =async (e:React.FormEvent)=>{

e.preventDefault()

  try {
      const result = await dispatch(AddClient(client)).unwrap();
      
      // Reset form
      setClient({
        id: 0,
        ClientName: "",
        AccountNumber: "",
        AccountBalance: 0,
        Phone: ""
      });

      // Show success toast
      showToast("Client Added Successfully!","info");
      
      // Optionally navigate away after success
      setTimeout(() => navigate("/ListClients"), 1500);
      
    } catch (error) {
      console.error("Failed to add client:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to add client";
      showToast(errorMessage,"danger");
    }

}


const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setClient(prev => ({
    ...prev,
    [name]: name === "AccountBalance" ? Number(value) : value
  }));
};


  return (
    <Container className="form-container">
      <Card className="bank-form-card">
        <Card.Header as="h5" className="text-center bank-form-header" style={{backgroundColor:"#2c3e50", color: "white" }}>
          Add New Client
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleAddClient}>
            <Form.Group className="mb-4" controlId="formClientName">
              <Form.Label className="bank-form-label">Client Name</Form.Label>
              <Form.Control 
                type="text" 
                name="ClientName" 
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
                name="AccountNumber"
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
    step="0.01"  // This allows decimal values with 2 decimal places
    placeholder="Enter account balance"
     name="AccountBalance" 
    className="bank-form-input"
    value={client.AccountBalance ?? ''}  // Handles null/undefined cases
    onChange={handleInputChange}
  />
</Form.Group>

            <Form.Group className="mb-4" controlId="formPhone">
              <Form.Label className="bank-form-label">Phone Number</Form.Label>
              <Form.Control 
                type="tel" 
                placeholder="(123) 456-7890"
                  name="Phone"
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
                style={{backgroundColor:"#2c3e50", color: "white" }}
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

