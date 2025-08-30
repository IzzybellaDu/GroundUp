from flask import Flask, render_template, request, redirect, url_for
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

# Home page to list users and show form to add a new user
@app.route('/')
def index():
    users = get_users()
    return render_template('index.html',users=users)

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

if __name__ == '__main__':
    init_db()
    app.run(debug=True)