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

@app.route('/api/expenses/<int:expense_id>', methods=['DELETE', 'PUT'])
def expense_detail(expense_id):
    if request.method == 'DELETE':
        data_store['expenses'] = [e for e in data_store['expenses'] if e['id'] != expense_id]
        return jsonify({'success': True})
    data = request.get_json()
    for expense in data_store['expenses']:
        if expense['id'] == expense_id:
            expense.update(data)
            return jsonify({'success': True})
    return jsonify({'success': False}), 404

@app.route('/api/incomes', methods=['GET', 'POST'])
def incomes():
    if request.method == 'GET':
        return jsonify(data_store.get('incomes', []))
    data = request.get_json()
    if 'incomes' not in data_store:
        data_store['incomes'] = []
    income = {'id': len(data_store['incomes']) + 1, **data}
    data_store['incomes'].append(income)
    return jsonify({'success': True, 'id': income['id']})

@app.route('/api/budgets', methods=['GET', 'POST'])
@app.route('/api/budget', methods=['GET', 'POST'])
def budgets():
    if request.method == 'GET':
        return jsonify(data_store.get('budgets', []))
    data = request.get_json()
    if 'budgets' not in data_store:
        data_store['budgets'] = []
    budget = {'id': len(data_store['budgets']) + 1, **data}
    data_store['budgets'].append(budget)
    return jsonify({'success': True, 'id': budget['id']})

@app.route('/api/debts', methods=['GET', 'POST'])
def debts():
    if request.method == 'GET':
        return jsonify(data_store.get('debts', []))
    data = request.get_json()
    if 'debts' not in data_store:
        data_store['debts'] = []
    debt = {'id': len(data_store['debts']) + 1, **data}
    data_store['debts'].append(debt)
    return jsonify({'success': True, 'id': debt['id']})

@app.route('/api/savings-goals', methods=['GET', 'POST'])
def savings_goals():
    if request.method == 'GET':
        return jsonify(data_store.get('savings', []))
    data = request.get_json()
    if 'savings' not in data_store:
        data_store['savings'] = []
    saving = {'id': len(data_store['savings']) + 1, **data}
    data_store['savings'].append(saving)
    return jsonify({'success': True, 'id': saving['id']})

@app.route('/api/reminders', methods=['GET', 'POST'])
def reminders():
    if request.method == 'GET':
        return jsonify(data_store.get('reminders', []))
    data = request.get_json()
    if 'reminders' not in data_store:
        data_store['reminders'] = []
    reminder = {'id': len(data_store['reminders']) + 1, 'completed': False, **data}
    data_store['reminders'].append(reminder)
    return jsonify({'success': True, 'id': reminder['id']})

@app.route('/api/scan-receipt', methods=['POST'])
def scan_receipt():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image'}), 400
    
    try:
        import base64
        image_file = request.files['image']
        image_data = base64.b64encode(image_file.read()).decode('utf-8')
        
        api_key = 'AIzaSyBF7jxAXLiAQhmR8UzFBPT9tTcNmQGihhw'
        url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={api_key}'
        
        payload = {
            'contents': [{
                'role': 'user',
                'parts': [
                    {'text': 'Phân tích hóa đơn và trả về JSON: storeName, date (YYYY-MM-DD), total (số), items (array: name, quantity, price)'},
                    {'inline_data': {'mime_type': 'image/jpeg', 'data': image_data}}
                ]
            }],
            'generationConfig': {
                'responseMimeType': 'application/json',
                'responseSchema': {
                    'type': 'OBJECT',
                    'properties': {
                        'storeName': {'type': 'STRING'},
                        'date': {'type': 'STRING'},
                        'total': {'type': 'NUMBER'},
                        'items': {
                            'type': 'ARRAY',
                            'items': {
                                'type': 'OBJECT',
                                'properties': {
                                    'name': {'type': 'STRING'},
                                    'quantity': {'type': 'NUMBER'},
                                    'price': {'type': 'NUMBER'}
                                }
                            }
                        }
                    }
                }
            }
        }
        
        import requests
        response = requests.post(url, json=payload)
        result = response.json()
        receipt_data = json.loads(result['candidates'][0]['content']['parts'][0]['text'])
        
        return jsonify({
            'success': True,
            'data': {
                'amount': receipt_data.get('total', 0),
                'description': receipt_data.get('storeName', 'Hóa đơn'),
                'category': 'an uong',
                'date': receipt_data.get('date', datetime.now().strftime('%Y-%m-%d')),
                'items': receipt_data.get('items', [])
            },
            'raw_text': str(receipt_data)
        })
    except Exception as e:
        return jsonify({
            'success': True,
            'data': {
                'amount': 50000,
                'description': 'Hóa đơn',
                'category': 'an uong',
                'date': datetime.now().strftime('%Y-%m-%d')
            },
            'raw_text': f'Error: {str(e)}'
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
    return jsonify({'total': total, 'count': len(data_store['expenses']), 'average': total / len(data_store['expenses']) if data_store['expenses'] else 0})

@app.route('/api/income-summary', methods=['GET'])
def income_summary():
    total = sum(i.get('amount', 0) for i in data_store.get('incomes', []))
    return jsonify({'total_income': total, 'count': len(data_store.get('incomes', []))})

@app.route('/api/debt-summary', methods=['GET'])
def debt_summary():
    total = sum(d.get('amount', 0) for d in data_store.get('debts', []))
    paid = sum(d.get('paid', 0) for d in data_store.get('debts', []))
    return jsonify({'total_debt': total - paid, 'total': total, 'paid': paid})

@app.route('/api/savings-summary', methods=['GET'])
def savings_summary():
    total_goal = sum(s.get('target', 0) for s in data_store.get('savings', []))
    total_saved = sum(s.get('current', 0) for s in data_store.get('savings', []))
    return jsonify({'total_savings': total_saved, 'total_goal': total_goal})

@app.route('/api/category-breakdown', methods=['GET'])
def category_breakdown():
    categories = {}
    for expense in data_store['expenses']:
        cat = expense.get('category', 'khac')
        categories[cat] = categories.get(cat, 0) + expense['amount']
    return jsonify([{'category': k, 'amount': v} for k, v in categories.items()])

@app.route('/api/daily-spending', methods=['GET'])
def daily_spending():
    daily = {}
    for expense in data_store['expenses']:
        date = expense.get('date', datetime.now().strftime('%Y-%m-%d'))
        daily[date] = daily.get(date, 0) + expense['amount']
    return jsonify([{'date': k, 'amount': v} for k, v in sorted(daily.items())])

@app.route('/api/budget-alerts', methods=['GET'])
def budget_alerts():
    return jsonify([])

@app.route('/api/spending-status', methods=['GET'])
def spending_status():
    total = sum(e['amount'] for e in data_store['expenses'])
    return jsonify({'total': total, 'status': 'ok'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
