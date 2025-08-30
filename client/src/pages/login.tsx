import { Button, TextField, Container, Typography, Box } from '@mui/material';
import React, { useState } from 'react';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
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
        formDataObj.append('username', formData.username);
        formDataObj.append('password', formData.password);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                body: formDataObj 
            });
            const data = await response.json(); // Read the JSON response
            if (response.ok) {
                alert('Logged in!');
                setFormData({
                    username: '',
                    password: ''
                });
                window.location.href = '/'; 
            } else {
                console.error('Login failed:', response.statusText);
                alert(data.message || 'Failed to login');
            }
        } catch (error) {
            console.error('Error logging in', error);
            alert('Failed to login');
        }
    };

    // creates a POST request to the add_project function
    <form action="api/login" method="POST">
    <input type="text" name="username" placeholder="Username" required></input>
    <input type="password" name="password" placeholder="Password" required></input>
    <button type="submit">Login</button>
    </form>

    const handleReset = () => {
        setFormData({
            username: '',
            password: '',
        });
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            variant="outlined"
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            variant="outlined"
                        />

                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Login
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

export default LoginForm;