import React, { useState, useEffect } from "react";
import { Button, Container, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { GlobalStyle, MainBox, ProjectContainer, Tag } from "./dashboardStyle.ts";


export default function Home() {
  const navigate = useNavigate();
  
  // Add state for authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  // Check authentication status when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth-status');
      const data = await response.json();
      
      if (data.authenticated) {
        setIsAuthenticated(true);
        setUsername(data.username);
      } else {
        setIsAuthenticated(false);
        setUsername('');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  function handleClick() {
    navigate("/proposal"); // navigate to Proposal page
  }

  function registerClick() {
    navigate("/register"); // navigate to Register page
  }

  function loginClick() {
    navigate("/login"); // navigate to Login page
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        // Update state instead of reloading page
        setIsAuthenticated(false);
        setUsername('');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error logging out');
    }
  };

  // Show loading while checking auth status
  if (loading) {
    return (
      <div>
        <Typography variant="h4">Project Dashboard</Typography>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <GlobalStyle />
      <Typography variant="h4">Project Dashboard</Typography>
      
      {/* Show username if logged in */}
      {isAuthenticated ? (
        <p>Welcome back, {username}!</p>
      ) : (
        <p>Welcome to our app!</p>
      )}
      
      <Button variant="outlined" onClick={handleClick}>
        Create a new proposal
      </Button>
      
      {/* Conditionally render auth buttons */}
      {isAuthenticated ? (
        // Show only logout when logged in
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        // Show register and login when not logged in
        <>
          <Button variant="outlined" onClick={registerClick}>
            Register
          </Button>
          <Button variant="outlined" onClick={loginClick}>
            Login
          </Button>
        </>
      )}
    </div>
  );
}