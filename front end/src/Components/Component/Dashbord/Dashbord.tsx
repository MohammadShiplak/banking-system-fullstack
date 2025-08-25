import React from 'react';
import { Card, Row, Col, ProgressBar, Container } from 'react-bootstrap';
import { useAppDispatch,useAppSelector } from '../../../store';
import { useEffect } from 'react';
import { fetchUserCounts } from '../../../features/userSlice';
import { fetchClientsCount,fetchTotallAccountBalance } from '../../../features/clientSlice';
const BankDashboard = () => {
  // Sample data - replace with your actual data

const {userCounts}=useAppSelector((state)=>state.users)
const {clientCounts,totallBalances}=useAppSelector((state)=>state.clients)
  console.log('Current Redux state:', userCounts); // Debug log
   console.log('Current Redux state:', clientCounts); // Debug log
    console.log('this is totall balances :', totallBalances); // Debug log
const dispatch=useAppDispatch()


  useEffect(() => {
    dispatch(fetchUserCounts());
  }, [dispatch]);




  useEffect(() => {
    dispatch(fetchClientsCount());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTotallAccountBalance());
  }, [dispatch]);




  // Calculate percentages

  // Format currency

  // Card style
  const cardStyle = {
    border: 'none',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    backgroundColor: '#fff',
    height: '100%'
  };

  // Card hover effect
  const cardHoverStyle = {
    transform: 'translateY(-3px)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
  };

  return (
    <Container style={{ padding: '2rem' }}>
      <Row className="g-4">
        {/* Clients Card */}
        <Col md={4}>
          <Card style={cardStyle} className="hover-effect">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#e3f2fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem'
                }}>
                
                  <span style={{ color: '#1976d2', fontSize: '1.2rem' }}>👥</span>
                </div>
                <Card.Title style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#2c3e50',
                  marginBottom: '0'
                }}>Total Clients</Card.Title>
              </div>
              <div style={{ margin: '1.5rem 0' }}>
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: '#2c3e50',
                  marginBottom: '0.25rem'
                }}>{clientCounts?.totalClients  }</h2>
                <small style={{
                  fontSize: '0.9rem',
                  color: '#7f8c8d',
                  display: 'block'
                }}></small>
              </div>

            </Card.Body>
          </Card>
        </Col>

        {/* Users Card */}
        <Col md={4}>
          <Card style={cardStyle} className="hover-effect">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#f3e5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem'
                }}>
                  <span style={{ color: '#9c27b0', fontSize: '1.2rem' }}>👤</span>
                </div>
                <Card.Title style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#2c3e50',
                  marginBottom: '0'
                }}>System Users</Card.Title>
              </div>
              <div style={{ margin: '1.5rem 0' }}>
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: '#2c3e50',
                  marginBottom: '0.25rem'
                }}>{userCounts?.userCount}</h2>
                <small style={{
                  fontSize: '0.9rem',
                  color: '#7f8c8d',
                  display: 'block'
                }}></small>
              </div>
         
            </Card.Body>
          </Card>
        </Col>

        {/* Balance Card */}
        <Col md={4}>
          <Card style={cardStyle} className="hover-effect">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#e8f5e9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem'
                }}>
                  <span style={{ color: '#4caf50', fontSize: '1.2rem' }}>💰</span>
                </div>
                <Card.Title style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#2c3e50',
                  marginBottom: '0'
                }}>Total Balance</Card.Title>
              </div>
              <div style={{ margin: '1.5rem 0' }}>
              
                <small style={{
                  fontSize: '0.9rem',
                  color: '#7f8c8d',
                  display: 'block'
                }}>{ totallBalances?.totalBalance}</small>
              </div>
              <div style={{ marginTop: '1.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#4caf50' }}>

                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BankDashboard;