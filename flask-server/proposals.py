import json
import sqlite3

DB_path = 'database.db'

def init_projects_table():
    """Initialize the projects table with all required fields"""
    conn = sqlite3.connect(DB_path)
    cursor = conn.cursor()
    # cursor.execute('DROP TABLE IF EXISTS projects')  # Uncomment to reset table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            type TEXT,
            votes INTEGER DEFAULT 0,
            urgency TEXT DEFAULT 'Medium',
            concerns_cost TEXT,
            concerns_devTime TEXT,
            concerns_environmentalImpact TEXT,
            concerns_safety TEXT,
            concerns_infrastructure TEXT,
            concerns_community TEXT,
            location TEXT,
            latitude DECIMAL,
            longitude DECIMAL,
            timeline INTEGER,
            contactEmail TEXT,
            government TEXT,
            status TEXT DEFAULT 'active',
            likes TEXT DEFAULT '[]',
            userVote TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def add_project(title, description, project_type=None, urgency='Medium', concerns=None, 
                location=None, latitude=None, longitude=None, timeline=None, 
                contact_email=None, government=None, status='active'):
    """Add a project with all the form fields"""
    init_projects_table()  # Creates table if it doesn't exist
    
    conn = sqlite3.connect(DB_path)
    cursor = conn.cursor()
    
    # Handle concerns object
    concerns_cost = ''
    concerns_devTime = ''
    concerns_environmentalImpact = ''
    concerns_safety = ''
    concerns_infrastructure = ''
    concerns_community = ''
    
    if concerns:
        if isinstance(concerns, str):
            try:
                concerns = json.loads(concerns)
            except json.JSONDecodeError:
                concerns = {}
        
        concerns_cost = concerns.get('cost', '')
        concerns_devTime = concerns.get('devTime', '')
        concerns_environmentalImpact = concerns.get('environmentalImpact', '')
        concerns_safety = concerns.get('safety', '')
        concerns_infrastructure = concerns.get('infrastructure', '')
        concerns_community = concerns.get('community', '')
    
    cursor.execute('''
        INSERT INTO projects (
            title, description, type, urgency, 
            concerns_cost, concerns_devTime, concerns_environmentalImpact, 
            concerns_safety, concerns_infrastructure, concerns_community,
            location, latitude, longitude, timeline, contactEmail, 
            government, status, votes, likes, userVote
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        title, description, project_type, urgency,
        concerns_cost, concerns_devTime, concerns_environmentalImpact,
        concerns_safety, concerns_infrastructure, concerns_community,
        location, latitude, longitude, timeline, contact_email,
        government, status, 0, '[]', None
    ))
    
    project_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return project_id

def get_projects():
    """Get all projects from database"""
    init_projects_table()
    conn = sqlite3.connect(DB_path)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM projects')
    columns = [description[0] for description in cursor.description]
    projects = cursor.fetchall()
    conn.close()
    
    # Convert to list of dictionaries
    projects_list = []
    for project in projects:
        project_dict = dict(zip(columns, project))
        
        # Parse JSON fields
        try:
            project_dict['likes'] = json.loads(project_dict.get('likes', '[]'))
        except:
            project_dict['likes'] = []
        
        # Reconstruct concerns object
        project_dict['concerns'] = {
            'cost': project_dict.get('concerns_cost', ''),
            'devTime': project_dict.get('concerns_devTime', ''),
            'environmentalImpact': project_dict.get('concerns_environmentalImpact', ''),
            'safety': project_dict.get('concerns_safety', ''),
            'infrastructure': project_dict.get('concerns_infrastructure', ''),
            'community': project_dict.get('concerns_community', '')
        }
        
        # Remove individual concern fields from response
        concern_fields = ['concerns_cost', 'concerns_devTime', 'concerns_environmentalImpact', 
                         'concerns_safety', 'concerns_infrastructure', 'concerns_community']
        for field in concern_fields:
            project_dict.pop(field, None)
        
        projects_list.append(project_dict)
    
    return projects_list
