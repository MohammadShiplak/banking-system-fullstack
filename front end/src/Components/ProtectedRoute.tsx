import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store";

// This component wraps pages that require login or a specific role
// Props:
//   children      = the page to show if allowed
//   requiredRole  = optional: "Admin", "Teller", "Client"
interface ProtectedRouteProps {
  children: React.ReactNode; // The page component to protect
  requiredRole?: string; // Optional: only allow this role
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  // Read auth state from Redux
  const { isAuthenticated, role } = useAppSelector((state: any) => state.users);

  // RULE 1: If not logged in at all → send to login page
  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
    //       ↑ replace means the browser back button won't go back to the protected page
  }

  // RULE 2: If a role is required AND user doesn't have it → send to forbidden page
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/Forbidden" replace />;
  }

  // RULE 3: User is allowed → show the page
  return <>{children}</>;
}
