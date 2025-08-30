from flask import Flask, render_template, request, redirect, url_for, jsonify
from proposals import *
import sqlite3

app =  Flask(__name__)

DB_path = "./database.db"

# Database setup
def init_db():
    conn =sqlite3.connect(DB_path)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Get all users from the databse
def get_users():
    conn=sqlite3.connect(DB_path)
    cursor=conn.cursor()
    cursor.execute('SELECT * FROM users')
    users = cursor.fetchall()
    conn.close()
    return users

# Add a user to the database
def add_user(name, age):
    conn=sqlite3.connect(DB_path)
    cursor=conn.cursor()
    cursor.execute('INSERT INTO users (name, age) VALUES (?, ?)',(name, age))
    conn.commit()
    conn.close()

# Update user's details
def update_user(id, name, age):
    conn=sqlite3.connect(DB_path)
    cursor=conn.cursor()
    cursor.execute('UPDATE users SET name = ?, age = ? WHERE id = ?',(name, age, id))
    conn.commit()
    conn.close()

# Delete a user by ID
def delete_user(id):
    conn=sqlite3.connect(DB_path)
    cursor=conn.cursor()
    cursor.execute('DELETE FROM users WHERE id = ?', (id,))
    conn.commit()
    conn.close()

# # Home page to list users and show form to add a new user
@app.route('/')
def index():
    return render_template('/index.tsx')

# Add user via POST request
@app.route('/add_user', methods=['POST'])
def add_user_route():
    name = request.form['name']
    age = request.form['age']
    add_user(name, age)
    return redirect(url_for('index'))

# Update user via POST request
@app.route('/update_user/<int:id>', methods=['GET', 'POST'])
def update_user_route(id):
    if request.method == 'POST':
        name = request.form['name']
        age = request.form['age']
        update_user(id, name, age)
        return redirect(url_for('index'))

    # Pre-fill form with current user data
    conn = sqlite3.connect(DB_path)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE id = ?',(id,))
    user = cursor.fetchone()
    conn.close()
    return render_template('update_user.html', user=user)

# Delete user via GET request
@app.route('/delete_user/<int:id>',methods=['GET'])
def delete_user_route(id):
    delete_user(id)
    return redirect(url_for('index'))

# Functions below are to add projects

@app.route('/api/proposals', methods=['POST'])
def add_project_route():
    try:
        # Get form data
        name = request.form.get('name')
        description = request.form.get('description', '')
        budget = request.form.get('budget')
        timeline = request.form.get('timeline')
        contact_email = request.form.get('contactEmail')
        status = request.form.get('status', 'active')
        government = request.form.get('government')
        location = request.form.get('location')
        lattitude = request.form.get('lattitude')
        longitude = request.form.get('longitude')

        print(name, description, budget, timeline, contact_email, status ,government)
        print(f'Location summary data {location} at {lattitude} and {longitude}')
        
        # Validate required fields
        if not name:
            return {'status': 'error', 'message': 'Project name is required'}, 400
        
        # Convert numeric fields
        try:
            budget = float(budget) if budget else None
        except (ValueError, TypeError):
            budget = None
            
        try:
            timeline = int(timeline) if timeline else None
        except (ValueError, TypeError):
            timeline = None
        
        # Add project to database
        project_id = add_project(
            name=name,
            description=description,
            government=government,
            budget=budget,
            timeline=timeline,
            contact_email=contact_email,
            status=status,
            lattitude=lattitude,
            longitude=longitude,
            votes=0
        )
        
        return {
            'status': 'success', 
            'message': 'Project added successfully',
            'project_id': project_id
        }, 201
        
    except Exception as e:
        return {'status': 'error', 'message': f'Server error: {str(e)}'}, 500

@app.route('/api/proposals', methods=['GET'])
def get_projects_route():
    """Get all projects"""
    try:
        projects = get_projects()
        return {'status': 'success', 'projects': projects}, 200
    except Exception as e:
        return {'status': 'error', 'message': f'Server error: {str(e)}'}, 500


if __name__ == '__main__':
    app.run(debug=True)