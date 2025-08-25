import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Modal, Row, Col } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import { LoginPage } from '../../../features/userSlice';
import { useAppDispatch } from '../../../store';
import { useToast } from '../contexts/ToastContext';
const LoginForm = () => {
  // Login state

const {showToast}=useToast();
 const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Registration state
  const [registerData, setRegisterData] = useState({
    newUsername: '',
    newPassword: '',
    confirmPassword: '',
    email: ''
  });

const dispatch=useAppDispatch();


  // Modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  const navigate = useNavigate();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const result = await dispatch(LoginPage({
      Username: loginData.username,
      Password: loginData.password
    }));

    // Properly type-guard the result
    if (LoginPage.fulfilled.match(result)) {
      // Successful API call (200 status)
      showToast("Login Successful :-)", "success");
      navigate("/Main");
    } else if (LoginPage.rejected.match(result)) {
      // Handle 401 and other errors differently
      if (result.payload?.includes("401")) {
        showToast("Invalid username or password", "danger");
      } else {
        showToast(result.payload || "Login failed. Please try again.", "danger");
      }
    }
  } catch (error) {
    showToast("An unexpected error occurred", "danger");
  }
}


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card className="w-100" style={{ maxWidth: '500px' }}>
        <Card.Header className="text-center py-3" style={{ backgroundColor: '#2c3e50', color: 'white' }}>
Sign In
        </Card.Header>
        
        <Card.Body>
          
            <>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={loginData.username}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                      name="password"
                    placeholder="Enter password"
                    value={loginData.password}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

          

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  //disabled={!username || !password}
                  style={{ backgroundColor: "#2c3e50", border: 'none' }}
                >
                  Login
                </Button>

               
              </Form>
            </>
          
         
        
        </Card.Body>
      </Card>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button 
            variant="success" 
            onClick={() => setShowSuccessModal(false)}
            style={{ backgroundColor: "#2c3e50", border: 'none' }}
          >
            Continue
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button 
            variant="danger" 
            onClick={() => setShowErrorModal(false)}
            style={{ backgroundColor: "#e74c3c", border: 'none' }}
          >
            Try Again
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LoginForm;