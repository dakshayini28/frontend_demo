import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
   const isLoggedIn=localStorage.getItem("IsLoggedIn");
   return isLoggedIn==="true"?<Outlet/>:<Navigate to="/"/>
}

export default ProtectedRoute
