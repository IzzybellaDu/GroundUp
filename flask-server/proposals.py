import sqlite3

DB_path = "./database.db"

def init_projects_table():
    conn = sqlite3.connect(DB_path)
    cursor = conn.cursor()
    # cursor.execute('DROP TABLE IF EXISTS projects') # Uncomment to test!
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            budget REAL,
            timeline INTEGER,
            contact_email TEXT,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            government 
        )
    ''')
    conn.commit()
    conn.close()

def add_project(name, description, budget=None, timeline=None, contact_email=None, status='active'):
    """Add a project with all the form fields"""
    init_projects_table()  # Creates table if it doesn't exist
    conn = sqlite3.connect(DB_path)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO projects (name, description, budget, timeline, contact_email, status) 
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (name, description, budget, timeline, contact_email, status))
    
    project_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return project_id

def get_projects():
    init_projects_table()
    conn = sqlite3.connect(DB_path)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM projects')
    projects = cursor.fetchall()
    conn.close()
    return projects
