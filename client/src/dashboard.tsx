import React, { useState, useEffect } from 'react';
import { Project, PROJECT_TYPES } from './types';
import * as styles from './dashboardStyle.ts';
import ProjectModule from './projectModule.tsx';
import { Button, InputLabel, MenuItem, FormControl, Select, SelectChangeEvent, CircularProgress, Alert } from '@mui/material';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  // projects: Project[];
  onProjectClick: (projectId: string) => void;
  onVote: (projectId: string, voteType: 'up' | 'down') => void;
}

export default function Dashboard({ onProjectClick, onVote }: DashboardProps) {

  const [type, setType] = React.useState(''); // Default is All
  const [sort, setSort] = React.useState(''); // Default is sort by votes
  
  // State for projects data
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const handleProjectClick = (projectId: string) => {
    // Implement the actual logic here
    console.log(`Project clicked: ${projectId}`);
    // Navigate to the project page
    navigate(`/projects/${projectId}`);
  };
  
  const changeType = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };
  
   const changeSort = (event: SelectChangeEvent) => {
    setSort(event.target.value);
  };
  
  const filteredProjects: Project[] = projects?.filter(project => 
    type === '' || project.type === type
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sort) {
      case '':
        return b.votes - a.votes;
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'urgency':
        const urgencyOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      default:
        return 0;
    }
  });
  
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const fetchedProjects = await fetchProjects();
        setProjects(fetchedProjects);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, []);
  
  const navigate = useNavigate();

  const handleNewProject = () => {
    navigate('/proposal');
  };

  const refreshProjects = async () => {
    try {
      const fetchedProjects = await fetchProjects();
      setProjects(fetchedProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh projects');
    }
  };

  // fetch projects from backend
  const fetchProjects = async (): Promise<Project[]> => {
    try {
      const response = await fetch('/api/proposals', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        return data.projects;
      } else {
        throw new Error(data.message || 'Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  };
  
  return (
    <styles.MainBox>
      <styles.GlobalStyle />
      
        <div className='header'>
          <div>
            <h1>City Projects</h1>
            <p>Your city. Your voice.</p>
          </div>
          <Button variant="contained" startIcon={<MapsUgcOutlinedIcon />} sx={{ backgroundColor: "black" }} onClick={handleNewProject}>
            New Project
          </Button>
        </div>
        
        <div className='filters'>
          <FilterAltOutlinedIcon sx={{ fontSize: "30px" }} />
          <FormControl variant="filled" sx={{ minWidth: 250, verticalAlign: "middle", padding: "0 10px" }} size="small" >
            <InputLabel sx={{ padding: "0 10px" }} id="type-label" shrink={true} >Type</InputLabel>
            <Select
              displayEmpty
              labelId="type-label"
              value={type}
              onChange={changeType}
            >
              <MenuItem value={""}>All Types</MenuItem>
              <MenuItem value={"Environmental/sustainability"}>Envrionmental/Sustainability</MenuItem>
              <MenuItem value={"Traffic"}>Traffic</MenuItem>
              <MenuItem value={"Bike lanes"}>Bike Lanes</MenuItem>
              <MenuItem value={"Roads"}>Roads</MenuItem>
              <MenuItem value={"Public transport"}>Public Transport</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="filled" sx={{ minWidth: 250, verticalAlign: "middle", padding: "0 10px" }} size="small" >
            <InputLabel sx={{ padding: "0 10px" }} id="sort-label" shrink={true} >Sort By</InputLabel>
            <Select
              displayEmpty
              labelId="sort-label"
              value={sort}
              onChange={changeSort}
            >
              <MenuItem value={""}>Most Votes</MenuItem>
              <MenuItem value={"recent"}>Most Recent</MenuItem>
              <MenuItem value={"urgency"}>Highest Urgency</MenuItem>
            </Select>
          </FormControl>
        </div>
      
      {!loading && !error && (
        <>
          {sortedProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>No projects found. Be the first to create one!</p>
            </div>
          ) : (
            sortedProjects.map(project => (
              <ProjectModule 
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project.id)}
              />
//               {sortedProjects.map((item) => (
//           <ProjectModule project={item}></ProjectModule>
//         ))}
            ))
          )}
        </>
      )}
      
     {/* Loading state */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <CircularProgress />
        </div>
      )}

      {/* Error state */}
      {error && (
        <Alert severity="error" style={{ margin: '20px 0' }}>
          {error}
          <Button onClick={refreshProjects} style={{ marginLeft: '10px' }}>
            Retry
          </Button>
        </Alert>
      )}      

    </styles.MainBox>
  );
}