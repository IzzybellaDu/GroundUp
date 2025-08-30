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
    name = request.form['name']
    description = request.form.get('description', '')
    status = request.form.get('status', 'active')
    add_project(name, description, status)
    return {'status': 'success', 'message': 'Project added successfully'}, 201

@app.route('/api/projects')
def projects():
    projects = get_projects()
    return render_template('projects.html', projects=projects)

if __name__ == '__main__':
    app.run(debug=True)