from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from src.auth import AuthManager
from src.sqlite_db import SQLiteExpenseDB as SQLiteDB
from src.ai_classifier import AIClassifier
from src.income_manager import IncomeManager
from src.budget_alert import BudgetAlert
from src.debt_manager import DebtManager
from src.savings_manager import SavingsManager
from src.reminder_manager import ReminderManager
from src.ai_advisor import AIAdvisor
from ocr_processor import OCRProcessor

app = Flask(__name__)
CORS(app)

# Initialize components
db = SQLiteDB()
auth = AuthManager('data/expense_data.db')
ai_classifier = AIClassifier()
income_manager = IncomeManager(db)
budget_alert = BudgetAlert(db)
debt_manager = DebtManager(db)
savings_manager = SavingsManager(db)
reminder_manager = ReminderManager(db)
ai_advisor = AIAdvisor(db)
ocr_processor = OCRProcessor()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Backend is running'})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    result = auth.register_user(data['email'], data['password'], data.get('full_name', ''), data.get('phone', ''))
    return jsonify(result)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    result = auth.login_user(data['email'], data['password'])
    return jsonify(result)

@app.route('/api/expenses', methods=['GET', 'POST'])
def expenses():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    result = auth.verify_token(token)
    
    if not result['success']:
        return jsonify({'error': 'Unauthorized'}), 401
    
    user_id = result['user_id']
    
    if request.method == 'GET':
        expenses = db.get_expenses(user_id)
        return jsonify(expenses)
    else:
        data = request.get_json()
        result = db.add_expense(user_id, data)
        return jsonify(result)

@app.route('/api/incomes', methods=['GET', 'POST'])
def incomes():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    result = auth.verify_token(token)
    
    if not result['success']:
        return jsonify({'error': 'Unauthorized'}), 401
    
    user_id = result['user_id']
    
    if request.method == 'GET':
        incomes = income_manager.get_incomes(user_id)
        return jsonify(incomes)
    else:
        data = request.get_json()
        result = income_manager.add_income(user_id, data)
        return jsonify(result)

@app.route('/api/budgets', methods=['GET', 'POST'])
def budgets():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    result = auth.verify_token(token)
    
    if not result['success']:
        return jsonify({'error': 'Unauthorized'}), 401
    
    user_id = result['user_id']
    
    if request.method == 'GET':
        budgets = budget_alert.get_budgets(user_id)
        return jsonify(budgets)
    else:
        data = request.get_json()
        result = budget_alert.set_budget(user_id, data)
        return jsonify(result)

@app.route('/api/scan-receipt', methods=['POST'])
def scan_receipt():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    result = auth.verify_token(token)
    
    if not result['success']:
        return jsonify({'error': 'Unauthorized'}), 401
    
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image provided'}), 400
    
    image_file = request.files['image']
    result = ocr_processor.process_receipt(image_file)
    return jsonify(result)

@app.route('/api/predict-category', methods=['POST'])
def predict_category():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    result = auth.verify_token(token)
    
    if not result['success']:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.get_json()
    description = data.get('description', '')
    category = ai_classifier.predict_category(description)
    return jsonify({'category': category})

@app.route('/api/summary', methods=['GET'])
def summary():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    result = auth.verify_token(token)
    
    if not result['success']:
        return jsonify({'error': 'Unauthorized'}), 401
    
    user_id = result['user_id']
    expenses = db.get_expenses(user_id)
    
    total = sum(e['amount'] for e in expenses)
    count = len(expenses)
    average = total / count if count > 0 else 0
    
    return jsonify({'total': total, 'count': count, 'average': average})

@app.route('/api/debts', methods=['GET', 'POST'])
def debts():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    result = auth.verify_token(token)
    
    if not result['success']:
        return jsonify({'error': 'Unauthorized'}), 401
    
    user_id = result['user_id']
    
    if request.method == 'GET':
        debts = debt_manager.get_debts(user_id)
        return jsonify(debts)
    else:
        data = request.get_json()
        result = debt_manager.add_debt(user_id, data)
        return jsonify(result)

@app.route('/api/savings-goals', methods=['GET', 'POST'])
def savings_goals():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    result = auth.verify_token(token)
    
    if not result['success']:
        return jsonify({'error': 'Unauthorized'}), 401
    
    user_id = result['user_id']
    
    if request.method == 'GET':
        goals = savings_manager.get_goals(user_id)
        return jsonify(goals)
    else:
        data = request.get_json()
        result = savings_manager.add_goal(user_id, data)
        return jsonify(result)

@app.route('/api/reminders', methods=['GET', 'POST'])
def reminders():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    result = auth.verify_token(token)
    
    if not result['success']:
        return jsonify({'error': 'Unauthorized'}), 401
    
    user_id = result['user_id']
    
    if request.method == 'GET':
        reminders = reminder_manager.get_reminders(user_id)
        return jsonify(reminders)
    else:
        data = request.get_json()
        result = reminder_manager.add_reminder(user_id, data)
        return jsonify(result)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
