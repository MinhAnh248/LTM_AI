from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import time

app = Flask(__name__)
CORS(app)

# Rate limiting storage
request_counts = {}

def rate_limit(max_requests=10, window=60):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            client_ip = request.remote_addr
            current_time = time.time()

            # Clean old entries
            request_counts[client_ip] = [
                req_time for req_time in request_counts.get(client_ip, [])
                if current_time - req_time < window
            ]

            # Check rate limit
            if len(request_counts.get(client_ip, [])) >= max_requests:
                return jsonify({'error': 'Rate limit exceeded'}), 429

            # Add current request
            if client_ip not in request_counts:
                request_counts[client_ip] = []
            request_counts[client_ip].append(current_time)

            return f(*args, **kwargs)
        return decorated
    return decorator

@app.route('/')
def public_info():
    return jsonify({
        'service': 'Expense AI Public API',
        'version': '1.0',
        'endpoints': ['/api/expenses', '/api/health'],
        'note': 'Limited access for public users'
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'server': 'public'})

@app.route('/api/expenses', methods=['GET'])
@rate_limit(max_requests=5, window=60)
def get_user_expenses():
    # Simulate user-specific data
    return jsonify({
        'success': True,
        'message': 'Public API - Limited access',
        'data': [
            {'id': 1, 'amount': 50000, 'category': 'an uong', 'description': 'Sample expense'}
        ],
        'note': 'This is demo data for public users'
    })

@app.route('/api/expenses', methods=['POST'])
@rate_limit(max_requests=3, window=60)
def add_expense():
    return jsonify({
        'success': False,
        'message': 'Feature not available in public version'
    })

if __name__ == '__main__':
    print("🌐 Starting Public Server")
    print("📍 Access: http://localhost:8000")
    app.run(host='0.0.0.0', port=8000, debug=True)