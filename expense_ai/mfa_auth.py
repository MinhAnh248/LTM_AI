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
        """Gửi OTP qua email"""
        import os
        
        # Lấy cấu hình email từ environment variables
        smtp_email = os.getenv('SMTP_EMAIL')
        smtp_password = os.getenv('SMTP_PASSWORD')
        
        # Nếu không có cấu hình, in ra console
        if not smtp_email or not smtp_password:
            print(f"\n{'='*50}")
            print(f"📧 OTP Email sent to: {email}")
            print(f"🔐 Your OTP code: {otp}")
            print(f"⏰ Valid for {self.otp_expiry_minutes} minutes")
            print(f"{'='*50}\n")
            return True
        
        # Gửi email thật
        try:
            import smtplib
            from email.mime.text import MIMEText
            from email.mime.multipart import MIMEMultipart
            
            message = MIMEMultipart()
            message['From'] = smtp_email
            message['To'] = email
            message['Subject'] = 'Expense AI - Mã xác thực OTP'
            
            body = f"""
            <html>
                <body style="font-family: Arial, sans-serif;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #667eea;">🔐 Mã xác thực OTP</h2>
                        <p>Xin chào,</p>
                        <p>Mã OTP của bạn là:</p>
                        <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                            {otp}
                        </div>
                        <p>Mã này có hiệu lực trong <strong>{self.otp_expiry_minutes} phút</strong>.</p>
                        <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                        <hr style="margin: 20px 0;">
                        <p style="color: #666; font-size: 12px;">Expense AI - Quản lý chi tiêu thông minh</p>
                    </div>
                </body>
            </html>
            """
            
            message.attach(MIMEText(body, 'html'))
            
            with smtplib.SMTP('smtp.gmail.com', 587) as server:
                server.starttls()
                server.login(smtp_email, smtp_password)
                server.send_message(message)
            
            print(f"✅ OTP sent to {email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send email: {e}")
            print(f"📧 OTP for {email}: {otp}")
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
