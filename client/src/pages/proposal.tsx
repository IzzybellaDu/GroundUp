import { Button, TextField, Container, Typography, Box, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import React, { useEffect, useState } from 'react';
import LocationTextField from '../components/locationTextField.tsx';
import {useNavigate} from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';

// Import the types
interface Project {
    id: string;
    title: string;
    description: string;
    type: 'Environmental/sustainability' | 'Traffic' | 'Bike lanes' | 'Roads' | 'Public transport';
    votes: number;
    userVote: 'up' | 'down' | null;
    concerns: {
        cost: string;
        devTime: string;
        environmentalImpact: string;
        safety: string;
        infrastructure: string;
        community: string;
    };
    likes: string[];
    urgency: 'Low' | 'Medium' | 'High';
    createdAt: string;
}

const PROJECT_TYPES = [
    'Environmental/sustainability',
    'Traffic',
    'Bike lanes',
    'Roads',
    'Public transport'
] as const;

const URGENCY_LEVELS = ['Low', 'Medium', 'High'] as const;

// Form data interface that includes both Project fields and additional form-specific fields
interface ProposalFormData {
    title: string;
    description: string;
    type: Project['type'];
    concerns: {
        cost: string;
        devTime: string;
        environmentalImpact: string;
        safety: string;
        infrastructure: string;
        community: string;
    };
    urgency: Project['urgency'];
    // Additional fields for the form/API
    location: string;
    latitude: string;
    longitude: string;
    timeline: string;
    contactEmail: string;
    government: string;
    status: string;
}

const ProposalForm = () => {
    const navigate = useNavigate();

    function navHome() {
        navigate("/");
    }
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth-status');
                const data = await response.json();
                
                if (!data.authenticated) {
                    alert('You must be logged in to create proposals');
                    navigate('/login'); // Redirect to login
                    return;
                }
            } catch (error) {
                console.error('Auth check error:', error);
                alert('Please log in to continue');
                navigate('/login');
            }
        };
        
        checkAuth();
    }, [navigate]);

    const [formData, setFormData] = useState<ProposalFormData>({
        title: '',
        description: '',
        type: 'Environmental/sustainability',
        concerns: {
            cost: '',
            devTime: '',
            environmentalImpact: '',
            safety: '',
            infrastructure: '',
            community: ''
        },
        urgency: 'Medium',
        location: '',
        latitude: '',
        longitude: '',
        timeline: '',
        contactEmail: '',
        government: '',
        status: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
        const { name, value } = e.target;
        
        // Handle nested concerns object
        if (name.startsWith('concerns.')) {
            const concernField = name.split('.')[1];
            setFormData(prevState => ({
                ...prevState,
                concerns: {
                    ...prevState.concerns,
                    [concernField]: value
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formDataObj = new FormData();
        
        // Add basic fields
        formDataObj.append('title', formData.title);
        formDataObj.append('description', formData.description);
        formDataObj.append('type', formData.type);
        formDataObj.append('urgency', formData.urgency);
        formDataObj.append('location', formData.location);
        formDataObj.append('latitude', formData.latitude);
        formDataObj.append('longitude', formData.longitude);
        formDataObj.append('status', formData.status);
        formDataObj.append('timeline', formData.timeline);
        formDataObj.append('contactEmail', formData.contactEmail);
        formDataObj.append('government', formData.government);
        
        // Add concerns as JSON string or individual fields
        formDataObj.append('concerns', JSON.stringify(formData.concerns));
        
        try {
            const response = await fetch('/api/proposals', {
                method: 'POST',
                body: formDataObj
            });

            if (response.status === 401) {
                alert('You must be logged in to submit proposals');
                // Redirect to login page or show login form
                return;
            }

            if (response.ok) {
                alert('Proposal submitted successfully!');
                handleReset();
                window.location.href = '/';
            } else {
                console.error('Submission failed:', response.statusText);
                alert('Failed to submit proposal');
            }
        } catch (error) {
            console.error('Error submitting proposal:', error);
            alert('Failed to submit proposal');
        }
    };

    const handleReset = () => {
        setFormData({
            title: '',
            description: '',
            type: 'Environmental/sustainability',
            concerns: {
                cost: '',
                devTime: '',
                environmentalImpact: '',
                safety: '',
                infrastructure: '',
                community: ''
            },
            urgency: 'Medium',
            location: '',
            latitude: '',
            longitude: '',
            timeline: '',
            contactEmail: '',
            government: '',
            status: ''
        });
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Submit Your Proposal
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Project Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            variant="outlined"
                        />
                        <FormControl fullWidth>
                            <InputLabel id="type-select-label">Project Type</InputLabel>
                            <Select
                                labelId="type-select-label"
                                id="type-select"
                                name="type"
                                value={formData.type}
                                label="Project Type"
                                onChange={handleChange}
                                required
                            >
                                {PROJECT_TYPES.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="urgency-select-label">Urgency Level</InputLabel>
                            <Select
                                labelId="urgency-select-label"
                                id="urgency-select"
                                name="urgency"
                                value={formData.urgency}
                                label="Urgency Level"
                                onChange={handleChange}
                                required
                            >
                                {URGENCY_LEVELS.map((level) => (
                                    <MenuItem key={level} value={level}>
                                        {level}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <LocationTextField
                            formData={formData}
                            handleChange={handleChange}
                        />

                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                            Project Concerns
                        </Typography>

                        <TextField
                            fullWidth
                            label="Cost Concerns"
                            name="concerns.cost"
                            value={formData.concerns.cost}
                            onChange={handleChange}
                            multiline
                            rows={2}
                            variant="outlined"
                            placeholder="Describe any cost-related concerns..."
                        />

                        <TextField
                            fullWidth
                            label="Development Time Concerns"
                            name="concerns.devTime"
                            value={formData.concerns.devTime}
                            onChange={handleChange}
                            multiline
                            rows={2}
                            variant="outlined"
                            placeholder="Describe any timeline-related concerns..."
                        />

                        <TextField
                            fullWidth
                            label="Environmental Impact"
                            name="concerns.environmentalImpact"
                            value={formData.concerns.environmentalImpact}
                            onChange={handleChange}
                            multiline
                            rows={2}
                            variant="outlined"
                            placeholder="Describe environmental considerations..."
                        />

                        <TextField
                            fullWidth
                            label="Safety Considerations"
                            name="concerns.safety"
                            value={formData.concerns.safety}
                            onChange={handleChange}
                            multiline
                            rows={2}
                            variant="outlined"
                            placeholder="Describe safety-related aspects..."
                        />

                        <TextField
                            fullWidth
                            label="Infrastructure Requirements"
                            name="concerns.infrastructure"
                            value={formData.concerns.infrastructure}
                            onChange={handleChange}
                            multiline
                            rows={2}
                            variant="outlined"
                            placeholder="Describe infrastructure needs..."
                        />

                        <TextField
                            fullWidth
                            label="Community Impact"
                            name="concerns.community"
                            value={formData.concerns.community}
                            onChange={handleChange}
                            multiline
                            rows={2}
                            variant="outlined"
                            placeholder="Describe community-related considerations..."
                        />

                        <TextField
                            fullWidth
                            label="Timeline (in weeks)"
                            name="timeline"
                            type="number"
                            value={formData.timeline}
                            onChange={handleChange}
                            required
                            variant="outlined"
                        />

                        {/* <TextField
                            fullWidth
                            label="Contact Email"
                            name="contactEmail"
                            type="email"
                            value={formData.contactEmail}
                            onChange={handleChange}
                            required
                            variant="outlined"
                        /> */}

                        <FormControl fullWidth>
                            <InputLabel id="status-select-label">Project Status</InputLabel>
                            <Select
                                labelId="status-select-label"
                                id="status-select"
                                name="status"
                                value={formData.status}
                                label="Project Status"
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="on-hold">On Hold</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="government-select-label">Government Status</InputLabel>
                            <Select
                                labelId="government-select-label"
                                id="government-select"
                                name="government"
                                value={formData.government}
                                label="Government Status"
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="government">Government project</MenuItem>
                                <MenuItem value="community">Community suggestion</MenuItem>
                            </Select>
                        </FormControl>

                        <Box sx={{display: 'inline-flex', justifyContent: 'space-between'}}>
                            <Button variant="outlined" type="button" onClick={handleReset}>
                                Reset
                            </Button>
                            <Button variant="contained" type="submit">
                                Submit Proposal
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<HomeIcon />}
                                onClick={() => navHome()}
                            >
                                Home
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default ProposalForm;