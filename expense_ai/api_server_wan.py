from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# In-memory storage for WAN
data_store = {
    'expenses': [],
    'incomes': [],
    'budgets': [],
    'debts': [],
    'savings': [],
    'reminders': [],
    'users': [{'id': 1, 'email': 'admin@example.com', 'password': '123456', 'token': 'demo-token'}]
}

@app.route('/', methods=['GET'])
def root():
    return jsonify({'message': 'Expense AI API', 'status': 'running'})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Backend is running'})

@app.route('/api/login', methods=['POST'])
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = next((u for u in data_store['users'] if u['email'] == email and u['password'] == password), None)
    if user:
        return jsonify({'success': True, 'token': user['token'], 'user': {'id': user['id'], 'email': user['email']}})
    
    new_user = {'id': len(data_store['users']) + 1, 'email': email, 'password': password, 'token': f'token-{email}'}
    data_store['users'].append(new_user)
    return jsonify({'success': True, 'token': new_user['token'], 'user': {'id': new_user['id'], 'email': new_user['email']}})

@app.route('/api/auth/me', methods=['GET'])
def auth_me():
    return jsonify({'id': 1, 'email': 'guest@example.com', 'full_name': 'Guest'})

@app.route('/api/expenses', methods=['GET', 'POST'])
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

@app.route('/api/summary', methods=['GET'])
def summary():
    total = sum(e['amount'] for e in data_store['expenses'])
    return jsonify({'total': total, 'count': len(data_store['expenses']), 'average': total / len(data_store['expenses']) if data_store['expenses'] else 0})

@app.route('/api/income-summary', methods=['GET'])
def income_summary():
    return jsonify({'total_income': 0, 'count': 0})

@app.route('/api/debt-summary', methods=['GET'])
def debt_summary():
    return jsonify({'total_debt': 0, 'total': 0, 'paid': 0})

@app.route('/api/savings-summary', methods=['GET'])
def savings_summary():
    return jsonify({'total_savings': 0, 'total_goal': 0})

@app.route('/api/category-breakdown', methods=['GET'])
def category_breakdown():
    return jsonify([])

@app.route('/api/daily-spending', methods=['GET'])
def daily_spending():
    return jsonify([])

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
