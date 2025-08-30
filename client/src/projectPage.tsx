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
import SafetyCheckIcon from "@mui/icons-material/SafetyCheck";
import ConstructionIcon from "@mui/icons-material/Construction";
import GroupIcon from "@mui/icons-material/Group";
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

  // useEffect(() => {
  //   const dummyData: Project = {
  //     title: "Green Community Park",
  //     description:
  //       "Transform the vacant lot on Maple Street into a sustainable community park with native plants, solar lighting, and rainwater collection systems.",
  //     tags: ["Environmental/Sustainability", "Medium Priority", "1/15/2024"],
  //     votes: 45,
  //     concerns: [
  //       { icon: <InfoIcon />, label: "Cost", desc: "High initial investment (~$150k)" },
  //       { icon: <AccessTimeIcon />, label: "Development Time", desc: "8-12 months" },
  //       { icon: <InfoIcon />, label: "Environmental Impact", desc: "Positive - native plants, carbon sequestration" },
  //       { icon: <SafetyCheckIcon />, label: "Safety", desc: "Improved lighting and visibility" },
  //       { icon: <ConstructionIcon />, label: "Infrastructure", desc: "New pathways and utilities needed" },
  //       { icon: <GroupIcon />, label: "Community", desc: "Strong neighborhood support" },
  //     ],
  //     benefits: [
  //       "Creates green space for families",
  //       "Educational opportunities for children",
  //       "Improves air quality",
  //       "Gathering place for community events",
  //     ],
  //     summary: {
  //       votes: 45,
  //       priority: "Medium",
  //       keyBenefits: 4,
  //       daysActive: 594,
  //     },
  //   };
  //   setProject(dummyData);
  // }, []);

  useEffect(() => {
  async function load() {
    try {
      const res = await fetch('/api/proposals'); 
      const list = await res.json();

      const p = list[0];
      if (!p) return;

      const mapped: Project = {
        title: p.name,
        description: p.description,
        tags: [
          p.government === 'government' ? 'Government project' : 'Community suggestion',
          (p.status || 'active').replace(/^\w/, (c: string) => c.toUpperCase()), // capitalise
          new Date(p.created_at).toLocaleDateString()
        ],
        votes: 0, 
        concerns: [
          { icon: <InfoIcon />, label: "Budget", desc: p.budget ? `$${p.budget}` : 'N/A' },
          { icon: <AccessTimeIcon />, label: "Timeline (weeks)", desc: p.timeline ?? 'N/A' },
          { icon: <InfoIcon />, label: "Status", desc: p.status },
        ],
        benefits: [],
        summary: {
          votes: 0,
          priority: 'Unassigned',
          keyBenefits: 0,
          daysActive: Math.max(0, Math.floor((Date.now() - new Date(p.created_at).getTime()) / (1000*60*60*24))),
        }
      };

      setProject(mapped);
    } catch (e) {
      console.error(e);
    }
  }
  load();
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

      {/* Project Benefits */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Project Benefits
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {project.benefits.map((b, i) => (
            <Box key={i} sx={{ p: 1, borderRadius: 1, backgroundColor: "#e6f4ea" }}>
              <Typography>{b}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Project Summary */}
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Typography sx={{ fontWeight: 500 }}>Community Votes</Typography>
            <Typography>{project.summary.votes}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography sx={{ fontWeight: 500 }}>Priority Level</Typography>
            <Typography>{project.summary.priority}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography sx={{ fontWeight: 500 }}>Key Benefits</Typography>
            <Typography>{project.summary.keyBenefits}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography sx={{ fontWeight: 500 }}>Days Active</Typography>
            <Typography>{project.summary.daysActive}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
