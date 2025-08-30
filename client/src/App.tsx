import React, { useState, useEffect } from "react";
import { Button, Container, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";


export default function Home() {
  
  const navigate = useNavigate();

  function handleClick() {
    navigate("/proposal"); // navigate to Proposal page
  }

  function registerClick() {
    navigate("/register"); // navigate to Register page
  }

  function loginClick() {
    navigate("/login"); // navigate to Login page
  }

  return (
    <div>
      <Typography variant="h4">Project Dashboard</Typography>
      <p>Welcome to our app!</p>
      <Button variant="outlined" onClick={handleClick}>
        Create a new proposal
      </Button>
      <Button variant="outlined" onClick={registerClick}>
        Register
      </Button>
      <Button variant="outlined" onClick={loginClick}>
        Login
      </Button>
    </div>
  );
}
