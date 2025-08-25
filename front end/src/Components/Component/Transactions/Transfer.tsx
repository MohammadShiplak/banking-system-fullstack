import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { useAppSelector,useAppDispatch } from '../../../store';
import { withdrewAmount,findClient,fetchClient,TransferFund } from '../../../features/clientSlice';
import { useToast } from '../contexts/ToastContext';
 export default function TransferForm () {

const [accountNumber1,setAccountNumber1]=useState<string>("")
const [accountNumber2,setAccountNumber2]=useState<string>("")
const [amount,setAmount]=useState<string>("")
const [showModel,setShowModel]=useState(false)
const {showToast}=useToast()
const dispatch =useAppDispatch()


const handleSearch1=async ()=>{

  try
  {


const result =await dispatch(findClient(accountNumber1))


    if (findClient.fulfilled.match(result)) {
      // Successful API call (200 status)
      showToast("accountNumber Found Successfully :-)", "success");
   
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

const handleSearch2=async ()=>{

    try
  {


const result =await dispatch(findClient(accountNumber1))


    if (findClient.fulfilled.match(result)) {
      // Successful API call (200 status)
      showToast("accountNumber Found Successfully :-)", "info");
   
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
const handleTransfer = async () => {
  if (!accountNumber1 || !accountNumber2 || !amount) {
    alert("Please fill in all fields");
    return;
  }

  const transferAmount = parseFloat(amount);
  if (isNaN(transferAmount) || transferAmount <= 0) {
    alert("Please enter a valid positive amount");
    return;
  }

  try {
  var result =  await dispatch(
      TransferFund({
        message:"",
        fromAccountNumber: String(accountNumber1),
        toAccountNumber: String(accountNumber2),
        amount: transferAmount
      })
    ).unwrap();
    
showToast(
  `Transfer successfully from account ${accountNumber1} to ${accountNumber2}`,
  "info"
);


   
    // Optionally refresh data if needed
    await dispatch(fetchClient());
  } catch (error: any) {
    alert(`Transfer failed: ${error}`);
  }
};


    return (<Container className="form-container">
  <Card className="bank-form-card">
    <Card.Header as="h5" className="text-center bank-form-header" style={{backgroundColor:"#2c3e50", color: "white" }}>
      Transfer Money 
    </Card.Header>
    <Card.Body>
      <Form>
        {/* Account Number Row with Search Button */}
        <Form.Group className="mb-4" controlId="formAccountNumber">
          <div className="d-flex align-items-end gap-3">
            <div className="flex-grow-1">
              <Form.Label className="bank-form-label">Account Number1</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter account number"
                className="bank-form-input"
     value={accountNumber1}
      onChange={(e)=>{
setAccountNumber1(e.target.value)

     }}


              />
            </div>
            <Button
              variant="primary"
              className="bank-form-btn bank-form-btn-submit mb-3"
            style={{backgroundColor:"#2c3e50", color: "white" }}
            onClick={handleSearch1}
            >
              Search
            </Button>
          </div>

   <Form.Text className="text-muted">
            Enter the 10-digit account number
          </Form.Text>

          <div className="d-flex align-items-end gap-3" style={{marginTop:"10px"}}>
            <div className="flex-grow-1">
              <Form.Label className="bank-form-label">Account Number2</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter account number"
                className="bank-form-input"
        value={accountNumber2}
      onChange={(e)=>{
setAccountNumber2(e.target.value)

     }}

              />
            </div>
            <Button
              variant="primary"
              className="bank-form-btn bank-form-btn-submit mb-3"
            style={{backgroundColor:"#2c3e50", color: "white" }}
            onClick={handleSearch2}
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
              <Form.Label className="bank-form-label">Amount to Transfer</Form.Label>
              <Form.Control
                type="text"
                placeholder="0.00"
                className="bank-form-input"
                value={amount}
     onChange={(e)=>{
setAmount(e.target.value)

     }}
           
               
              />
              <Form.Text className="text-muted">
                Minimum deposit: $1.00
              </Form.Text>
              
              {/* Deposit Button - Placed directly below amount input */}
              <div className="mt-3">
                <Button
                  variant="success"
                  className="bank-form-btn w-100 py-2"
              onClick={handleTransfer}
                >
                  Transfer  Money
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
  </Container>)
 }