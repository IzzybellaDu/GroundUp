import { Button, TextField, Container, Typography, Box, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import React, { useState } from 'react';
import LocationTextField from '../components/locationTextField.tsx';

const ProposalForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        latitude: '',
        longitude: '',
        budget: '',
        timeline: '',
        contactEmail: '',
        government: '',
        status: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataObj = new FormData();
        formDataObj.append('name', formData.name);
        formDataObj.append('description', formData.description);
        formDataObj.append('location', formData.location);
        formDataObj.append('lattitude', formData.latitude);
        formDataObj.append('longitude', formData.longitude);
        formDataObj.append('status', formData.status);
        // Optionally include additional fields if Flask is updated to handle them
        formDataObj.append('budget', formData.budget);
        formDataObj.append('timeline', formData.timeline);
        formDataObj.append('contactEmail', formData.contactEmail);
        formDataObj.append('government', formData.government);

        try {
            const response = await fetch('/api/proposals', {
                method: 'POST',
                body: formDataObj // No headers needed; FormData sets Content-Type to multipart/form-data
            });
            if (response.ok) {
                alert('Proposal submitted successfully!');
                setFormData({
                    name: '',
                    description: '',
                    location: '',
                    latitude: '',
                    longitude: '',
                    budget: '',
                    timeline: '',
                    contactEmail: '',
                    government: '',
                    status: ''
                });
                window.location.href = '/'; // Redirect to index, matching Flask's redirect
            } else {
                console.error('Submission failed:', response.statusText);
                alert('Failed to submit proposal');
            }
        } catch (error) {
            console.error('Error submitting proposal:', error);
            alert('Failed to submit proposal');
        }
    };

    // // creates a POST request to the add_project function
    // <form action="api/proposals" method="POST">
    // <input type="text" name="name" placeholder="Project Name" required></input>
    // <textarea name="description" placeholder="Description"></textarea>
    // <select name="status">
    //     <option value="active">Active</option>
    //     <option value="completed">Completed</option>
    // </select>
    // <button type="submit">Add Project</button>
    // </form>

    const handleReset = () => {
        setFormData({
            name: '',
            description: '',
            location: '',
            latitude: '',
            longitude: '',
            budget: '',
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
                            label="Project Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            variant="outlined"
                        />

                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            multiline
                            rows={4}
                            variant="outlined"
                        />

                        <LocationTextField
                            formData={formData}
                            handleChange={handleChange}
                            >
                        </LocationTextField>             

                        <TextField
                            fullWidth
                            label="Budget"
                            name="budget"
                            type="number"
                            value={formData.budget}
                            onChange={handleChange}
                            required
                            variant="outlined"
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

                        <TextField
                            fullWidth
                            label="Contact Email"
                            name="contactEmail"
                            type="email"
                            value={formData.contactEmail}
                            onChange={handleChange}
                            required
                            variant="outlined"
                        />

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

                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Submit Proposal
                            </Button>
                            <Button variant="outlined" type="button" onClick={handleReset}>
                                Reset
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
    
};

export default ProposalForm;