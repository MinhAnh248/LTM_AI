import sys
sys.path.append('../expense_ai')

from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import time
import os
from dotenv import load_dotenv

# Import expense_ai modules
from ocr_processor import OCRProcessor

load_dotenv('../expense_ai/.env')

app = Flask(__name__)
CORS(app)

# Initialize OCR
try:
    ocr_processor = OCRProcessor()
except:
    ocr_processor = None

# Rate limiting
request_counts = {}

def rate_limit(max_requests=20, window=60):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            client_ip = request.remote_addr
            current_time = time.time()
            
            if client_ip not in request_counts:
                request_counts[client_ip] = []
            
            request_counts[client_ip] = [
                t for t in request_counts[client_ip]
                if current_time - t < window
            ]
            
            if len(request_counts[client_ip]) >= max_requests:
                return jsonify({'error': 'Rate limit exceeded'}), 429
            
            request_counts[client_ip].append(current_time)
            return f(*args, **kwargs)
        return decorated
    return decorator

# In-memory storage
data_store = {
    'expenses': [],
    'users': [{'id': 1, 'email': 'admin@example.com', 'password': '123456', 'token': 'demo-token'}]
}

@app.route('/')
def home():
    return jsonify({
        'service': 'Expense AI WAN',
        'status': 'online',
        'endpoints': ['/api/health', '/api/login', '/api/expenses', '/api/scan-receipt']
    })

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'service': 'Expense AI WAN'})

@app.route('/api/login', methods=['POST'])
@rate_limit(max_requests=10, window=300)
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = next((u for u in data_store['users'] if u['email'] == email and u['password'] == password), None)
    if user:
        return jsonify({'success': True, 'token': user['token'], 'user': {'id': user['id'], 'email': user['email']}})
    
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/expenses', methods=['GET', 'POST'])
@rate_limit(max_requests=30, window=60)
def expenses():
    if request.method == 'GET':
        return jsonify(data_store['expenses'])
    
    data = request.get_json()
    expense = {
        'id': len(data_store['expenses']) + 1,
        'date': data.get('date'),
        'amount': float(data.get('amount', 0)),
        'description': data.get('description', ''),
        'category': data.get('category', 'khac')
    }
    data_store['expenses'].append(expense)
    return jsonify({'success': True, 'id': expense['id']})

@app.route('/api/scan-receipt', methods=['POST'])
@rate_limit(max_requests=5, window=60)
def scan_receipt():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image'}), 400
    
    if not ocr_processor:
        return jsonify({'success': False, 'error': 'OCR not available'}), 500
    
    try:
        image_file = request.files['image']
        result = ocr_processor.process_receipt(image_file)
        return jsonify({
            'success': result['success'],
            'data': result['data'],
            'raw_text': str(result.get('raw_data', ''))
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/summary')
@rate_limit(max_requests=20, window=60)
def summary():
    total = sum(e['amount'] for e in data_store['expenses'])
    return jsonify({
        'total': total,
        'count': len(data_store['expenses']),
        'average': total / len(data_store['expenses']) if data_store['expenses'] else 0
    })

if __name__ == '__main__':
    print("🌐 Expense AI WAN Server")
    print("📍 Access: http://0.0.0.0:7000")
    print("🔒 Rate limited, OCR enabled")
    app.run(host='0.0.0.0', port=7000, debug=False)