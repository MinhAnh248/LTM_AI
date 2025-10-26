from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from functools import wraps
import sqlite3
import time
import hashlib
import jwt
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# WAN Configuration
app.config['SECRET_KEY'] = 'wan-secret-key-2024'
DB_PATH = '../expense_ai/data/expense_data.db'

# User sessions and rate limiting
user_sessions = {}
request_counts = {}
registered_users = {}

def rate_limit(max_requests=20, window=60):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            client_ip = request.remote_addr
            current_time = time.time()

            if client_ip not in request_counts:
                request_counts[client_ip] = []

            # Clean old requests
            request_counts[client_ip] = [
                req_time for req_time in request_counts[client_ip]
                if current_time - req_time < window
            ]

            if len(request_counts[client_ip]) >= max_requests:
                return jsonify({'error': 'Rate limit exceeded', 'retry_after': window}), 429

            request_counts[client_ip].append(current_time)
            return f(*args, **kwargs)
        return decorated
    return decorator

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Authentication required'}), 401

        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            request.user_id = data['user_id']
            return f(*args, **kwargs)
        except:
            return jsonify({'error': 'Invalid token'}), 401
    return decorated

@app.route('/')
def wan_dashboard():
    return render_template_string('''
    <!DOCTYPE html>
    <html>
    <head>
        <title>🌐 Expense AI - WAN Access</title>
        <style>
            body { font-family: Arial; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                   margin: 0; padding: 20px; min-height: 100vh; }
            .container { max-width: 800px; margin: 0 auto; background: white;
                        padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
            .feature-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
            .btn { background: #007bff; color: white; padding: 10px 20px; border: none;
                   border-radius: 5px; cursor: pointer; margin: 5px; }
            .btn:hover { background: #0056b3; }
            .auth-section { background: #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .status { padding: 10px; border-radius: 5px; margin: 10px 0; }
            .success { background: #d4edda; color: #155724; }
            .error { background: #f8d7da; color: #721c24; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌐 Expense AI - WAN Network</h1>
                <p>Public Access for All Users Worldwide</p>
            </div>

            <div class="auth-section">
                <h2>🔐 User Authentication</h2>
                <div>
                    <input type="email" id="email" placeholder="Email" style="padding: 8px; margin: 5px; width: 200px;">
                    <input type="password" id="password" placeholder="Password" style="padding: 8px; margin: 5px; width: 200px;">
                </div>
                <button class="btn" onclick="register()">Register</button>
                <button class="btn" onclick="login()">Login</button>
                <div id="auth-status"></div>
            </div>

            <div class="feature-grid">
                <div class="feature-card">
                    <h3>💰 My Expenses</h3>
                    <p>View your personal expenses</p>
                    <button class="btn" onclick="getMyExpenses()">View Expenses</button>
                </div>
                <div class="feature-card">
                    <h3>➕ Add Expense</h3>
                    <p>Add new expense record</p>
                    <button class="btn" onclick="showAddForm()">Add New</button>
                </div>
                <div class="feature-card">
                    <h3>📊 My Statistics</h3>
                    <p>Personal spending analysis</p>
                    <button class="btn" onclick="getMyStats()">View Stats</button>
                </div>
                <div class="feature-card">
                    <h3>🔒 Account</h3>
                    <p>Manage your account</p>
                    <button class="btn" onclick="getProfile()">My Profile</button>
                </div>
            </div>

            <div id="results" style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; white-space: pre-wrap; font-family: monospace;"></div>
        </div>

        <script>
            let authToken = localStorage.getItem('wan_token');

            function register() {
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                fetch('/api/register', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({email, password})
                })
                .then(r => r.json())
                .then(data => {
                    document.getElementById('auth-status').innerHTML =
                        `<div class="status ${data.success ? 'success' : 'error'}">${data.message}</div>`;
                    if(data.success) {
                        authToken = data.token;
                        localStorage.setItem('wan_token', authToken);
                    }
                });
            }

            function login() {
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                fetch('/api/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({email, password})
                })
                .then(r => r.json())
                .then(data => {
                    document.getElementById('auth-status').innerHTML =
                        `<div class="status ${data.success ? 'success' : 'error'}">${data.message}</div>`;
                    if(data.success) {
                        authToken = data.token;
                        localStorage.setItem('wan_token', authToken);
                    }
                });
            }

            function getMyExpenses() {
                if(!authToken) {
                    alert('Please login first');
                    return;
                }

                fetch('/api/my-expenses', {
                    headers: {'Authorization': 'Bearer ' + authToken}
                })
                .then(r => r.json())
                .then(data => {
                    document.getElementById('results').textContent = JSON.stringify(data, null, 2);
                });
            }

            function getMyStats() {
                if(!authToken) {
                    alert('Please login first');
                    return;
                }

                fetch('/api/my-stats', {
                    headers: {'Authorization': 'Bearer ' + authToken}
                })
                .then(r => r.json())
                .then(data => {
                    document.getElementById('results').textContent = JSON.stringify(data, null, 2);
                });
            }

            function getProfile() {
                if(!authToken) {
                    alert('Please login first');
                    return;
                }

                fetch('/api/profile', {
                    headers: {'Authorization': 'Bearer ' + authToken}
                })
                .then(r => r.json())
                .then(data => {
                    document.getElementById('results').textContent = JSON.stringify(data, null, 2);
                });
            }
        </script>
    </body>
    </html>
    ''')

