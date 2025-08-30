import React, { useState, useEffect, ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
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
  id: number;
  name: string;
  description: string;
  government: string;
  budget: number | null;
  timeline: number | null;
  contact_email: string;
  status: string;
  lattitude: string;
  longitude: string;
  created_at: string;
}


type LikeButtonProps = {
  initialCount?: number;
  storageKey?: string;
  onChange?: (liked: boolean, nextCount: number) => void;
}

export function LikeButton({initialCount = 0, storageKey, onChange}: LikeButtonProps) {
  const [liked, setLiked] = useState<boolean>(() => {
    if (!storageKey) return false;
    return localStorage.getItem(storageKey) === '1';
  });
  const [count, setCount] = useState<number>(() => initialCount + (liked ? 1 : 0));

  const toggleLike = () => {
    const nextLiked = !liked;
    const delta = nextLiked ? +1 : -1;
    const nextCount = count + delta;

    setLiked(nextLiked);
    setCount(nextCount);

    if (storageKey) {
      localStorage.setItem(storageKey, nextLiked ? '1' : '0');
    }

    onChange?.(nextLiked, nextCount);
  };

  return (
    <div>
      <Button
      variant={liked ? "contained" : "outlined"}
      startIcon={<ThumbUpIcon />}
      onClick={toggleLike}
      >
      </Button>
      <Typography sx={{ mt : 1 }}>{count} Upvotes</Typography>
    </div>
  )
}


export default function ProjectPage() {
  const { id }  = useParams<{ id: string}>(); 
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  // useEffect(() => {
  //   const dummyData: Project = {
  //     title: "Green Community Park",
  //     description:
  //       "Transform the vacant lot on Maple Street into a sustainable community park with native plants, solar lighting, and rainwater collection systems.",
  //     tags: ["Government Initiative", "Accepted", "1/15/2024"],
  //     votes: 45,
  //     concerns: [
  //       { icon: <InfoIcon />, label: "Budget", desc: "2" },
  //       { icon: <AccessTimeIcon />, label: "Timeline", desc: "8" },
  //     ]
  //   };
  //   setProject(dummyData);
  // }, []);

  const fetchProject = async (id: string): Promise<Project> => {
      try {
        const response = await fetch(`/api/proposals/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'success' && data.project) {
          return data.project as Project;
        } else {
          throw new Error(data.message || 'Failed to fetch project');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        throw error;
      }
    };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error("No project ID");

        
        const fetchedProject = await fetchProject(id);
        setProject(fetchedProject);
        setErr(null);
      } catch (err) {
        setErr(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [id]);

 const formatMoney = (n: number | null) =>
    typeof n === "number" ? n.toLocaleString(undefined, { style: "currency", currency: "AUD" }) : "—";

  const formatDateTime = (s: string | null | undefined) => {
    if (!s) return "—";
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    return d.toLocaleString();
  };

  if (loading) {
    return <Typography sx={{ mt: 4, textAlign: "center" }}>Loading…</Typography>;
  }
  if (err) {
    return (
      <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
        <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
          Back to Projects
        </Button>
        <Typography color="error">{err}</Typography>
      </Box>
    );
  }

  if (!project) return <Typography sx={{ mt: 4, textAlign: "center" }}>Loading...</Typography>;

  const concerns = [{ icon: <InfoIcon />, label: "Budget", desc: `${project.budget} million` },
    { icon: <AccessTimeIcon />, label: "Timeline", desc: `${project.timeline} months` },]

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
              <Chip key={1} label={project.government} size="small" />
              <Chip key={2} label={project.status} size="small" />
              <Chip key={3} label={project.created_at} size="small" />
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <LikeButton
              initialCount={25}
              storageKey={`project:${project.name}:liked`}
            />
          </Box>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          {project.name}
        </Typography>
        <Typography color="text.secondary">{project.description}</Typography>
      </Paper>

      {/* Project Concerns */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Project Concerns & Considerations
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {concerns.map((c, i) => (
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
}``