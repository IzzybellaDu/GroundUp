import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Typography,
  Paper,
  Divider,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoIcon from "@mui/icons-material/Info";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import SafetyCheckIcon from "@mui/icons-material/SafetyCheck";
import ConstructionIcon from "@mui/icons-material/Construction";
import GroupIcon from "@mui/icons-material/Group";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

export default function ProjectPage() {
  const [project, setProject] = useState(null);

  useEffect(() => {
    const dummyData = {
      name: "Green Community Park",
      description:
        "Transform the vacant lot on Maple Street into a sustainable community park with native plants, solar lighting, and rainwater collection systems.",
      tags: ["Environmental/Sustainability", "Medium Priority"],
      votes: 45,
      concerns: [
        { icon: <InfoIcon />, label: "Budget", desc: "High initial investment (~$150k)" },
        { icon: <AccessTimeIcon />, label: "Timetline", desc: "8-12 months" },
        { icon: <SafetyCheckIcon />, label: "Created at", desc: "Improved lighting and visibility" },
        { icon: <ConstructionIcon />, label: "Status", desc: "New pathways and utilities needed" },
        { icon: <GroupIcon />, label: "Contact email", desc: "Strong neighborhood support" },
      ],
      benefits: [
        "Creates green space for families",
        "Educational opportunities for children",
        "Improves air quality",
        "Gathering place for community events",
      ],
      summary: {
        votes: 45,
        priority: "Medium",
        keyBenefits: 4,
        daysActive: 594,
      },
    };
    setProject(dummyData);
  }, []);

  if (!project) return <Typography sx={{ mt: 4, textAlign: "center" }}>Loading...</Typography>;

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
      {/* Back button */}
      <Button component={Link}
  to="/"
  startIcon={<ArrowBackIcon />}
  sx={{ mb: 3 }}>
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
            <Box key={i} sx={{ display: "flex", alignItems: "center", p: 1, borderRadius: 1, backgroundColor: "#f5f5f5" }}>
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
