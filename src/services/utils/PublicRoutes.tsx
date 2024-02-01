import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import isTokenValid from "./IsTokenValid";

const PublicRoutes = () => {
  const [tokenValid, setTokenValid] = useState<boolean | null>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setTokenValid(false);
      return;
    }

    const checkToken = async () => {
      const isValid = await isTokenValid(token);
      setTokenValid(isValid);
    };

    checkToken(); 
  }, []); 

  return tokenValid ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoutes;
