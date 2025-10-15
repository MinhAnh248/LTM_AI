from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# In-memory storage
data_store = {
    'expenses': [],
    'incomes': [],
    'budgets': [],
    'debts': [],
    'savings': [],
    'reminders': [],
    'users': [{'id': 1, 'email': 'admin@example.com', 'password': '123456', 'token': 'demo-token'}]
}

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Backend is running'})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = next((u for u in data_store['users'] if u['email'] == email and u['password'] == password), None)
    if user:
        return jsonify({'success': True, 'token': user['token'], 'user': {'id': user['id'], 'email': user['email']}})
    return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    new_user = {
        'id': len(data_store['users']) + 1,
        'email': data.get('email'),
        'password': data.get('password'),
        'token': f'token-{len(data_store["users"]) + 1}'
    }
    data_store['users'].append(new_user)
    return jsonify({'success': True, 'token': new_user['token'], 'user': {'id': new_user['id'], 'email': new_user['email']}})

@app.route('/api/expenses', methods=['GET', 'POST', 'DELETE'])
def expenses():
    if request.method == 'GET':
        return jsonify(data_store['expenses'])
    elif request.method == 'POST':
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
    elif request.method == 'DELETE':
        data_store['expenses'] = []
        return jsonify({'success': True})

@app.route('/api/expenses/<int:expense_id>', methods=['DELETE', 'PUT'])
def expense_detail(expense_id):
    if request.method == 'DELETE':
        data_store['expenses'] = [e for e in data_store['expenses'] if e['id'] != expense_id]
        return jsonify({'success': True})
    elif request.method == 'PUT':
        data = request.get_json()
        for expense in data_store['expenses']:
            if expense['id'] == expense_id:
                expense.update(data)
                return jsonify({'success': True})
        return jsonify({'success': False, 'error': 'Not found'}), 404

@app.route('/api/incomes', methods=['GET', 'POST'])
def incomes():
    if request.method == 'GET':
        return jsonify(data_store['incomes'])
    data = request.get_json()
    income = {'id': len(data_store['incomes']) + 1, **data}
    data_store['incomes'].append(income)
    return jsonify({'success': True, 'id': income['id']})

@app.route('/api/budgets', methods=['GET', 'POST'])
def budgets():
    if request.method == 'GET':
        return jsonify(data_store['budgets'])
    data = request.get_json()
    budget = {'id': len(data_store['budgets']) + 1, **data}
    data_store['budgets'].append(budget)
    return jsonify({'success': True, 'id': budget['id']})

@app.route('/api/scan-receipt', methods=['POST'])
def scan_receipt():
    return jsonify({
        'success': True,
        'data': {
            'amount': 50000,
            'description': 'Hóa đơn',
            'category': 'an uong',
            'date': datetime.now().strftime('%Y-%m-%d')
        },
        'raw_text': 'Sample receipt'
    })

@app.route('/api/predict-category', methods=['POST'])
def predict_category():
    data = request.get_json()
    description = data.get('description', '').lower()
    
    if any(word in description for word in ['cafe', 'com', 'an', 'uong', 'pho']):
        category = 'an uong'
    elif any(word in description for word in ['grab', 'taxi', 'xe']):
        category = 'di lai'
    elif any(word in description for word in ['sach', 'hoc']):
        category = 'hoc tap'
    elif any(word in description for word in ['phim', 'game']):
        category = 'giai tri'
    elif any(word in description for word in ['dien', 'nuoc', 'internet']):
        category = 'hoa don'
    else:
        category = 'khac'
    
    return jsonify({'category': category})

@app.route('/api/summary', methods=['GET'])
def summary():
    total = sum(e['amount'] for e in data_store['expenses'])
    count = len(data_store['expenses'])
    average = total / count if count > 0 else 0
    return jsonify({'total': total, 'count': count, 'average': average})

@app.route('/api/debts', methods=['GET', 'POST'])
def debts():
    if request.method == 'GET':
        return jsonify(data_store['debts'])
    data = request.get_json()
    debt = {'id': len(data_store['debts']) + 1, **data}
    data_store['debts'].append(debt)
    return jsonify({'success': True, 'id': debt['id']})

@app.route('/api/savings-goals', methods=['GET', 'POST'])
def savings_goals():
    if request.method == 'GET':
        return jsonify(data_store['savings'])
    data = request.get_json()
    saving = {'id': len(data_store['savings']) + 1, **data}
    data_store['savings'].append(saving)
    return jsonify({'success': True, 'id': saving['id']})

@app.route('/api/reminders', methods=['GET', 'POST'])
def reminders():
    if request.method == 'GET':
        return jsonify(data_store['reminders'])
    data = request.get_json()
    reminder = {'id': len(data_store['reminders']) + 1, **data}
    data_store['reminders'].append(reminder)
    return jsonify({'success': True, 'id': reminder['id']})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
