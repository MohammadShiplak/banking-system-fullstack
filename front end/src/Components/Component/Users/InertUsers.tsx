import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch } from "../../../store";
import { Adduser } from "../../../features/userSlice";
import { useToast } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";

export default function AddUsers() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // ✅ FIX 1: handleAddUser is now at the TOP LEVEL of the component
  // ❌ BEFORE: it was buried inside handleInputChange by accident
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!userName.trim()) {
      showToast("Username is required", "danger");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      showToast("Valid email is required", "danger");
      return;
    }
    if (!password.trim() || password.length < 6) {
      showToast("Password must be at least 6 characters", "danger");
      return;
    }

    const userToSend = {
      userName: userName,
      email: email,
      PasswordHash: password,
      Role: "User", // Default role, adjust as needed
    };

    try {
      await dispatch(Adduser(userToSend as any)).unwrap();

      // Reset fields after success
      setUserName("");
      setEmail("");
      setPassword("");

      showToast("User Added Successfully!", "success");
      setTimeout(() => navigate("/ListUsers"), 1500);
    } catch (error) {
      console.error("Failed to add user:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add user";
      showToast(errorMessage, "danger");
    }
  };

  // ✅ FIX 2: return is now at the TOP LEVEL of the component
  // ❌ BEFORE: return was inside handleInputChange
  return (
    <Container className="form-container">
      <Card className="bank-form-card">
        <Card.Header
          as="h5"
          className="text-center bank-form-header"
          style={{ backgroundColor: "#2c3e50", color: "white" }}
        >
          Add New User
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleAddUser}>
            <Form.Group className="mb-4" controlId="formUserName">
              <Form.Label className="bank-form-label">UserName</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                className="bank-form-input"
                value={userName}
                // ✅ FIX 3: use e.target.value to get what user typed
                // ❌ BEFORE: setUserName(userName) just set the same value again
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formEmail">
              <Form.Label className="bank-form-label">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                className="bank-form-input"
                value={email}
                // ✅ FIX 4: use e.target.value
                // ❌ BEFORE: setEmail(email) just set the same value again
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label className="bank-form-label">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Min 6 characters"
                className="bank-form-input"
                value={password}
                // ✅ FIX 5: use e.target.value AND set password not userName
                // ❌ BEFORE: setPassword(userName) was setting password to userName!
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button
                variant="primary"
                type="submit"
                className="bank-form-btn bank-form-btn-submit"
                style={{ backgroundColor: "#2c3e50", color: "white" }}
              >
                Submit
              </Button>
              <Link to="/ListUsers">
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
