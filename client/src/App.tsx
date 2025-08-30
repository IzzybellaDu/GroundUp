import React, { useState, useEffect } from "react";
import { Button, Container, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, useNavigate, BrowserRouter } from "react-router-dom";
import Proposal from "./pages/proposal.tsx";
import ProjectPage from  "./pages/projectPage.tsx";


export default function Home() {
  // const [data, setData] = useState([{}]);
  const navigate = useNavigate();

  function handleClick() {
    navigate("/proposal"); // navigate to Proposal page
  }

  function viewClick() {
    navigate("/projectPage"); // navigate to Proposal page
  }

  return (

    <div>
      <Typography variant="h4">Project Dashboard</Typography>
      <p>Welcome to our app!</p>
      <Button variant="outlined" onClick={handleClick}>
        Create a new proposal
      </Button>
      <Button variant="outlined" onClick={viewClick}>
        View a Proposal
      </Button>
    </div>
  );

};