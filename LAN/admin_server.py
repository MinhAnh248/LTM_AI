from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import sqlite3

app = Flask(__name__)
CORS(app)

def require_lan_access(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        client_ip = request.remote_addr
        if not client_ip.startswith('192.168.1.0'):
            return jsonify({'Admin LAN access only'}), 403
        return f(*args, **kwargs)
    return decorated

@app.route('/admin/users', methods=['GET'])
@require_lan_access
def get_all_users():
    #Lấy tất cả users quản trị từ database
    return jsonify({'users': 'all_user_data'})

@app.route('/admin/stats', methods=['GET'])
@require_lan_access
def get_system_stats():
    return jsonify({'total_users': 100, 'active_sessions': 25})

if __name__ == '__main__':
    app.run(host='192.168.10.100', port=5000, debug=True)
