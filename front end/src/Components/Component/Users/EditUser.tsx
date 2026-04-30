import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "../../../types/user";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store";
import axios from "axios";
import { fetchUsers, UpdateUsers } from "../../../features/userSlice";
import { useToast } from "../contexts/ToastContext";
import axiosInstance from "../../../API/axiosInstance";
//import "./styles/Add.css";
export default function EditUser() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);

  const { Id } = useParams<{ Id: string }>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUsersbyId = async () => {
      try {
        const response = await axiosInstance.get(`/api/User/${Id}`);

        setLoading(true);

        setUserName(response.data.userName);
        setEmail(response.data.email);
        setPassword(response.data.passwordHash);
      } catch (ex) {
        console.error(ex);
      }
    };

    if (Id) {
      fetchUsersbyId();
    }
  }, [Id, dispatch]);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim() || !email.trim() || !password.trim()) {
      showToast("All fields are required", "danger");
      return;
    }

    const userToSend = {
      id: Number(Id),
      userName: userName,
      email: email,
      PasswordHash: password,
      Role: "User", // Default role, adjust as needed
    };

    try {
      const updatedUser = await dispatch(UpdateUsers(userToSend)).unwrap();

      showToast("User Updated Successfully :-)", "info");

      navigate("/ListUsers");
    } catch (error) {
      showToast(`${error}`, "danger");
    }
  };

  return (
    <Container className="form-container">
      <Card className="bank-form-card">
        <Card.Header
          as="h5"
          className="text-center bank-form-header"
          style={{ backgroundColor: "#2c3e50", color: "white" }}
        >
          Update User
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleUpdateUser}>
            <Form.Group className="mb-4" controlId="formUserName">
              <Form.Label className="bank-form-label">UserName</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                className="bank-form-input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formEmail">
              <Form.Label className="bank-form-label">Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Email "
                className="bank-form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label className="bank-form-label">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password "
                className="bank-form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button
                variant="primary"
                type="submit"
                className="bank-form-btn bank-form-btn-submit"
              >
                Update
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
