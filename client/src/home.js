import React, { useState, useEffect } from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/members")
      .then((res) => res.json())
      .then((data) => setData(data.members || []));
  }, []);

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Home Page
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Button variant="outlined" onClick={() => navigate("/proposal")}>
          Go to Proposal
        </Button>
        <Button variant="contained" onClick={() => navigate("/project")}>
          Go to Project Page
        </Button>
      </Box>

      {data.length === 0 ? (
        <Typography>Loading...</Typography>
      ) : (
        data.map((member, i) => <Typography key={i}>{member}</Typography>)
      )}
    </Box>
  );
}
