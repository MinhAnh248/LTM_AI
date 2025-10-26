from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from functools import wraps
import sqlite3
from datetime import datetime

app = Flask(__name__,
            template_folder='frontend/templates',
            static_folder='frontend/static')
CORS(app)

DB_PATH = '../expense_ai/data/expense_data.db'

def require_lan_access(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        return f(*args, **kwargs)  # Tạm thời bỏ check IP
    return decorated

@app.route('/')
def admin_dashboard():
    return render_template('admin_dashboard.html')

@app.route('/admin/users', methods=['GET'])
def get_all_users():
    return jsonify({'users': 'test data'})

@app.route('/admin/stats', methods=['GET'])
def get_system_stats():
    return jsonify({'stats': 'test stats'})

if __name__ == '__main__':
    print("🔒 Starting Admin Server")
    print("📍 Access: http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)