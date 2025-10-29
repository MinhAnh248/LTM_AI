# 🔐 MFA Authentication Setup

## ✅ Đã thêm xác thực 2 yếu tố (MFA)

### 🎯 Tính năng mới:

1. **Đăng ký với OTP:**
   - User đăng ký → Nhận OTP qua email
   - Nhập OTP để xác thực
   - Hoàn tất đăng ký

2. **Đăng nhập với MFA:**
   - Đăng nhập → Gửi OTP
   - Xác thực OTP
   - Truy cập hệ thống

3. **Bảo mật:**
   - OTP hết hạn sau 5 phút
   - Tối đa 3 lần thử
   - Mỗi email chỉ 1 OTP active

---

## 📋 API Endpoints mới:

### 1. Đăng ký (với OTP)
```http
POST /api/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email",
  "requires_otp": true
}
```

---

### 2. Gửi OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to user@example.com",
  "expires_in": 5
}
```

---

### 3. Xác thực OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Verification successful",
  "token": "token-1",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Response (Failed):**
```json
{
  "success": false,
  "message": "Invalid OTP. 2 attempts left"
}
```

---

## 🔄 Luồng đăng ký mới:

```
1. User nhập email + password
   ↓
2. POST /api/register
   ↓
3. Backend gửi OTP (hiện tại in ra console)
   ↓
4. User nhập OTP
   ↓
5. POST /api/auth/verify-otp
   ↓
6. Xác thực thành công → Nhận token
   ↓
7. Đăng nhập vào hệ thống
```

---

## 🧪 Test MFA:

### Test 1: Đăng ký
```bash
curl -X POST https://ltm-ai.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

### Test 2: Xem OTP trong logs
```
Vào Render Dashboard → Logs
Tìm dòng: "🔐 Your OTP code: 123456"
```

### Test 3: Xác thực OTP
```bash
curl -X POST https://ltm-ai.onrender.com/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

---

## 📧 Cấu hình Email thật (Optional):

Để gửi OTP qua email thật, cập nhật `mfa_auth.py`:

```python
def send_otp_email(self, email, otp):
    import smtplib
    from email.mime.text import MIMEText
    
    # Gmail SMTP
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "your-email@gmail.com"
    sender_password = "your-app-password"  # App password, not regular password
    
    message = MIMEText(f"Your OTP code is: {otp}\nValid for 5 minutes.")
    message['Subject'] = "Expense AI - OTP Verification"
    message['From'] = sender_email
    message['To'] = email
    
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(message)
    
    return True
```

**Lấy App Password từ Gmail:**
1. Google Account → Security
2. 2-Step Verification → App passwords
3. Generate password
4. Copy và dùng

---

## 🔐 Bảo mật nâng cao:

### 1. Hash password
```python
import hashlib

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Khi đăng ký
new_user['password'] = hash_password(password)
```

### 2. JWT Token
```python
import jwt
from datetime import datetime, timedelta

def create_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, 'secret-key', algorithm='HS256')
```

### 3. Rate limiting
```python
from flask_limiter import Limiter

limiter = Limiter(app)

@app.route('/api/auth/send-otp')
@limiter.limit("3 per minute")
def send_otp():
    # ...
```

---

## 📱 Frontend Integration:

### Register Component:
```javascript
// Step 1: Register
const register = async (email, password) => {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, password})
  });
  
  const data = await response.json();
  
  if (data.requires_otp) {
    // Show OTP input
    setShowOTPInput(true);
  }
};

// Step 2: Verify OTP
const verifyOTP = async (email, otp) => {
  const response = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, otp})
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('token', data.token);
    // Redirect to dashboard
  }
};
```

---

## 🚀 Deploy với MFA:

### 1. Cập nhật requirements.txt:
```txt
flask>=2.3
flask-cors>=4.0
gunicorn>=21.2
requests>=2.31
python-dotenv>=1.0
```

### 2. Push lên GitHub:
```bash
cd c:\LTMang_AI
git add .
git commit -m "Add MFA authentication"
git push origin main
```

### 3. Render tự động deploy!

---

## ✅ Checklist:

- [x] MFA module created
- [x] API endpoints added
- [x] OTP generation
- [x] OTP verification
- [x] Expiry handling
- [x] Attempt limiting
- [ ] Email integration (optional)
- [ ] Frontend UI (next step)
- [ ] Password hashing (recommended)
- [ ] JWT tokens (recommended)

---

## 🎯 Kết quả:

Giờ hệ thống có:
- ✅ Đăng ký với xác thực OTP
- ✅ Bảo mật 2 lớp
- ✅ OTP hết hạn tự động
- ✅ Giới hạn số lần thử
- ✅ Ready để tích hợp email thật

**Mọi người phải xác thực OTP mới sử dụng được hệ thống!** 🔐
