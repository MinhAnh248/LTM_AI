from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Backend is running'})

@app.route('/api/expenses', methods=['GET', 'POST'])
def expenses():
    if request.method == 'GET':
        return jsonify([])
    return jsonify({'success': True})

@app.route('/api/incomes', methods=['GET', 'POST'])
def incomes():
    if request.method == 'GET':
        return jsonify([])
    return jsonify({'success': True})

@app.route('/api/budgets', methods=['GET', 'POST'])
def budgets():
    if request.method == 'GET':
        return jsonify([])
    return jsonify({'success': True})

@app.route('/api/scan-receipt', methods=['POST'])
def scan_receipt():
    return jsonify({'success': False, 'error': 'OCR not available'})

@app.route('/api/predict-category', methods=['POST'])
def predict_category():
    return jsonify({'category': 'Other'})

@app.route('/api/summary', methods=['GET'])
def summary():
    return jsonify({'total': 0, 'count': 0, 'average': 0})

@app.route('/api/debts', methods=['GET', 'POST'])
def debts():
    if request.method == 'GET':
        return jsonify([])
    return jsonify({'success': True})

@app.route('/api/savings-goals', methods=['GET', 'POST'])
def savings_goals():
    if request.method == 'GET':
        return jsonify([])
    return jsonify({'success': True})

@app.route('/api/reminders', methods=['GET', 'POST'])
def reminders():
    if request.method == 'GET':
        return jsonify([])
    return jsonify({'success': True})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
