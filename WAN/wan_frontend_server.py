from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
import os
import subprocess
import time

app = Flask(__name__)
CORS(app)

# Serve React frontend từ expense_ai
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    frontend_dir = '../expense_ai/frontend/build'

    if path == "" or not os.path.exists(os.path.join(frontend_dir, path)):
        return send_from_directory(frontend_dir, 'index.html')

    return send_from_directory(frontend_dir, path)

# WAN API endpoints với rate limiting
@app.route('/api/auth/login', methods=['POST'])
def wan_login():
    return jsonify({
        'success': True,
        'token': 'wan-user-token',
        'user': {'id': 1, 'email': 'wan@user.com', 'type': 'WAN'}
    })

@app.route('/api/expenses', methods=['GET'])
def wan_get_expenses():
    return jsonify([
        {'id': 1, 'amount': 50000, 'category': 'an uong', 'description': 'WAN User Expense', 'date': '2024-01-15'},
        {'id': 2, 'amount': 30000, 'category': 'di lai', 'description': 'Transport', 'date': '2024-01-14'}
    ])

@app.route('/api/expenses', methods=['POST'])
def wan_add_expense():
    return jsonify({
        'success': True,
        'message': 'Expense added (WAN limited features)',
        'note': 'WAN users have limited functionality'
    })

@app.route('/api/summary', methods=['GET'])
def wan_summary():
    return jsonify({
        'total': 80000,
        'count': 2,
        'average': 40000,
        'note': 'WAN user summary - limited data'
    })

if __name__ == '__main__':
    print("🌐 Starting WAN Server with Expense AI Frontend")
    print("📍 Access: http://localhost:7000")
    print("🎨 Using React frontend from expense_ai")
    app.run(host='0.0.0.0', port=7000, debug=True)