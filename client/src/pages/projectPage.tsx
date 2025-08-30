import React, { useState, useEffect, ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoIcon from "@mui/icons-material/Info";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmailIcon from '@mui/icons-material/Email';
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

// Define types for concerns and project
interface Concern {
  icon: ReactNode;
  label: string;
  desc: string;
}

interface Project {
  title: string;
  description: string;
  tags: string[];
  votes: number;
  concerns: Concern[];
  benefits: string[];
  summary: {
    votes: number;
    priority: string;
    keyBenefits: number;
    daysActive: number;
  };
}

export default function ProjectPage() {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const dummyData: Project = {
      title: "Green Community Park",
      description:
        "Transform the vacant lot on Maple Street into a sustainable community park with native plants, solar lighting, and rainwater collection systems.",
      tags: ["Government Initiative", "Accepted", "1/15/2024"],
      // votes: 45,
      concerns: [
        { icon: <InfoIcon />, label: "Budget", desc: "2 million" },
        { icon: <AccessTimeIcon />, label: "Timeline", desc: "8 months" },
        { icon: <EmailIcon />, label: "Contact Email", desc: "hello@hello.com" },
      ]
    };
    setProject(dummyData);
  }, []);


  if (!project) return <Typography sx={{ mt: 4, textAlign: "center" }}>Loading...</Typography>;

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
      {/* Back button */}
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Back to Projects
      </Button>

      {/* Project Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {project.tags.map((tag, i) => (
              <Chip key={i} label={tag} size="small" />
            ))}
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <ThumbUpIcon />
            <Typography>{project.votes}</Typography>
          </Box>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          {project.title}
        </Typography>
        <Typography color="text.secondary">{project.description}</Typography>
      </Paper>

      {/* Project Concerns */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Project Concerns & Considerations
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {project.concerns.map((c, i) => (
            <Box
              key={i}
              sx={{ display: "flex", alignItems: "center", p: 1, borderRadius: 1, backgroundColor: "#f5f5f5" }}
            >
              {c.icon}
              <Box sx={{ ml: 1 }}>
                <Typography sx={{ fontWeight: 500 }}>{c.label}</Typography>
                <Typography variant="body2" color="text.secondary">{c.desc}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

    </Box>
  );
}
