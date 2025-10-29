# 🌍 Deploy WAN - Hướng dẫn đưa website lên Internet

## 🎯 Mục tiêu
Cho phép **TẤT CẢ MỌI NGƯỜI** trên Internet truy cập website, giống như chạy local.

---

## 📊 So sánh các phương án

| Phương án | Miễn phí | Dễ dùng | Tốc độ | Phù hợp |
|-----------|----------|---------|--------|---------|
| **Render** | ✅ | ⭐⭐⭐⭐⭐ | Trung bình | Khuyên dùng |
| **Netlify** | ✅ | ⭐⭐⭐⭐ | Nhanh | Frontend only |
| **Vercel** | ✅ | ⭐⭐⭐⭐ | Rất nhanh | Frontend + API |
| **Railway** | ✅ | ⭐⭐⭐⭐ | Nhanh | Full-stack |
| **Ngrok** | ✅ | ⭐⭐⭐ | Chậm | Test nhanh |

---

## 🚀 Phương án 1: Render (KHUYÊN DÙNG)

### Ưu điểm:
- ✅ Hoàn toàn miễn phí
- ✅ Deploy cả Backend + Frontend
- ✅ Tự động SSL (HTTPS)
- ✅ Database miễn phí
- ✅ URL công khai: `https://your-app.onrender.com`

### Bước 1: Chuẩn bị code

**Tạo file `requirements.txt`:**
```txt
flask>=2.3
flask-cors>=4.0
gunicorn>=21.2
requests>=2.31
python-dotenv>=1.0
```

**Tạo file `render.yaml`:**
```yaml
services:
  - type: web
    name: expense-ai-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn api_server:app
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

### Bước 2: Push code lên GitHub

```bash
cd c:\LTMang_AI\expense_ai
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/expense-ai.git
git push -u origin main
```

### Bước 3: Deploy trên Render

1. Truy cập: https://render.com
2. Đăng ký tài khoản (dùng GitHub)
3. Click **New** → **Web Service**
4. Chọn repository: `expense-ai`
5. Cấu hình:
   - **Name:** expense-ai
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn api_server:app`
6. Click **Create Web Service**

### Bước 4: Deploy Frontend

**Netlify (Frontend):**
1. Truy cập: https://netlify.com
2. Drag & drop folder `expense_ai/frontend/build`
3. Nhận URL: `https://your-app.netlify.app`

**Cập nhật API URL trong frontend:**
```javascript
// frontend/src/config.js
const API_URL = 'https://expense-ai.onrender.com';
```

---

## 🚀 Phương án 2: Ngrok (Test nhanh)

### Ưu điểm:
- ✅ Cực kỳ đơn giản
- ✅ Không cần deploy
- ✅ Có URL ngay lập tức

### Nhược điểm:
- ⚠️ URL thay đổi mỗi lần chạy
- ⚠️ Phải giữ máy tính bật
- ⚠️ Tốc độ phụ thuộc mạng nhà

### Cách dùng:

**Bước 1: Tải Ngrok**
```
https://ngrok.com/download
```

**Bước 2: Chạy Backend local**
```cmd
cd c:\LTMang_AI\expense_ai
python api_server.py
```

**Bước 3: Tạo tunnel**
```cmd
ngrok http 5000
```

**Kết quả:**
```
Forwarding: https://abc123.ngrok.io -> http://localhost:5000
```

Giờ mọi người có thể truy cập: `https://abc123.ngrok.io`

---

## 🚀 Phương án 3: Railway

### Bước 1: Tạo file cấu hình

**railway.json:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "gunicorn api_server:app",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Bước 2: Deploy

1. Truy cập: https://railway.app
2. Đăng nhập GitHub
3. **New Project** → **Deploy from GitHub**
4. Chọn repo `expense-ai`
5. Railway tự động deploy

**URL:** `https://expense-ai-production.up.railway.app`

---

## 🚀 Phương án 4: Vercel (Frontend + API)

### Bước 1: Cấu hình

**vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api_server.py",
      "use": "@vercel/python"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api_server.py"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

### Bước 2: Deploy

```bash
npm install -g vercel
cd c:\LTMang_AI\expense_ai
vercel
```

**URL:** `https://expense-ai.vercel.app`

---

## 📋 Script tự động deploy

**DEPLOY_WAN.bat:**
```batch
@echo off
title Deploy to WAN
color 0E

echo ========================================
echo   DEPLOY EXPENSE AI TO WAN
echo ========================================
echo.

echo [1/4] Installing dependencies...
pip install -r requirements.txt

echo [2/4] Building frontend...
cd frontend
npm install
npm run build

echo [3/4] Testing locally...
cd ..
start python api_server.py
timeout /t 5
curl http://localhost:5000/api/health

echo [4/4] Ready to deploy!
echo.
echo Choose deployment platform:
echo 1. Render (Recommended)
echo 2. Railway
echo 3. Vercel
echo 4. Ngrok (Quick test)
echo.

pause
```

---

## 🔐 Bảo mật khi deploy WAN

### 1. Thêm authentication
```python
from functools import wraps
from flask import request, jsonify

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or token != 'your-secret-token':
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/expenses', methods=['POST'])
@require_auth
def create_expense():
    # ...
```

### 2. Rate limiting
```python
from flask_limiter import Limiter

limiter = Limiter(app, key_func=lambda: request.remote_addr)

@app.route('/api/expenses')
@limiter.limit("10 per minute")
def get_expenses():
    # ...
```

### 3. CORS cụ thể
```python
CORS(app, origins=['https://your-frontend.netlify.app'])
```

---

## 🎯 Kết luận

### Khuyến nghị:

**Cho production (dùng lâu dài):**
- Backend: **Render** (miễn phí, ổn định)
- Frontend: **Netlify** (nhanh, CDN toàn cầu)
- Database: **Render PostgreSQL** (miễn phí)

**Cho test nhanh:**
- **Ngrok** (5 phút có URL)

**URL cuối cùng:**
- Frontend: `https://expense-ai.netlify.app`
- Backend: `https://expense-ai.onrender.com`

Mọi người trên thế giới có thể truy cập!

---

## 📞 Hỗ trợ

Nếu gặp lỗi khi deploy, check:
1. `requirements.txt` đầy đủ
2. Port đúng (Render dùng `$PORT`)
3. Database connection string
4. CORS settings
5. Environment variables
