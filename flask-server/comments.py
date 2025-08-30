import json
import sqlite3

DB_path = 'database.db'

def init_comments_table():
    conn = sqlite3.connect(DB_path)
    cursor = conn.cursor()
    # cursor.execute('DROP TABLE IF EXISTS comments')  # Uncomment to reset table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def add_comment_to_db(project_id, name, description):
    init_comments_table()  # Creates table if it doesn't exist
    
    conn = sqlite3.connect(DB_path)
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO comments (project_id, name, description) VALUES (?, ?, ?)
    ''', (project_id, name, description))
    
    conn.commit()
    conn.close()
    return

def get_comments_from_db(project_id):
    init_comments_table()
    conn = sqlite3.connect(DB_path)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM comments WHERE project_id = ?', (project_id,))
    comments = cursor.fetchall()
    conn.close()
    
    return comments
