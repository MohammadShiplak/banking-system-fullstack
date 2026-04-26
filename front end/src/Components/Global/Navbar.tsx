import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { logout, isLoggedIn } from "../../utils/authUtils";
import { useAppDispatch } from "../../store";

const TopNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // Clear token and redirect to login
    logout();
  };

  return (
    <Navbar bg="dark" expand="lg" sticky="top" className="mb-4">
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/Main")}
          style={{ cursor: "pointer", color: "white" }}
        >
          🏦 Banking System
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              onClick={() => navigate("/Main")}
              style={{ color: "white" }}
            >
              Dashboard
            </Nav.Link>

            {isLoggedIn() ? (
              <>
                <Nav.Link
                  onClick={() => navigate("/clients")}
                  style={{ color: "white" }}
                >
                  Clients
                </Nav.Link>

                <Nav.Link
                  onClick={() => navigate("/users")}
                  style={{ color: "white" }}
                >
                  Users
                </Nav.Link>

                <Button
                  variant="outline-danger"
                  onClick={handleLogout}
                  className="ms-2"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="outline-light"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
