import React, { useState } from 'react';
import { 
  Navbar, 
  Offcanvas, 
  Nav, 
  Button, 
  Container, 
  Row, 
  Col 
} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Main.css';
import ListClients from '../Component/Clients/ListClients';
import ListUsers from '../Component/Users/ListUsers';
import TransactionForm from '../Component/Transactions/Transaction';
import BankDashboard from '../Component/Dashbord/Dashbord';
import LoginForm from '../Component/Login/Login';
import { useNavigate } from 'react-router-dom';
const Main = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
 const navigate = useNavigate();
  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  const renderPage = () => {
    switch (activePage) {
      case 'users':
        return <ListUsers />;
      case 'clients':
        return <ListClients />;
      case 'transactions':
        return <TransactionForm />;
            case 'dashboard':
        return <BankDashboard />;
            case 'login':
        return <LoginForm />;
      case 'currency':
        return <div className="bank-form-card">Currency Page</div>;
      default:
        return <LoginForm />;
    }
  };

  const handleLogout = () => {
    window.location.href = '/login';
  };

  const handleNavigation = (page: string) => {
    setActivePage(page);
    handleCloseSidebar();
  };

  return (
    <div className="bank-app-container">
      {/* Navbar */}
  <Navbar bg="custom" variant="dark" expand="lg" className="bank-navbar" style={{ backgroundColor: "#2c3e50"}}>
    <Container fluid>
        <Button 
        variant="light"
        onClick={handleShowSidebar} 
        className="me-2 navbar-toggle"
        >
        <i className="bi bi-list"></i>
        </Button>
        <Navbar.Brand href="#" className="bank-navbar-brand">
     <div style={{ marginRight:"600px",fontWeight:"bold",fontSize:"25px"}}>
      Bank Management System 
     </div>
        </Navbar.Brand>
       
    </Container>
</Navbar>

      {/* Sidebar Offcanvas */}
      <Offcanvas 
        show={showSidebar} 
        onHide={handleCloseSidebar} 
        className="bank-sidebar"
      >
        <Offcanvas.Header closeButton className="bank-sidebar-header">
          <Offcanvas.Title>
            <i className="bi bi-menu-button-wide me-2"></i> Menu
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="bank-sidebar-body">
          <Nav className="flex-column">
            <Button 
              variant={activePage === 'dashboard' ? "primary" : "light"}
              className={`mb-2 text-start sidebar-btn ${activePage === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNavigation('dashboard')}
            >
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </Button>
           
            <Button 
              variant={activePage === 'transactions' ? "primary" : "light"}
              className={`mb-2 text-start sidebar-btn ${activePage === 'transactions' ? 'active' : ''}`}
              onClick={() => handleNavigation('transactions')}
            >
              <i className="bi bi-arrow-left-right me-2"></i> Transactions
            </Button>
            <Button 
              variant={activePage === 'users' ? "primary" : "light"}
              className={`mb-2 text-start sidebar-btn ${activePage === 'users' ? 'active' : ''}`}
              onClick={() => handleNavigation('users')}
            >
              <i className="bi bi-people me-2"></i> Users
            </Button>
            <Button 
              variant={activePage === 'clients' ? "primary" : "light"}
              className={`mb-2 text-start sidebar-btn ${activePage === 'clients' ? 'active' : ''}`}
              onClick={() => handleNavigation('clients')}
            >
              <i className="bi bi-person-lines-fill me-2"></i> Clients
            </Button>
            <Button 
              variant="light" 
              className="mb-2 text-start sidebar-btn"
              onClick={() => {
             //   handleCloseSidebar();
                // setShowChangePassword(true);
              navigate("/")
              }}
            >
              <i className="bi bi-shield-lock me-2"></i> Logout 
            </Button>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <Container fluid className="bank-main-content">
        <Row>
          <Col>
            <div className="bank-content-container">
              {renderPage()}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Main;