import sqlite3
from werkzeug.security import check_password_hash, generate_password_hash

DB_path = "./database.db"

# Database setup
def init_users_table():
    conn =sqlite3.connect(DB_path)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

'''
Takes in username and password and returns a boolean of whether user exists
'''
def authenticate(username, password):
    init_users_table()

    conn = sqlite3.connect(DB_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()
    
    if user and check_password_hash(user[2], password):
        return True
    return False

'''
Takes in username and password and returns a tuple (boolean of successful acc creation, msg)
'''
def create_account(username, password):
    init_users_table()
    
    conn = sqlite3.connect(DB_path)
    cursor = conn.cursor()

    # checking if the username already exists
    rows = cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    rows = cursor.fetchall()

    if len(rows) != 0:
        return (False, "Username already taken")
    
    # adding user data to the table
    hashed_password = generate_password_hash(password)
    cursor.execute("INSERT INTO users (username, password) VALUES (?,?)", (username, hashed_password))
    conn.commit()
    conn.close()
    return (True, "")