import { Button, TextField, Container, Typography, Box } from '@mui/material';
import React, { useState } from 'react';

const ProposalForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        budget: '',
        timeline: '',
        contactEmail: ''
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
        formDataObj.append('status', 'active'); // Add default status to match Flask
        // Optionally include additional fields if Flask is updated to handle them
        formDataObj.append('budget', formData.budget);
        formDataObj.append('timeline', formData.timeline);
        formDataObj.append('contactEmail', formData.contactEmail);

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
                    budget: '',
                    timeline: '',
                    contactEmail: ''
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

    // creates a POST request to the add_project function
    <form action="api/proposals" method="POST">
    <input type="text" name="name" placeholder="Project Name" required></input>
    <textarea name="description" placeholder="Description"></textarea>
    <select name="status">
        <option value="active">Active</option>
        <option value="completed">Completed</option>
    </select>
    <button type="submit">Add Project</button>
    </form>

    const handleReset = () => {
        setFormData({
            name: '',
            description: '',
            budget: '',
            timeline: '',
            contactEmail: ''
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