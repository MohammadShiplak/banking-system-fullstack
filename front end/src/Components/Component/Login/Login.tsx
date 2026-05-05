import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Modal } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import {
  LoginPage,
  clearRateLimit,
  decrementTimer,
  setRateLimit, // Added in case we need to trigger it manually
} from "../../../features/userSlice";
import { useAppDispatch, useAppSelector } from "../../../store"; // Make sure useAppSelector is exported from your store!
import { useToast } from "../contexts/ToastContext";

const LoginForm = () => {
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // --- 1. Read Rate Limit State from Redux ---
  const { isRateLimited, rateLimitMessage, rateLimitSeconds } = useAppSelector(
    (state: any) => state.users,
  );

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // --- 2. The Countdown Timer ---
  useEffect(() => {
    if (!isRateLimited) return;

    if (rateLimitSeconds <= 0) {
      dispatch(clearRateLimit());
      return;
    }

    const timer = setInterval(() => {
      dispatch(decrementTimer());
    }, 1000);

    return () => clearInterval(timer);
  }, [isRateLimited, rateLimitSeconds, dispatch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if they are locked out
    if (isRateLimited) return;

    try {
      const result = await dispatch(
        LoginPage({
          Email: loginData.email,
          Password: loginData.password,
        }),
      );

      if (LoginPage.fulfilled.match(result)) {
        showToast("Login Successful :-)", "success");
        navigate("/Main");
      } else if (LoginPage.rejected.match(result)) {
        // Check if the error is a 429 Too Many Requests
        if (
          result.payload?.includes("429") ||
          result.payload?.includes("Too many")
        ) {
          // Trigger the rate limit manually if your Axios interceptor hasn't already
          dispatch(
            setRateLimit({
              message: "Too many attempts. Please wait.",
              seconds: 60,
            }),
          );
          showToast("Too many attempts!", "danger");
        } else if (result.payload?.includes("401")) {
          showToast("Invalid username or password", "danger");
        } else {
          showToast(
            result.payload || "Login failed. Please try again.",
            "danger",
          );
        }
      }
    } catch (error) {
      showToast("An unexpected error occurred", "danger");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Card className="w-100" style={{ maxWidth: "500px" }}>
        <Card.Header
          className="text-center py-3"
          style={{ backgroundColor: "#2c3e50", color: "white" }}
        >
          Sign In
        </Card.Header>

        <Card.Body>
          {/* --- 3. Display the Warning Box if Locked Out --- */}
          {isRateLimited && (
            <div className="alert alert-danger text-center mb-4" role="alert">
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>🔒</div>
              <strong>{rateLimitMessage || "Too many attempts!"}</strong>
              <p className="mb-0 mt-2">
                Please wait{" "}
                <strong style={{ fontSize: "20px" }}>{rateLimitSeconds}</strong>{" "}
                seconds.
              </p>
            </div>
          )}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={loginData.email}
                onChange={handleInputChange}
                required
                disabled={isRateLimited} // Disable input if locked
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
                disabled={isRateLimited} // Disable input if locked
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100 mb-3"
              disabled={isRateLimited} // Disable button if locked
              style={{
                backgroundColor: isRateLimited ? "#95a5a6" : "#2c3e50", // Turn grey when disabled
                border: "none",
              }}
            >
              {/* Change button text to show the countdown */}
              {isRateLimited ? `Wait ${rateLimitSeconds}s...` : "Login"}
            </Button>
            {/* --- NEW REGISTRATION LINK ADDED HERE --- */}
            <div className="text-center mt-3">
              Don't have an account?{" "}
              <Link
                to="/Register"
                style={{
                  color: "#2c3e50",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                Register here
              </Link>
            </div>
            {/* -------------------------------------- */}{" "}
          </Form>
        </Card.Body>
      </Card>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => setShowSuccessModal(false)}
            style={{ backgroundColor: "#2c3e50", border: "none" }}
          >
            Continue
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => setShowErrorModal(false)}
            style={{ backgroundColor: "#e74c3c", border: "none" }}
          >
            Try Again
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LoginForm;
