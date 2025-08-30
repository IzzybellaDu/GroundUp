import React, { useState } from 'react';
import { Project, PROJECT_TYPES } from './types';
import * as styles from './dashboardStyle.ts';
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
  const [type, setType] = React.useState('');
  const [sort, setSort] = React.useState('');
  
  const changeType = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };
  
  const changeSort = (event: SelectChangeEvent) => {
    setSort(event.target.value)
  }
  
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('votes');

  const filteredProjects = projects?.filter(project => 
    filterType === 'all' || project.type === filterType
  );

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

  // const getUrgencyColor = (urgency: string) => {
  //   switch (urgency) {
  //     case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  //     case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  //     case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  //     default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  //   }
  // };

  // const getTypeColor = (type: string) => {
  //   switch (type) {
  //     case 'Environmental/sustainability': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  //     case 'Traffic': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  //     case 'Bike lanes': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  //     case 'Roads': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  //     case 'Public transport': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
  //     default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  //   }
  // };

  return (
    <styles.MainBox>
      <styles.GlobalStyle />
      
        <div className='header'>
          <div>
            <h1>City Projects</h1>
            <p>Your city. Your voice.</p>
          </div>
          <Button variant="contained" startIcon={<MapsUgcOutlinedIcon />} sx={{ backgroundColor: "black "}}>
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
              <MenuItem value={"env"}>Envrionmental/Sustainability</MenuItem>
              <MenuItem value={"traffic"}>Traffic</MenuItem>
              <MenuItem value={"bike"}>Bike Lanes</MenuItem>
              <MenuItem value={"road"}>Roads</MenuItem>
              <MenuItem value={"pt"}>Public Transport</MenuItem>
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
      
    </styles.MainBox>
  );
}