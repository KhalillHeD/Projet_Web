import React, { useState } from 'react';
import { Signup } from '../pages/Signup';
import { Businesses } from '../pages/Businesses'; // You'll need to create this
import { Login } from '../pages/Login'; // You'll need to create this
import { parseRoute, matchRoute } from '../utils/router'; // Your router utilities

export const Router: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/signup'); // Start at signup

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const renderPage = () => {
    // Check which route matches the current path
    if (matchRoute('/signup', currentPath).match) {
      return <Signup onNavigate={handleNavigate} />;
    }
    
    if (matchRoute('/login', currentPath).match) {
      return <Login onNavigate={handleNavigate} />;
    }
    
    if (matchRoute('/businesses', currentPath).match) {
      return <Businesses onNavigate={handleNavigate} />;
    }
    
    if (matchRoute('/business/:id', currentPath).match) {
      const { params } = matchRoute('/business/:id', currentPath);
      return <BusinessDetail businessId={params.id} onNavigate={handleNavigate} />;
    }
    
    // Default to signup if no route matches
    return <Signup onNavigate={handleNavigate} />;
  };

  return (
    <div>
      {renderPage()}
    </div>
  );
};