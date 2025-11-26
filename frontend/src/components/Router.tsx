import React, { useState } from "react";
import { Signup } from "../pages/Signup";
import { Businesses } from "../pages/Businesses";
import { Login } from "../pages/Login";
import { matchRoute } from "../utils/router";
import { useAuth } from "../context/AuthContext";


export const Router: React.FC = () => {
  const [currentPath, setCurrentPath] = useState("/signup"); 
  const { user, loading } = useAuth();

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const isProtectedRoute = (path: string) => {
    if (matchRoute("/businesses", path).match) return true;
    if (matchRoute("/business/:id", path).match) return true;
  
    return false;
  };

  const renderPage = () => {
    if (loading) {
      return <div>Loading session...</div>;
    }

    // If route is protected and user is not logged in → show Login
    if (!user && isProtectedRoute(currentPath)) {
      return <Login onNavigate={handleNavigate} />;
    }

    // Public routes
    if (matchRoute("/signup", currentPath).match) {
      return <Signup onNavigate={handleNavigate} />;
    }

    if (matchRoute("/login", currentPath).match) {
      return <Login onNavigate={handleNavigate} />;
    }

    // Protected routes (only reachable here if user is not null)
    if (matchRoute("/businesses", currentPath).match) {
      return <Businesses onNavigate={handleNavigate} />;
    }

    const businessMatch = matchRoute("/business/:id", currentPath);
    if (businessMatch.match) {
      const { params } = businessMatch;
      // if you have a BusinessDetail page, use it here:
      // return (
      //   <BusinessDetail
      //     businessId={params.id}
      //     onNavigate={handleNavigate}
      //   />
      // );
      return <div>Business detail for {params.id}</div>;
    }

    // Default
    return <Signup onNavigate={handleNavigate} />;
  };

  return <div>{renderPage()}</div>;
};
