from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
sys.path.append('src')

from db_factory import get_database
from ai_classifier import ExpenseClassifier
from ai_advisor import ExpenseAdvisor
from datetime import datetime, date
import json
import base64
from functools import wraps

# Import Gemini OCR processor
ocr_processor = None

try:
    from ocr_processor import gemini_ocr_processor as ocr_processor
    print("Using Gemini OCR processor")
except ImportError as e:
    print(f"Gemini OCR not available: {e}")
    ocr_processor = None

if ocr_processor:
    print("OCR service ready!")
else:
    print("OCR service not available - scan feature will be disabled")

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Initialize components
db = get_database()
classifier = ExpenseClassifier()
advisor = ExpenseAdvisor(db)



@app.route('/api/predict-category', methods=['POST'])
def predict_category():
    """Live category prediction for auto-suggest"""
    data = request.get_json()
    description = data.get('description', '')
    
    if not description:
        return jsonify({'category': 'khac'})
    
    predicted_category = classifier.classify(description)
    return jsonify({'category': predicted_category})

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    """Get all expenses with optional filtering"""
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    category = request.args.get('category')
    
    df = db.get_expenses()
    
    # Apply filters
    if start_date:
        df = df[df['date'] >= start_date]
    if end_date:
        df = df[df['date'] <= end_date]
    if category:
        df = df[df['category'] == category]
    
    return jsonify(df.to_dict('records'))

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    """Add new expense"""
    data = request.get_json()
    
    try:
        expense_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        category = data['category']
        amount = float(data['amount'])
        description = data['description']
        
        db.add_expense(expense_date, category, amount, description)
        
        # Tính ngân sách còn lại
        budget_info = db.get_remaining_budget()
        remaining = budget_info['remaining_budget']
        
        budget_alert = None
        if remaining < 0:
            budget_alert = {
                'alert_type': 'danger',
                'message': f'🚨 Vượt ngân sách: {abs(remaining):,.0f}đ'
            }
        elif budget_info['total_income'] > 0 and remaining < budget_info['total_income'] * 0.2:
            budget_alert = {
                'alert_type': 'warning',
                'message': f'⚠️ Ngân sách còn lại: {remaining:,.0f}đ'
            }
        
        response = {'success': True, 'message': 'Expense added successfully'}
        if budget_alert:
            response['budget_alert'] = budget_alert
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    """Delete an expense"""
    try:
        db.delete_expense(expense_id)
        return jsonify({'success': True, 'message': 'Expense deleted successfully'})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/expenses/<int:expense_id>', methods=['PUT'])
def update_expense(expense_id):
    """Update an expense"""
    data = request.get_json()
    
    try:
        expense_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        category = data['category']
        amount = float(data['amount'])
        description = data['description']
        
        db.update_expense(expense_id, expense_date, category, amount, description)
        return jsonify({'success': True, 'message': 'Expense updated successfully'})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/expenses/clear-all', methods=['DELETE'])
def clear_all_expenses():
    """Delete all expenses"""
    try:
        db.clear_all_expenses()
        return jsonify({'success': True, 'message': 'All expenses deleted successfully'})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/incomes/clear-all', methods=['DELETE'])
