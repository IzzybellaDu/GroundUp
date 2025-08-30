import { Button } from '@mui/material';
import React, { useState } from 'react';

const ProposalForm = () => {
    const [formData, setFormData] = useState({
        title: '',
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
        try {
            // Replace with your actual API endpoint
            const response = await fetch('/api/proposals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                alert('Proposal submitted successfully!');
                setFormData({
                    title: '',
                    description: '',
                    budget: '',
                    timeline: '',
                    contactEmail: ''
                });
            }
        } catch (error) {
            console.error('Error submitting proposal:', error);
            alert('Failed to submit proposal');
        }
    };

    return (
        <div className="proposal-container">
            <h2>Submit Your Proposal</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Proposal Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="budget">Budget:</label>
                    <input
                        type="number"
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="timeline">Timeline (in weeks):</label>
                    <input
                        type="number"
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="contactEmail">Contact Email:</label>
                    <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Button type="submit">Submit Proposal</Button>
                    <Button type="reset">Reset</Button>
                </div>
                
            </form>
        </div>
    );
};

export default ProposalForm;