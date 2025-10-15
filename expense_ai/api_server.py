from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from src.auth import Auth
from src.sqlite_db import SQLiteDB
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
auth = Auth(db)
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
    result = auth.register(data['email'], data['password'])
    return jsonify(result)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    result = auth.login(data['email'], data['password'])
    return jsonify(result)

@app.route('/api/expenses', methods=['GET', 'POST'])
def expenses():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    user_id = auth.verify_token(token)
    
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
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
    user_id = auth.verify_token(token)
    
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
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
    user_id = auth.verify_token(token)
    
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    if request.method == 'GET':
        budgets = budget_alert.get_budgets(user_id)
        return jsonify(budgets)
    else:
        data = request.get_json()
        result = budget_alert.set_budget(user_id, data)
        return jsonify(result)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
