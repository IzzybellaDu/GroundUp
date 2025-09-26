# GroundUp – Community Proposal Platform  

GroundUp is a full-stack web application with a React frontend and a Flask backend, designed to give communities a voice in shaping the future of their cities. 

Try it for yourself [here](https://groundup-zi9f.onrender.com/) at the live demo link!

## Inspiration  

We believe that cities of the future are built by those who live and interact with them daily. Despite government projects impacting communities each year and issues with city infrastructure, there are currently very few ways to provide meaningful input.  

This inspired us to create **GroundUp**, a platform that allows residents to view, support, and propose projects that impact their neighborhoods. By making decision-making more transparent, communities can influence where taxpayer money is spent and ensure local priorities are heard.  

## What It Does  

- Browse current projects in various stages, from proposal to progress  
- Filter projects based on **location** and **category**  
- Upvote proposals to highlight initiatives that matter most to the community  
- Suggest new proposals to be reviewed by the appropriate community or government body  

## Tech Stack

*   **Frontend:** React, TypeScript, Material-UI
*   **Backend:** Flask, Python
*   **Database:** SQLite
*   **Deployment:** Render, Gunicorn

## Getting Started  

Follow these steps to run the application locally.

###  Prerequisites

Before you begin, ensure you have the following installed:

*   [Python](https://www.python.org/downloads/)
*   [Node.js and npm](https://nodejs.org/en/download/)  

### 1. Set up the Flask Backend

1.  From the project root, navigate to the `flask-server` directory:
    ```bash
    cd flask-server
    ```
    
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate    # Mac/Linux
    .\venv\Scripts\activate    # Windows
    ```

3.  Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```

4.  Create an environment file for the secret key:
    ```bash
    echo "SECRET_KEY='a-super-secret-key-for-development'" > .env
    ```

5.  Run the Flask server:
    ```bash
    python server.py
    ```
    The backend server will start on `http://127.0.0.1:5000`.

### 2. Set up the React Frontend

1.  In a **new terminal**, navigate to the `client` directory from the project root:
    ```bash
    cd client
    ```

2.  Install the required npm packages:
    ```bash
    npm install
    ```

3.  **IMPORTANT:** To allow the frontend to communicate with the backend in development, add a `proxy` key to your `client/package.json` file:
    ```json
    "proxy": "http://127.0.0.1:5000"
    ```

4.  Run the React application:
    ```bash
    npm start
    ```
    The frontend development server will start on `http://localhost:3000` and open in your browser.

The application should now be running, with the React frontend communicating with the Flask backend.

## Some screenshots
![Project Screenshot 1](https://drive.google.com/uc?export=view&id=1ervIXreePI3YrjGGJvXbrGwlnfbt3G3q)
![Project Screenshot 2](https://drive.google.com/uc?export=view&id=1GuO8S7IWq87hQo3UeIhxujYTAHFjlrnz)
