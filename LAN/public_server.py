from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps

app = Flask(__name__)
CORS(app)

def rate_limit(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Implement rate limiting logic
        return f(*args, **kwargs)
    return decorated

@app.route('/api/expenses', methods=['GET'])
@rate_limit
def get_user_expenses():
    # Chỉ trả về data của user hiện tại
    return jsonify({'expenses': 'user_specific_data'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)