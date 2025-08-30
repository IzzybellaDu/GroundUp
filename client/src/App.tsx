import React, { useState, useEffect } from "react";
import { Button, Container, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { GlobalStyle, MainBox, ProjectContainer, Tag } from "./dashboardStyle.ts";

export default function Home() {
  
  const navigate = useNavigate();

  function handleClick() {
    navigate("/proposal"); // navigate to Proposal page
  }

  return (
    <div>
      <GlobalStyle />
      <Typography variant="h4">Project Dashboard</Typography>
      <p>Welcome to our app!</p>
      <Button variant="outlined" onClick={handleClick}>
        Create a new proposal
      </Button>
    </div>
  );
}
