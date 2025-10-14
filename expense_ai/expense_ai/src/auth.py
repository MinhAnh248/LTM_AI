import sqlite3
import hashlib
import secrets
from datetime import datetime, timedelta

class AuthManager:
    def __init__(self, db_path="expense_data.db"):
        self.db_path = db_path
    
    def hash_password(self, password):
        return hashlib.sha256(password.encode()).hexdigest()
    
    def register_user(self, email, password, full_name, phone=''):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
            if cursor.fetchone():
                return {'success': False, 'message': 'Email already exists'}
            
            password_hash = self.hash_password(password)
            cursor.execute('''
                INSERT INTO users (email, password_hash, full_name, phone)
                VALUES (?, ?, ?, ?)
            ''', (email, password_hash, full_name, phone))
            
            user_id = cursor.lastrowid
            conn.commit()
            
            token = self.create_session(user_id)
            
            return {
                'success': True,
                'token': token,
                'user': {'id': user_id, 'email': email}
            }
        except Exception as e:
            return {'success': False, 'message': str(e)}
        finally:
            conn.close()
    
    def login_user(self, email, password):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            password_hash = self.hash_password(password)
            cursor.execute('''
                SELECT id, email FROM users 
                WHERE email = ? AND password_hash = ?
            ''', (email, password_hash))
            
            user = cursor.fetchone()
            if not user:
                return {'success': False, 'message': 'Invalid credentials'}
            
            user_id, email = user
            token = self.create_session(user_id)
            
            return {
                'success': True,
                'token': token,
                'user': {'id': user_id, 'email': email}
            }
        except Exception as e:
            return {'success': False, 'message': str(e)}
        finally:
            conn.close()
    
    def create_session(self, user_id):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            token = secrets.token_urlsafe(32)
            expires_at = datetime.now() + timedelta(days=7)
            
            cursor.execute('''
                INSERT INTO sessions (user_id, token, expires_at)
                VALUES (?, ?, ?)
            ''', (user_id, token, expires_at))
            
            conn.commit()
            return token
        finally:
            conn.close()
    
    def verify_token(self, token):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT user_id FROM sessions 
                WHERE token = ? AND expires_at > ?
            ''', (token, datetime.now()))
            
            result = cursor.fetchone()
            if result:
                return {'success': True, 'user_id': result[0]}
            return {'success': False, 'message': 'Invalid token'}
        finally:
            conn.close()
    
    def logout_user(self, token):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('DELETE FROM sessions WHERE token = ?', (token,))
            conn.commit()
            return {'success': True}
        finally:
            conn.close()
