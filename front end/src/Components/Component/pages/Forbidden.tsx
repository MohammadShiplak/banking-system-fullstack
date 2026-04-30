import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store";
export default function Forbidden() {
  const navigate = useNavigate();
  const { role } = useAppSelector((state) => state.users);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1 style={{ fontSize: "80px", color: "red" }}>403</h1>
      <h2>Access Denied</h2>
      <p>You do not have permission to view this page.</p>
      <p>
        Your current role is: <strong>{role ?? "Unknown"}</strong>
      </p>

      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}
