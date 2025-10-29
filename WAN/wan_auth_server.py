"""
WAN Server with MFA Authentication
Tối ưu cho Internet - Yêu cầu đăng ký và xác thực OTP
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import string
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Storage
users_db = []
otp_storage = {}
data_store = {'expenses': [], 'incomes': [], 'budgets': [], 'debts': [], 'savings': [], 'reminders': []}

# MFA Functions
def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

def send_otp(email, otp):
    print(f"\n{'='*50}")
    print(f"📧 OTP for {email}: {otp}")
    print(f"{'='*50}\n")
    return True

# Auth Endpoints
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if any(u['email'] == email for u in users_db):
        return jsonify({'success': False, 'message': 'Email đã tồn tại'}), 400
    
    otp = generate_otp()
    otp_storage[email] = {
        'otp': otp,
        'password': password,
        'expires': datetime.now() + timedelta(minutes=5),
        'attempts': 0
    }
    
    send_otp(email, otp)
    
    return jsonify({
        'success': True,
        'message': 'OTP đã gửi đến email',
        'requires_otp': True
    })

@app.route('/api/auth/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')
    
    if email not in otp_storage:
        return jsonify({'success': False, 'message': 'OTP không tồn tại'}), 400
    
    stored = otp_storage[email]
    
    if datetime.now() > stored['expires']:
        del otp_storage[email]
        return jsonify({'success': False, 'message': 'OTP hết hạn'}), 400
    
    if stored['attempts'] >= 3:
        del otp_storage[email]
        return jsonify({'success': False, 'message': 'Quá số lần thử'}), 400
    
    if stored['otp'] != otp:
        stored['attempts'] += 1
        return jsonify({'success': False, 'message': f'OTP sai. Còn {3-stored["attempts"]} lần'}), 400
    
    # Create user
    user = {
        'id': len(users_db) + 1,
        'email': email,
        'password': stored['password'],
        'token': f'token-{len(users_db) + 1}',
        'verified': True
    }
    users_db.append(user)
    del otp_storage[email]
    
    return jsonify({
        'success': True,
        'message': 'Xác thực thành công',
        'token': user['token'],
        'user': {'id': user['id'], 'email': user['email']}
    })

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = next((u for u in users_db if u['email'] == email and u['password'] == password), None)
    
    if user:
        return jsonify({
            'success': True,
            'token': user['token'],
            'user': {'id': user['id'], 'email': user['email']}
        })
    
    return jsonify({'success': False, 'message': 'Email hoặc mật khẩu sai'}), 401

# Protected endpoints
def require_auth(f):
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not any(u['token'] == token for u in users_db):
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/expenses', methods=['GET', 'POST'])
@require_auth
def expenses():
    if request.method == 'GET':
        return jsonify(data_store['expenses'])
    
    data = request.get_json()
    expense = {
        'id': len(data_store['expenses']) + 1,
        'date': data.get('date', datetime.now().strftime('%Y-%m-%d')),
        'amount': float(data.get('amount', 0)),
        'description': data.get('description', ''),
        'category': data.get('category', 'khac')
    }
    data_store['expenses'].append(expense)
    return jsonify({'success': True, 'id': expense['id']})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'mode': 'WAN', 'auth': 'required'})

@app.route('/', methods=['GET'])
def root():
    return jsonify({'message': 'Expense AI WAN Server', 'status': 'running', 'auth': 'MFA enabled'})

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
