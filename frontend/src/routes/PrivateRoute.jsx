import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/userContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(UserContext);

  // jab tak user load ho raha hai
  if (loading) {
    return <div>Loading...</div>;
  }

  // agar login nahi hai
  if (!user) {
    return <Navigate to="/login" />;
  }

  // agar role allowed nahi hai
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // sab sahi hai
  return <Outlet />;
};

export default PrivateRoute;
