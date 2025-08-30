import React, { useState } from 'react';
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

export default function Dashboard({ projects, onProjectClick, onVote, onCreateClick }: DashboardProps) {
  const [type, setType] = React.useState(''); // Default is All
  const [sort, setSort] = React.useState(''); // Default is sort by votes
  
  const changeType = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };
  
  const changeSort = (event: SelectChangeEvent) => {
    setSort(event.target.value)
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
        
        {sortedProjects.map((item) => (
          <ProjectModule project={item}></ProjectModule>
        ))}
      
    </styles.MainBox>
  );
}