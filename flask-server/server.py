import json
from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from proposals import add_project, get_projects, vote_now, DB_path
from accounts import authenticate_and_get_user, create_account
from functools import wraps
import sqlite3

app =  Flask(__name__)
app.secret_key = 'secret-key'

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return {'status': 'fail', 'message': 'Authentication required'}, 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    return render_template('/index.tsx')

@app.route('/api/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    
    user = authenticate_and_get_user(username, password)
    if user:
        session['user_id'] = user[0]  
        session['username'] = user[1]  
        return {'status': 'success', 'message': 'Login successful'}, 200
    else:
        return {'status': 'fail', 'message': 'Incorrect username or password'}, 401
    
@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return {'status': 'success', 'message': 'Logged out successfully'}, 200

@app.route('/api/auth-status', methods=['GET'])
def auth_status():
    if 'user_id' in session:
        return {
            'status': 'success', 
            'authenticated': True,
            'username': session.get('username')
        }, 200
    else:
        return {'status': 'success', 'authenticated': False}, 200
    
@app.route('/api/register', methods=['POST'])
def register():
    username = request.form['username']
    password = request.form['password']
    confirm_password = request.form['confirm_password']

    if confirm_password != password:
        return {'status': 'fail', 'message': 'Passwords do not match'}, 401 
    
    result, msg = create_account(username, password)
    if result:
        return {'status': 'success', 'message': 'Registration successful'}, 200
    else:
        return {'status': 'fail', 'message': msg}, 401
    
@app.route('/api/voting', methods=['GET', 'POST'])
@login_required
def change_votes():
    try:
        project_id = request.form['project_id']
        votes = request.form['votes']
        userVote = request.form['userVote']
        
        vote_now(project_id, votes, userVote)
        
        return jsonify({
            'status': 'success',
            'message': 'Project updated successfully',
            'project_id': project_id
        }), 201
    except Exception as e:
        print(f'Error voting for project: {str(e)}')
        return jsonify({'status': 'error', 'message': f'Server error: {str(e)}'}), 500

@app.route('/api/proposals', methods=['POST'])
@login_required
def add_project_route():
    """Handle project proposal submission"""
    try:
        # Get form data - using correct field names from frontend
        title = request.form.get('title')
        description = request.form.get('description', '')
        project_type = request.form.get('type')
        urgency = request.form.get('urgency', 'Medium')
        concerns = request.form.get('concerns')  # JSON string
        location = request.form.get('location')
        latitude = request.form.get('latitude')
        longitude = request.form.get('longitude')
        timeline = request.form.get('timeline')
        contact_email = ''
        government = request.form.get('government')
        status = request.form.get('status', 'active')
        
        # Validate required fields
        if not title:
            return jsonify({'status': 'error', 'message': 'Project title is required'}), 400
        
        if not description:
            return jsonify({'status': 'error', 'message': 'Project description is required'}), 400
        
        # Convert numeric fields
        try:
            timeline = int(timeline) if timeline else None
        except (ValueError, TypeError):
            timeline = None
            
        # Convert latitude/longitude
        try:
            latitude = float(latitude) if latitude else None
        except (ValueError, TypeError):
            latitude = None
            
        try:
            longitude = float(longitude) if longitude else None
        except (ValueError, TypeError):
            longitude = None
        
        # Add project to database
        project_id = add_project(
            title=title,
            description=description,
            project_type=project_type,
            urgency=urgency,
            concerns=concerns,
            location=location,
            latitude=latitude,
            longitude=longitude,
            timeline=timeline,
            contact_email=contact_email,
            government=government,
            status=status
        )
        
        print(f'Project added successfully with ID: {project_id}')
        
        return jsonify({
            'status': 'success',
            'message': 'Project added successfully',
            'project_id': project_id
        }), 201
        
    except Exception as e:
        print(f'Error adding project: {str(e)}')
        return jsonify({'status': 'error', 'message': f'Server error: {str(e)}'}), 500

@app.route('/api/proposals', methods=['GET'])
def get_projects_route():
    """Get all projects"""
    try:
        projects = get_projects()
        return jsonify({'status': 'success', 'projects': projects}), 200
    except Exception as e:
        print(f'Error getting projects: {str(e)}')
        return jsonify({'status': 'error', 'message': f'Server error: {str(e)}'}), 500

# Additional route to get a single project by ID
@app.route('/api/proposals/<int:project_id>', methods=['GET'])
def get_project_route(project_id):
    """Get a single project by ID"""
    try:
        conn = sqlite3.connect(DB_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM projects WHERE id = ?', (project_id,))
        columns = [description[0] for description in cursor.description]
        project = cursor.fetchone()
        conn.close()
        
        if not project:
            return jsonify({'status': 'error', 'message': 'Project not found'}), 404
        
        project_dict = dict(zip(columns, project))
        
        # Parse JSON fields and reconstruct concerns
        try:
            project_dict['likes'] = json.loads(project_dict.get('likes', '[]'))
        except:
            project_dict['likes'] = []
        
        project_dict['concerns'] = {
            'cost': project_dict.get('concerns_cost', ''),
            'devTime': project_dict.get('concerns_devTime', ''),
            'environmentalImpact': project_dict.get('concerns_environmentalImpact', ''),
            'safety': project_dict.get('concerns_safety', ''),
            'infrastructure': project_dict.get('concerns_infrastructure', ''),
            'community': project_dict.get('concerns_community', '')
        }
        
        # Remove individual concern fields
        concern_fields = ['concerns_cost', 'concerns_devTime', 'concerns_environmentalImpact', 
                         'concerns_safety', 'concerns_infrastructure', 'concerns_community']
        for field in concern_fields:
            project_dict.pop(field, None)
        
        return jsonify({'status': 'success', 'project': project_dict}), 200
        
    except Exception as e:
        print(f'Error getting project: {str(e)}')
        return jsonify({'status': 'error', 'message': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)