@app.route('/api/register', methods=['POST'])
@rate_limit(max_requests=5, window=300)  # 5 registrations per 5 minutes
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password required'}), 400

    if email in registered_users:
        return jsonify({'success': False, 'message': 'User already exists'}), 400

    # Hash password
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    user_id = len(registered_users) + 1

    registered_users[email] = {
        'id': user_id,
        'email': email,
        'password_hash': password_hash,
        'created_at': datetime.now().isoformat()
    }

    # Generate token
    token = jwt.encode({
        'user_id': user_id,
        'email': email,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({
        'success': True,
        'message': 'Registration successful',
        'token': token,
        'user_id': user_id
    })

@app.route('/api/login', methods=['POST'])
@rate_limit(max_requests=10, window=300)  # 10 login attempts per 5 minutes
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if email not in registered_users:
        return jsonify({'success': False, 'message': 'User not found'}), 404

    user = registered_users[email]
    password_hash = hashlib.sha256(password.encode()).hexdigest()

    if user['password_hash'] != password_hash:
        return jsonify({'success': False, 'message': 'Invalid password'}), 401

    # Generate token
    token = jwt.encode({
        'user_id': user['id'],
        'email': email,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({
        'success': True,
        'message': 'Login successful',
        'token': token,
        'user_id': user['id']
    })

@app.route('/api/my-expenses', methods=['GET'])
@require_auth
@rate_limit(max_requests=30, window=60)
def get_my_expenses():
    # Return user-specific expenses (mock data for now)
    return jsonify({
        'success': True,
        'user_id': request.user_id,
        'expenses': [
            {'id': 1, 'amount': 25000, 'category': 'an uong', 'description': 'Lunch', 'date': '2024-01-15'},
            {'id': 2, 'amount': 15000, 'category': 'di lai', 'description': 'Bus fare', 'date': '2024-01-15'}
        ],
        'total': 40000,
        'note': 'WAN user personal data'
    })

@app.route('/api/my-stats', methods=['GET'])
@require_auth
@rate_limit(max_requests=20, window=60)
def get_my_stats():
    return jsonify({
        'success': True,
        'user_id': request.user_id,
        'stats': {
            'total_expenses': 2,
            'total_amount': 40000,
            'categories': {
                'an uong': 25000,
                'di lai': 15000
            },
            'this_month': 40000
        },
        'note': 'Personal statistics for WAN user'
    })

@app.route('/api/profile', methods=['GET'])
@require_auth
@rate_limit(max_requests=10, window=60)
def get_profile():
    user_email = None
    for email, user in registered_users.items():
        if user['id'] == request.user_id:
            user_email = email
            break

    return jsonify({
        'success': True,
        'profile': {
            'user_id': request.user_id,
            'email': user_email,
            'account_type': 'WAN User',
            'access_level': 'Limited',
            'features': ['View expenses', 'Add expenses', 'Basic stats']
        }
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'online',
        'service': 'WAN Server',
        'users_registered': len(registered_users),
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🌐 Starting WAN Server")
    print("📍 Public Access: http://localhost:7000")  # Đổi port
    print("🔒 Features: Authentication, Rate Limiting, User Isolation")
    app.run(host='0.0.0.0', port=7000, debug=True)