import React, { useState, useEffect } from 'react';
import { Project, PROJECT_TYPES } from './types';
import * as styles from './dashboardStyle.ts';
import ProjectModule from './projectModule.tsx';
import { Button, InputLabel, MenuItem, FormControl, Select, SelectChangeEvent } from '@mui/material';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

interface DashboardProps {
  projects: Project[];
  onProjectClick: (projectId: string) => void;
  onVote: (projectId: string, voteType: 'up' | 'down') => void;
  onCreateClick: () => void;
}

export default function Dashboard({ onProjectClick, onVote, onCreateClick }: DashboardProps) {  

    // State for projects data
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and sort state
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('votes');

  const changeType = (event: SelectChangeEvent) => {
    setFilterType(event.target.value);
  };
  
  const changeSort = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  // Filter projects based on selected type
  const filteredProjects = projects.filter(project => 
    filterType === 'all' || project.type === filterType
  );

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

  // Sort filtered projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'votes':
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
  
  const testObj: Project = {
    id: "test",
    description: "Hi there this is a descirption awjdoiawjdo awjodj aoiwj doiawj doiajw odijaowdj oiawj doja woidjoawj diojawodjoaiwj dioaj wodijoiwadj oiawj doiawjodij",
    title: "test",
    type: "Environmental/sustainability",
    votes: 50,
    userVote: null,
    concerns: {
      cost: "500 milly",
      devTime: "long",
      environmentalImpact: "bad :(",
      safety: "not safe",
      infrastructure: "yeah",
      community: "yeah"
    },
    likes: [],
    urgency: "High",
    createdAt: "December"
  };

  
  // const [filterType, setFilterType] = useState<string>('all');
  // const [sortBy, setSortBy] = useState<string>('votes');

  // const filteredProjects = projects?.filter(project => 
  //   filterType === 'all' || project.type === filterType
  // );

  // const sortedProjects = [...filteredProjects].sort((a, b) => {
  //   switch (sortBy) {
  //     case 'votes':
  //       return b.votes - a.votes;
  //     case 'recent':
  //       return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  //     case 'urgency':
  //       const urgencyOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
  //       return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
  //     default:
  //       return 0;
  //   }
  // });

  return (
    <styles.MainBox>
      <styles.GlobalStyle />
      
        <div className='header'>
          <div>
            <h1>City Projects</h1>
            <p>Your city. Your voice.</p>
          </div>
          <Button variant="contained" startIcon={<MapsUgcOutlinedIcon />} sx={{ backgroundColor: "black" }}>
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
              value={filterType}
              onChange={changeType}
            >
              <MenuItem value={"Environmental/sustainability"}>Environmental/Sustainability</MenuItem>
              <MenuItem value={"Traffic"}>Traffic</MenuItem>
              <MenuItem value={"Bike Lanes"}>Bike Lanes</MenuItem>
              <MenuItem value={"Roads"}>Roads</MenuItem>
              <MenuItem value={"Public Transport"}>Public Transport</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="filled" sx={{ minWidth: 250, verticalAlign: "middle", padding: "0 10px" }} size="small" >
            <InputLabel sx={{ padding: "0 10px" }} id="sort-label" shrink={true} >Sort By</InputLabel>
            <Select
              displayEmpty
              labelId="sort-label"
              value={sortBy}
              onChange={changeSort}
            >
              <MenuItem value={""}>Most Votes</MenuItem>
              <MenuItem value={"recent"}>Most Recent</MenuItem>
              <MenuItem value={"urgency"}>Highest Urgency</MenuItem>
            </Select>
          </FormControl>
        </div>
        
        {/* <ProjectModule project={testObj} />
        <ProjectModule project={testObj} />
        <ProjectModule project={testObj} />
        <ProjectModule project={testObj} /> */}
      
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
                // onClick={() => onProjectClick(project.id)}
                // onVote={(voteType) => handleVote(project.id, voteType)}
              />
            ))
          )}
        </>
      )}

    </styles.MainBox>
  );
}