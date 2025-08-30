import React, { useState } from 'react';
import * as styles from './dashboardStyle.ts';
import { Project, PROJECT_TYPES } from './types';
import { IconButton } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function ProjectModule({ project }: { project: Project }) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Environmental/sustainability': return { backgroundColor: "#ccffcc", color: "#336600" };
      case 'Traffic': return { backgroundColor: "#ffcccc", color: "#cc0000" };
      case 'Bike lanes': return { backgroundColor: "#99ccff", color: "#003399" }; 
      case 'Roads': return { backgroundColor: "#e7e7c4ff", color: "#ab6c0eff" };
      case 'Public transport': return { backgroundColor: "#d5b1ddff", color: "#3b0c71ff" }; 
      default: return { backgroundColor: "white", color: "black" };
    }
  };
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return { backgroundColor: "#000000ff", color: "#ffffffff" };
      case 'Medium': return { backgroundColor: "#393939ff", color: "#ffffffff" };
      case 'Low': return { backgroundColor: "#6b6b6bff", color: "#ffffffff" };
      default: return { backgroundColor: "black", color: "white" };
    }
  };
  
  const typeColor = getTypeColor(project.type);
  const urgencyColor = getUrgencyColor(project.urgency);
  const urgencyString = project.urgency + " Urgency";

  return (
    <styles.ProjectContainer>
      <styles.GlobalStyle />
      <div className="tags">
        <styles.Tag backgroundColor={typeColor.backgroundColor} color={typeColor.color}>{project.type}</styles.Tag>
        <styles.Tag backgroundColor={urgencyColor.backgroundColor} color={urgencyColor.color}>{urgencyString}</styles.Tag>
        
        <div className="voting">
          <IconButton size="small">
            <ArrowDropUpIcon sx={{ fontSize: "35px", marginBottom: "-10px"}}></ArrowDropUpIcon>
          </IconButton>
          <div className="votes">{project.votes}</div>
          <IconButton size="small">
            <ArrowDropDownIcon sx={{ fontSize: "35px", marginTop: "-10px" }}></ArrowDropDownIcon>
          </IconButton>
        </div>
      </div>
      
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      
      <div className="details">
        <div className="detail"><b>Cost: </b>{project.concerns.cost}</div>
        <div className="detail"><b>Timeline: </b>{project.concerns.devTime}</div>
      </div>

    </styles.ProjectContainer>
  );
}