import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { findClient,depositAmount,fetchClient } from '../../../features/clientSlice';
import { useAppSelector,useAppDispatch } from '../../../store';
import { Client } from '../../../types/client';
import { useToast } from '../contexts/ToastContext';


 export default function DepositForm () {

const [accountNumber,setAccountNumber]=useState<string>("")
const [amount,setAmount]=useState<string>("")
const [showModel,setShowModel]=useState(false)
const {showToast}=useToast();




const dispatch =useAppDispatch()

 const { accountBalance, error, success } = useAppSelector((state:any) => state.clients);

  useEffect(() => {
    if (error || success) {
      setShowModel(true);
    }
  }, [error, success]);


const handleSearch = async () => {
  try {
   const result = await dispatch(findClient(accountNumber!));

  // Properly type-guard the result
    if (findClient.fulfilled.match(result)) {
      // Successful API call (200 status)
      showToast("accountNumber found  Successfully :-)","info");
   
    } else if (findClient.rejected.match(result)) {
      // Handle 401 and other errors differently
        showToast("accountNumber is not found please choose onther one ", "danger");
      } 
  
}
catch(error)
{
showToast("unexpected error   ", "danger");
}
}
const handleDeposit = async () => {
  if (!accountNumber || !amount) {
    alert("Please fill in all fields");
    return;
  }

  const depositValue = parseFloat(amount);
  if (isNaN(depositValue) || depositValue <= 0) {
    alert("Please enter a valid positive amount");
    return;
  }

  try {
    const result = await dispatch(
      depositAmount({
        accountNumber: String(accountNumber),
        amount: depositValue,
      })
    ).unwrap(); // Throws if the thunk rejects

 await dispatch(fetchClient()); 
   // alert(`Deposit successful! New balance: ${result}`);

showToast(
  `Deposit successfully into account ${accountNumber} with $${depositValue.toFixed(2)}. New balance is: $${result.toFixed(2)}`,
  "info"
);

   // Optionally refetch the client data to update the table
    //await dispatch(findClient(accountNumber))

  } catch (error) {
    console.error("Deposit failed:", error);
    alert(`Deposit failed: ${error}`);
  }
};


    return (<Container className="form-container">
  <Card className="bank-form-card">
    <Card.Header as="h5" className="text-center bank-form-header" style={{backgroundColor:"#2c3e50", color: "white" }}>
      Deposit  Funds
    </Card.Header>
    <Card.Body>
      <Form>
        {/* Account Number Row with Search Button */}
        <Form.Group className="mb-4" controlId="formAccountNumber" >
          <div className="d-flex align-items-end gap-3">
            <div className="flex-grow-1">
              <Form.Label className="bank-form-label">Account Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter account number"
                className="bank-form-input"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            <Button
              variant="primary"
              className="bank-form-btn bank-form-btn-submit mb-3"
            style={{backgroundColor:"#2c3e50", color: "white" }}
            onClick={handleSearch}
            >
              Search
            </Button>
          </div>
          <Form.Text className="text-muted">
            Enter the 10-digit account number
          </Form.Text>
        </Form.Group>

        
          <>
            {/* Amount Input with Deposit Button Below */}
            <Form.Group className="mb-4" controlId="formAmount">
              <Form.Label className="bank-form-label">Amount to Deposit</Form.Label>
              <Form.Control
                type="number"
              
                className="bank-form-input"
             value={amount}
              onChange={(e) => setAmount(e.target.value)}
            
              />
              <Form.Text className="text-muted">
                Minimum deposit: $1.00
              </Form.Text>
              
              {/* Deposit Button - Placed directly below amount input */}
              <div className="mt-3">
                <Button
                  variant="success"
                  className="bank-form-btn w-100 py-2"
                onClick={handleDeposit}
                >
                  Deposit Money
                </Button>
              </div>
            </Form.Group>

        
            {/* Clear Form Button */}
            <div className="d-flex justify-content-center mt-3">
              <Button
                variant="outline-secondary"
                className="bank-form-btn bank-form-btn-cancel"
              
              >
                Clear Form
              </Button>
            </div>
          </>
        
      </Form>
    </Card.Body>
  </Card>

  {/* Success Modal */}
  <Modal >
    <Modal.Header closeButton className="bg-success text-white">
      <Modal.Title>Transaction Successful</Modal.Title>
    </Modal.Header>
    <Modal.Body>
  
    </Modal.Body>
    <Modal.Footer>
      <Button>
        Done
      </Button>
    </Modal.Footer>
  </Modal>

  {/* Error Modal */}
  <Modal >
    <Modal.Header closeButton className="bg-danger text-white">
      <Modal.Title>Transaction Failed</Modal.Title>
    </Modal.Header>
 
    <Modal.Footer>
 
    </Modal.Footer>
  </Modal>
</Container>)

    }
