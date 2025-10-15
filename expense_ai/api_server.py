from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Backend is running'})

@app.route('/api/summary', methods=['GET'])
def summary():
    return jsonify({'total': 0, 'count': 0, 'average': 0})

@app.route('/api/scan-receipt', methods=['POST'])
def scan_receipt():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    # Trả về dữ liệu mẫu
    return jsonify({
        'success': True,
        'amount': 50000,
        'category': 'an uong',
        'description': 'Hóa đơn',
        'date': '2025-10-15'
    })

@app.route('/api/expenses', methods=['GET', 'POST'])
def expenses():
    if request.method == 'GET':
        return jsonify([])
    return jsonify({'success': True, 'id': 1})

@app.route('/api/login', methods=['POST'])
def login():
    return jsonify({
        'success': True,
        'token': 'demo-token',
        'user': {'id': 1, 'email': 'demo@example.com'}
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
