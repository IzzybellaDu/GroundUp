import React, { useState } from 'react';
import * as styles from './dashboardStyle.ts';
import { Project, PROJECT_TYPES } from './types';
import { Button, InputLabel, MenuItem, FormControl, Select, SelectChangeEvent } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function ProjectModule({ project }: { project: Project }) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Environmental/sustainability': return { backgroundColor: "lightgreen", color: "darkgreen" };
      default: return { backgroundColor: "white", color: "black" };
    }
  };
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return { backgroundColor: "black", color: "white" };
      default: return { backgroundColor: "black", color: "white" };
    }
  };
  
  const typeColor = getTypeColor(project.type);
  const urgencyColor = getUrgencyColor(project.urgency);

  return (
    <styles.ProjectContainer>
      <styles.GlobalStyle />
      <div className="tags">
        <styles.Tag backgroundColor={typeColor.backgroundColor} color={typeColor.color}>{project.type}</styles.Tag>
        <styles.Tag backgroundColor={urgencyColor.backgroundColor} color={urgencyColor.color}>{project.urgency}</styles.Tag>
      </div>
      
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      
    </styles.ProjectContainer>
  );
}