def clear_all_incomes():
    """Delete all incomes"""
    try:
        db.clear_all_incomes()
        return jsonify({'success': True, 'message': 'All incomes deleted successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/clear-all-data', methods=['DELETE'])
def clear_all_data():
    """Delete all data (expenses, incomes, budgets)"""
    try:
        db.clear_all_data()
        return jsonify({'success': True, 'message': 'All data cleared successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/create-sample-data', methods=['POST'])
def create_sample_data():
    """Create sample data for testing"""
    return jsonify({'success': False, 'message': 'Sample data creation disabled'}), 400

@app.route('/api/scan-receipt', methods=['POST'])
def scan_receipt():
    """Scan receipt image and extract expense information using Gemini AI"""
    try:
        # Check if OCR is available
        if ocr_processor is None:
            return jsonify({
                'success': False, 
                'error': 'OCR service not available'
            }), 400
        
        # Check if image is provided
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        
        if image_file.filename == '':
            return jsonify({'success': False, 'error': 'No image selected'}), 400
        
        # Read image data
        image_data = image_file.read()
        
        # Save to temp file
        import tempfile
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            temp_file.write(image_data)
            temp_path = temp_file.name
        
        try:
            ocr_result = ocr_processor.extract_receipt_data(temp_path)
            
            if ocr_result['success']:
                result = {
                    'success': True,
                    'data': {
                        'amount': float(ocr_result['total_amount']) if ocr_result['total_amount'] else 50000,
                        'description': ocr_result.get('description') or 'Chi tiêu từ hóa đơn',
                        'category': ocr_result['category'],
                        'date': ocr_result['merchant_info']['date']
                    },
                    'raw_text': ocr_result['raw_text'],
                    'items': ocr_result['items'],
                    'validation': ocr_result['validation'],
                    'auto_classified': ocr_result.get('auto_classified', True),
                    'confidence_score': ocr_result.get('confidence_score', 0.85),
                    'merchant_info': ocr_result['merchant_info'],
                    'ocr_mode': 'gemini'
                }
                return jsonify(result)
            else:
                return jsonify({'success': False, 'error': ocr_result.get('error', 'OCR processing failed')}), 400
        finally:
            # Clean up temp file
            try:
                os.unlink(temp_path)
            except:
                pass
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/summary', methods=['GET'])
def get_summary():
    """Get expense summary statistics"""
    summary = db.get_summary()
    return jsonify(summary)

@app.route('/api/category-breakdown', methods=['GET'])
def get_category_breakdown():
    """Get spending breakdown by category"""
    df = db.get_expenses()
    if df.empty:
        return jsonify([])
    
    breakdown = df.groupby('category')['amount'].sum().to_dict()
    result = [{'category': k, 'amount': v} for k, v in breakdown.items()]
    return jsonify(result)

@app.route('/api/daily-spending', methods=['GET'])
def get_daily_spending():
    """Get daily spending data for charts"""
    df = db.get_expenses()
    if df.empty:
        return jsonify([])
    
    daily = df.groupby('date')['amount'].sum().reset_index()
    daily['date'] = daily['date'].astype(str)
    return jsonify(daily.to_dict('records'))

@app.route('/api/analysis', methods=['GET'])
def get_analysis():
    """Get AI analysis and recommendations"""
    analysis = {
        'spending_pattern': advisor.analyze_spending_pattern(),
        'prediction': advisor.predict_next_week(),
        'savings_tips': advisor.get_savings_tips()
    }
    return jsonify(analysis)

@app.route('/api/budget', methods=['GET'])
def get_budgets():
    """Get budget info: income - expenses"""
    try:
        budget_info = db.get_remaining_budget()
        return jsonify(budget_info)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/budget', methods=['POST'])
def set_budget():
    """Set budget limit for category"""
    data = request.get_json()
    category = data['category']
    limit = data['limit']
    
    try:
        db.set_budget(category, limit)
        return jsonify({'success': True, 'message': 'Budget updated successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400



# Income endpoints
@app.route('/api/incomes', methods=['GET'])
def get_incomes():
    """Get all incomes"""
    try:
        df = db.get_incomes()
        return jsonify(df.to_dict('records'))
    except Exception as e:
        print(f"Error getting incomes: {e}")
        return jsonify({'error': str(e)}), 400

@app.route('/api/incomes', methods=['POST'])
def add_income():
    """Add new income"""
    data = request.get_json()
    
    try:
        income_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        category = data.get('category', 'Lương')
        amount = float(data['amount'])
        description = data.get('description', '')
        
        db.add_income(income_date, category, amount, description)
        
        return jsonify({'success': True, 'message': 'Income added successfully'})
    
    except Exception as e:
        print(f"Error adding income: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/incomes/<int:income_id>', methods=['DELETE'])
def delete_income(income_id):
    """Delete an income"""
    try:
        db.delete_expense(income_id)  # Reuse delete method
        return jsonify({'success': True, 'message': 'Income deleted'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/incomes/<int:income_id>', methods=['PUT'])
@require_auth
def update_income(income_id):
    """Update an income"""
    data = request.get_json()
    
    try:
        income_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        category = data['category']
        amount = float(data['amount'])
        description = data['description']
        
        result = income_manager.update_income(request.user_id, income_id, income_date, category, amount, description)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/income-summary', methods=['GET'])
def get_income_summary():
    """Get income summary"""
    try:
        budget_info = db.get_remaining_budget()
        return jsonify({
            'total_income': budget_info['total_income'],
            'this_month': budget_info['total_income'],
            'income_sources': 1
        })
    except Exception as e:
        return jsonify({'total_income': 0, 'this_month': 0, 'income_sources': 0}), 400

@app.route('/api/budget-alerts', methods=['GET'])
def get_budget_alerts():
    return jsonify([])

@app.route('/api/spending-status', methods=['GET'])
def get_spending_status():
    return jsonify([])

@app.route('/api/debt-summary', methods=['GET'])
def get_debt_summary():
    return jsonify({'total_debt': 0, 'monthly_payment': 0, 'debt_count': 0})

@app.route('/api/savings-summary', methods=['GET'])
def get_savings_summary():
    return jsonify({'total_savings': 0, 'active_goals': 0, 'completed_goals': 0})



def _map_category(category):
    """Map category from OCR to system categories"""
    category_mapping = {
        'ăn uống': 'an uong',
        'đi lại': 'di lai', 
        'giải trí': 'giai tri',
        'mua sắm': 'mua sam',
        'sức khỏe': 'suc khoe',
        'học tập': 'hoc tap',
        'khác': 'khac'
    }
    return category_mapping.get(category, 'khac')

def _format_date(date_str):
    """Format date from OCR to YYYY-MM-DD"""
    if not date_str:
        return datetime.now().strftime('%Y-%m-%d')
    
    # Try to parse various date formats
    date_formats = ['%d/%m/%Y', '%d-%m-%Y', '%d.%m.%Y', '%Y-%m-%d']
    
    for fmt in date_formats:
        try:
            parsed_date = datetime.strptime(date_str, fmt)
            return parsed_date.strftime('%Y-%m-%d')
        except ValueError:
            continue
    
    # If parsing fails, return today
    return datetime.now().strftime('%Y-%m-%d')

if __name__ == '__main__':
    app.run(debug=True, port=5000)