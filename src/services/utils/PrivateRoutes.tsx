import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import isTokenValid from "./IsTokenValid";

const PrivateRoutes = () => {
  const [tokenValid, setTokenValid] = useState<boolean | null>(true);

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

  return tokenValid ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
