import React, { useState, useEffect } from 'react';
import * as styles from './dashboardStyle.ts';
import { Project, PROJECT_TYPES } from './types';
import { IconButton, ToggleButtonGroup, ToggleButton } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';

// allow project modules to be clicked on
interface ProjectModuleProps {
  project: Project;
}

export default function ProjectModule({ project }: ProjectModuleProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/project/${project.id}`);
  };  
  const [view, setView] = React.useState(project.userVote);
  const [voteCount, setVoteCount] = React.useState(project.votes);
  const [oldView, setOldView] = React.useState(0);
  
  const submitVote = async () => {
    const formDataObj = new FormData();
    console.log(view);
    formDataObj.append('project_id', project.id)
    formDataObj.append('votes', voteCount.toString());
    formDataObj.append('userVote', view as string);

    try {
        const response = await fetch('/api/voting', {
            method: 'POST',
            body: formDataObj 
        });
        const data = await response.json(); // Read the JSON response
        if (!response.ok) {
            alert(data.message || 'Failed to vote');
        }
    } catch (error) {
        console.error('Error voting', error);
        alert('Failed to vote');
    }
  };
  
  const upVote = (event: React.MouseEvent<HTMLElement>, newView: "up" | "down" | "null") => {
    
    if (view === "down" || view === "null") {
      setVoteCount(voteCount + 1);
      setView("up");
    } else if (view === "up") {
      setVoteCount(voteCount - 1);
      setView("null");
    }
    
    submitVote();
  };
  
  const downVote = (event: React.MouseEvent<HTMLElement>, newView: "up" | "down" | null) => {
    
    if (view === "up" || view === "null") {
      setVoteCount(voteCount - 1);
      setView("down");
    } else if (view === "down") {
      setVoteCount(voteCount + 1);
      setView("null");
    }
    
    submitVote();
  };
  
  const changeView = (event: React.MouseEvent<HTMLElement>, newView: "up" | "down" | null) => {
    
    if (newView === "up" && (view === "down" || view === null)) {
      setVoteCount(voteCount + 1);
      setOldView(1);
      setView(newView);
    } else if (newView === "down" && (view === "up" || view === null)) {
      setVoteCount(voteCount - 1);
      setOldView(-1);
      setView(newView);
      
    } else if (newView === "down" && view === "down") {
      setVoteCount(voteCount + 1);
      setOldView(0);
      setView("null");
    } else if (newView === "up" && view === "up") {
      setVoteCount(voteCount - 1);
      setOldView(0);
      setView("null");
    }
    
    submitVote();
  };
  
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
      case 'Medium': return { backgroundColor: "#484848ff", color: "#ffffffff" };
      case 'Low': return { backgroundColor: "#6b6b6bff", color: "#ffffffff" };
      default: return { backgroundColor: "black", color: "white" };
    }
  };
  
  const typeColor = getTypeColor(project.type);
  const urgencyColor = getUrgencyColor(project.urgency);
  const urgencyString = project.urgency + " Urgency";

  return (
    <styles.ProjectContainer onClick={handleClick}>
      <styles.GlobalStyle />
      <div className="tags">
        <styles.Tag backgroundColor={typeColor.backgroundColor} color={typeColor.color}>{project.type}</styles.Tag>
        <styles.Tag backgroundColor={urgencyColor.backgroundColor} color={urgencyColor.color}>{urgencyString}</styles.Tag>
        
        <div className="voting">
          <ToggleButtonGroup orientation="vertical" value={view} exclusive>
            <ToggleButton onClick={upVote} sx={{ "&.Mui-selected": {backgroundColor: "#005b94ff", color: "white", "&:hover": {backgroundColor: "#005b94ff", color: "white", opacity: 0.9}}, height: "20px" }} size="small" value="up">
              <ArrowDropUpIcon sx={{ fontSize: "35px", marginBottom: "-10px"}}></ArrowDropUpIcon>
            </ToggleButton>
            <div className="votes">{voteCount}</div>
            <ToggleButton onClick={downVote} sx={{ "&.Mui-selected": {backgroundColor: "#005b94ff", color: "white", "&:hover": {backgroundColor: "#005b94ff", color: "white", opacity: 0.9}}, height: "20px" }} size="small" value="down">
              <ArrowDropDownIcon sx={{ fontSize: "35px", marginTop: "-10px" }}></ArrowDropDownIcon>
            </ToggleButton>
            
          </ToggleButtonGroup>
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