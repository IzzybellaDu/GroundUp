# Full-Stack Web Application with React and Flask

This project is a full-stack web application with a React frontend and a Flask backend.

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Python](https://www.python.org/downloads/)
*   [Node.js and npm](https://nodejs.org/en/download/)

## Getting Started

To get the application up and running, follow these steps:

### 1. Set up the Flask Backend

1.  Navigate to the `flask-server` directory:
    ```bash
    cd flask-server
    ```
    
2. Install or activate a virtual environment
    ```bash
    python -m venv venv
    source venv/bin/activate    (Mac/Linux)
    .\venv\Scripts\activate     (Windows)
    ```

3.  Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```

4.  Run the Flask server:
    ```bash
    python server.py
    ```
    The backend server will start on `http://127.0.0.1:5000`.

### 2. Set up the React Frontend

1.  In a new terminal, navigate to the `client` directory:
    ```bash
    cd client
    ```

2.  Install the required npm packages. If you don't have npm install it:
    ```bash
    npm install
    ```

3.  Run the React application:
    ```bash
    npm start
    ```
    The frontend development server will start on `http://localhost:3000`, and it will automatically open in your default web browser.

The application should now be running, with the React frontend communicating with the Flask backend.
