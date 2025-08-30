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
            government TEXT,                   
            budget REAL,
            timeline INTEGER,
            contact_email TEXT,
            status TEXT,
            lattitude DECIMAL,
            longitude DECIMAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def add_project(name, description, government, budget=None, timeline=None, contact_email=None, status='active', lattitude=None, longitude=None):
    """Add a project with all the form fields"""
    init_projects_table()  # Creates table if it doesn't exist
    conn = sqlite3.connect(DB_path)
    cursor = conn.cursor()

    print(f"DEBUG - About to insert:")
    print(f"name: {name}, description: {description}, government: {government}")
    print(f"budget: {budget}, timeline: {timeline}, contact_email: {contact_email}, status: {status}")
    
    cursor.execute('''
        INSERT INTO projects (name, description, government, budget, timeline, contact_email, status, lattitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (name, description, government, budget, timeline, contact_email, status, lattitude, longitude))
    
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
