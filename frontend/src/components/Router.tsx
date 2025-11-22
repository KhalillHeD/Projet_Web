import React, { useState, useEffect } from "react";
import { Signup } from "../pages/Signup";
import { Login } from "../pages/Login";
import { Businesses } from "../pages/Businesses";
import { BusinessDetail } from "../pages/BusinessDetail";  // <-- REQUIRED
import { matchRoute } from "../utils/router";
import { useAuth } from "../context/AuthContext";

export const Router: React.FC = () => {
  const [currentPath, setCurrentPath] = useState("/signup");
  const { user, loading } = useAuth();

  const handleNavigate = (path: string) => {
    const protectedRoute =
      matchRoute("/businesses", path).match ||
      matchRoute("/business/:id", path).match;

    if (!user && protectedRoute) {
      setCurrentPath("/login");
      return;
    }

    setCurrentPath(path);
  };

  useEffect(() => {
    if (!loading && user && (currentPath === "/login" || currentPath === "/signup")) {
      setCurrentPath("/businesses");
    }
  }, [user, loading, currentPath]);

  const renderPage = () => {
    if (loading) return <div>Loading...</div>;

    if (matchRoute("/signup", currentPath).match) {
      return <Signup onNavigate={handleNavigate} />;
    }

    if (matchRoute("/login", currentPath).match) {
      return <Login onNavigate={handleNavigate} />;
    }

    if (matchRoute("/businesses", currentPath).match) {
      return <Businesses onNavigate={handleNavigate} />;
    }

    const matchBusinessDetail = matchRoute("/business/:id", currentPath);
    if (matchBusinessDetail.match) {
      const { params } = matchBusinessDetail;
      return (
        <BusinessDetail
          businessId={params.id}
          onNavigate={handleNavigate}
        />
      );
    }

    return <Signup onNavigate={handleNavigate} />;
  };

  return <div>{renderPage()}</div>;
};

export default Router;
