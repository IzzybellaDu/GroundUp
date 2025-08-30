from flask import Flask, render_template, request, redirect, url_for, jsonify
from proposals import *
from accounts import *
import sqlite3

app =  Flask(__name__)

@app.route('/')
def index():
    return render_template('/index.tsx')

@app.route('/api/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    result = authenticate(username, password)
    if result:
        return {'status': 'success', 'message': 'Login successful'}, 200
    else:
        return {'status': 'fail', 'message': 'Incorrect username or password'}, 401  # Unauthorized
    
@app.route('/api/register', methods=['POST'])
def register():
    username = request.form['username']
    password = request.form['password']
    confirm_password = request.form['confirm_password']
    print(username, password, confirm_password)
    if confirm_password != password:
        return {'status': 'fail', 'message': 'Passwords do not match'}, 401 
    
    result, msg = create_account(username, password)
    if result:
        return {'status': 'success', 'message': 'Registration successful'}, 200
    else:
        return {'status': 'fail', 'message': msg}, 401


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
            longitude=longitude
        )

        print('hi')
        
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