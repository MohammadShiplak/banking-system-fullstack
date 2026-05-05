import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { useAppDispatch } from "../../../store";
import { RegisterUser } from "../../../features/userSlice";
import { useToast } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";

export const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // 1. The State
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // 2. The Logic
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    /*
  public string UserName { get; set; }
  public string Email { get; set; }
  public string Password { get; set; }


*/
    try {
      const sentData = {
        UserName: registerData.username,
        Email: registerData.email,
        Password: registerData.password,
      };

      const result = await dispatch(RegisterUser(sentData));

      if (RegisterUser.fulfilled.match(result)) {
        showToast("Account created successfully! Please log in.", "success");
        navigate("/Login");
      } else if (RegisterUser.rejected.match(result)) {
        showToast(result.payload as string, "danger");
      }
    } catch (error) {
      showToast("Something went wrong.", "danger");
    }
  };

  // 3. The Typing Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  // 4. The HTML (JSX)
  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card style={{ width: "400px", padding: "20px" }}>
        <h3 className="text-center">Register</h3>
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100"
            style={{ backgroundColor: "#34495e" }}
          >
            Create Account
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default RegisterForm;
