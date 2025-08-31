import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Typography,
  Paper,
  Grid,
  TextField,
  Avatar,
  Divider,

} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoIcon from "@mui/icons-material/Info";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";

// Define types for concerns and project
interface Concern {
  icon: ReactNode;
  label: string;
  desc: string;
}

import MapView from "../components/mapView.tsx"
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ReportIcon from '@mui/icons-material/Report';
import SellIcon from '@mui/icons-material/Sell';

interface Project {
  id: number;
  name: string;
  description: string;
  government: string;
  budget: number | null;
  timeline: number | null;
  contact_email: string;
  status: string;
  latitude: string;
  longitude: string;
  created_at: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
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

// Comments Section Component

function CommentsSection({ projectId }: { projectId: string }) {

  const [comments, setComments] = useState<Comment[]>([]);

  const [newComment, setNewComment] = useState<string>("");

  const [authorName, setAuthorName] = useState<string>("");

  const [submitting, setSubmitting] = useState<boolean>(false);



  // Fetch comments from backend

  const fetchComments = async () => {

    try {

      const response = await fetch(`/api/comments/${projectId}`, {

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

        // Convert backend data to frontend Comment format

        const formattedComments: Comment[] = data.project.map((comment: any) => ({

          id: comment.id.toString(),

          author: comment.name,

          content: comment.description,

          timestamp: new Date(comment.createdAt),

        }));

        setComments(formattedComments);

      }

    } catch (error) {

      console.error('Error fetching comments:', error);

    }

  };



  // Load comments on component mount

  useEffect(() => {

    if (projectId) {

      fetchComments();

    }

  }, [projectId]);



  const handleSubmitComment = async () => {

    if (!newComment.trim() || !authorName.trim() || submitting) return;



    setSubmitting(true);

    

    try {

      // Create FormData to match your backend expectation

      const formData = new FormData();

      formData.append('project_id', projectId);

      formData.append('name', authorName.trim());

      formData.append('description', newComment.trim());



      const response = await fetch('/api/comments', {

        method: 'POST',

        body: formData, // Using FormData instead of JSON

      });



      if (!response.ok) {

        throw new Error(`HTTP error! status: ${response.status}`);

      }



      const data = await response.json();

      

      if (data.status === 'success') {

        // Clear form and reload comments

        setNewComment("");

        setAuthorName("");

        await fetchComments(); // Reload comments from backend

      } else {

        console.error('Error adding comment:', data.message);

      }

    } catch (error) {

      console.error('Error submitting comment:', error);

    } finally {

      setSubmitting(false);

    }

  };



  const formatTimestamp = (timestamp: Date) => {

    const now = new Date();

    const diff = now.getTime() - timestamp.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const hours = Math.floor(diff / (1000 * 60 * 60));

    const minutes = Math.floor(diff / (1000 * 60));



    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;

    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

    return 'Just now';

  };



  return (

    <Paper sx={{ p: 3 }}>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>

        Comments ({comments.length})

      </Typography>



      {/* Add Comment Form */}

      <Box sx={{ mb: 3 }}>

        <TextField

          fullWidth

          placeholder="Your name"

          value={authorName}

          onChange={(e) => setAuthorName(e.target.value)}

          size="small"

          sx={{ mb: 2 }}

        />

        <TextField

          fullWidth

          multiline

          rows={3}

          placeholder="Share your thoughts about this project..."

          value={newComment}

          onChange={(e) => setNewComment(e.target.value)}

          sx={{ mb: 2 }}

        />

        <Button

          variant="contained"

          startIcon={<SendIcon />}

          onClick={handleSubmitComment}

          disabled={!newComment.trim() || !authorName.trim() || submitting}

        >

          {submitting ? 'Posting...' : 'Post Comment'}

        </Button>

      </Box>



      <Divider sx={{ mb: 3 }} />



      {/* Comments List */}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

        {comments.length === 0 ? (

          <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>

            No comments yet. Be the first to share your thoughts!

          </Typography>

        ) : (

          comments

            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

            .map((comment) => (

              <Box key={comment.id} sx={{ display: "flex", gap: 2 }}>

                <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>

                  <PersonIcon />

                </Avatar>

                <Box sx={{ flex: 1 }}>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>

                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>

                      {comment.author}

                    </Typography>

                    <Typography variant="caption" color="text.secondary">

                      {formatTimestamp(comment.timestamp)}

                    </Typography>

                  </Box>

                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>

                    {comment.content}

                  </Typography>

                </Box>

              </Box>

            ))

        )}

      </Box>

    </Paper>

  );

}

export default function ProjectPage() {
  const { id }  = useParams<{ id: string}>(); 
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

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

  const concerns = [
    { icon: <MonetizationOnIcon />, label: "Budget", desc: project.budget ? `${project.budget} million` : "N/A" },
    { icon: <AccessTimeIcon />, label: "Timeline", desc: project.timeline ? `${project.timeline} months` : "N/A" },
    { icon: <LocationCityIcon />, label: "Type", desc: project.type || "N/A" },
    { icon: <ReportIcon />, label: "Urgency", desc: project.urgency || "N/A" },
    { icon: <InfoIcon />, label: "Votes", desc: project.votes?.toString() ?? "0" },
    { icon: <MonetizationOnIcon />, label: "Cost", desc: project.concerns?.cost ?? "N/A" },
    { icon: <AccessTimeIcon />, label: "Development Time", desc: project.concerns?.devTime ?? "N/A" }
  ]

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
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {project.title}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip key={1} label={project.government} size="small" />
              <Chip key={2} label={project.status} size="small" />
              {/* <Chip key={3} label={project.created_at} size="small" /> */}
            </Box>
          </Box>
          <LikeButton 
            initialCount={project.votes || 0}
            storageKey={`project-${project.id}-liked`}
          />
      </Box>
        <Typography color="text.secondary">{project.description}</Typography>
      </Paper>

      <MapView 
        latittude={Number(project.latitude)} 
        longitude={Number(project.longitude)} 
        projectName={project.name} 
      />


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
      {/* Comments Section */}
      <CommentsSection projectId={id || ""} />
    </Box>
  );
};
