import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ isAdmin }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (loading === false && isAuthenticated === false) {
      navigate("/admin/login");
    }

    if (user && isAdmin && user.role === "user") {
      navigate("/admin/login");
    }
  // eslint-disable-next-line
  }, [isAuthenticated, isAdmin, navigate, user]);

  return <Outlet />;
};

export default ProtectedRoute;
