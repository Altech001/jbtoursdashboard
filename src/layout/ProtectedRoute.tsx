import { useAuth } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router";
import { ClipLoader } from "react-spinners";

export const ProtectedRoute = () => {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) {
    // Show a loading indicator while Clerk is verifying the session
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color={"#465FFF"} size={50} />
      </div>
    );
  }

  if (!userId) {
    // If the user is not signed in, redirect them to the sign-in page
    return <Navigate to="/signin" />;
  }

  // If the user is signed in, render the protected routes
  return <Outlet />;
};