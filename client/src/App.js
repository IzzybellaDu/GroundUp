import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Proposal from "./proposal";

function Home() {
  const [data, setData] = useState([{}]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/members")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
      });
  }, []);

  function handleClick() {
    navigate("/proposal"); // navigate to Proposal page
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClick}>Go to Proposal</Button>
      {typeof data.members === "undefined" ? (
        <p>Loading...</p>
      ) : (
        data.members.map((member, i) => <p key={i}>{member}</p>)
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/proposal" element={<Proposal />} />
      </Routes>
    </Router>
  );
}
