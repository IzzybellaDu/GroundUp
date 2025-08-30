import sqlite3

DB_path = "./database.db"

def init_projects_table():
    conn = sqlite3.connect(DB_path)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS projects (p
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'active'
        )
    ''')
    conn.commit()
    conn.close()

def add_project(name, description, status='active'):
    init_projects_table()  # Creates table if it doesn't exist
    conn = sqlite3.connect(DB_path)
    cursor = conn.cursor()
    cursor.execute('INSERT INTO projects (name, description, status) VALUES (?, ?, ?)', 
                   (name, description, status))
    conn.commit()
    conn.close()

def get_projects():
    init_projects_table()
    conn = sqlite3.connect(DB_path)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM projects')
    projects = cursor.fetchall()
    conn.close()
    return projects
