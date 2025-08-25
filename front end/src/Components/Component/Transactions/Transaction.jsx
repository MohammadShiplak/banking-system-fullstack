import React from 'react';
import { 
  Button, 
  Form, 
  Container, 
  Card, 
  Nav, 
  Tab, 
  Tabs,
  InputGroup,
  Row,
  Col
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import TransferForm from './Transfer';
import WithdrewForm from './Withdrew';
import DepositForm from './Deposit';

export default function TransactionForm() {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8} xl={6}>
          <Card className="shadow-lg border-0">
            <Card.Header className=" py-3" style={{backgroundColor:"#2c3e50",color:"white"}}>
              <h3 className="mb-0 text-center">Client Account Management</h3>
            </Card.Header>
            <Card.Body>
              <Tabs defaultActiveKey="add" id="account-tabs" className="mb-4">
               
                <Tab eventKey="withdraw" title="Withdraw" className="py-3">
                  <WithdrewForm type="withdraw" />
                </Tab>
                <Tab eventKey="deposit" title="Deposit" className="py-3">
                  <DepositForm type="deposit" />
                </Tab>
                <Tab eventKey="transfer" title="Transfer" className="py-3">
                  <TransferForm />
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}