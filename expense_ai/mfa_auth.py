"""
MFA Authentication Module
Hỗ trợ xác thực 2 yếu tố qua Email OTP
"""
import random
import string
from datetime import datetime, timedelta

class MFAAuth:
    def __init__(self):
        self.otp_storage = {}
        self.otp_expiry_minutes = 5
    
    def generate_otp(self, length=6):
        """Tạo mã OTP ngẫu nhiên"""
        return ''.join(random.choices(string.digits, k=length))
    
    def send_otp_email(self, email, otp):
        """Gửi OTP qua email (demo - in ra console)"""
        print(f"\n{'='*50}")
        print(f"📧 OTP Email sent to: {email}")
        print(f"🔐 Your OTP code: {otp}")
        print(f"⏰ Valid for {self.otp_expiry_minutes} minutes")
        print(f"{'='*50}\n")
        return True
    
    def create_otp(self, email):
        """Tạo và lưu OTP cho email"""
        otp = self.generate_otp()
        expires = datetime.now() + timedelta(minutes=self.otp_expiry_minutes)
        
        self.otp_storage[email] = {
            'otp': otp,
            'expires': expires,
            'verified': False,
            'attempts': 0
        }
        
        self.send_otp_email(email, otp)
        
        return {
            'success': True,
            'message': f'OTP sent to {email}',
            'expires_in': self.otp_expiry_minutes
        }
    
    def verify_otp(self, email, otp):
        """Xác thực OTP"""
        if email not in self.otp_storage:
            return {'success': False, 'message': 'No OTP found'}
        
        stored = self.otp_storage[email]
        
        if datetime.now() > stored['expires']:
            del self.otp_storage[email]
            return {'success': False, 'message': 'OTP expired'}
        
        if stored['attempts'] >= 3:
            del self.otp_storage[email]
            return {'success': False, 'message': 'Too many attempts'}
        
        if stored['otp'] == otp:
            stored['verified'] = True
            return {'success': True, 'message': 'OTP verified'}
        else:
            stored['attempts'] += 1
            return {'success': False, 'message': f'Invalid OTP. {3 - stored["attempts"]} attempts left'}
    
    def is_verified(self, email):
        """Kiểm tra email đã xác thực chưa"""
        if email not in self.otp_storage:
            return False
        return self.otp_storage[email].get('verified', False)

mfa_auth = MFAAuth()
