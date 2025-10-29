# 🚀 Deploy Render - Repo: https://github.com/MinhAnh248/LTM_AI

## ✅ Bước 1: Truy cập Render

1. Mở: **https://render.com**
2. Click **Get Started for Free**
3. Chọn **Sign in with GitHub**
4. Authorize Render truy cập GitHub

---

## 🔧 Bước 2: Deploy Backend

### 2.1. Tạo Web Service

1. Click **New +** (góc trên bên phải)
2. Chọn **Web Service**
3. Click **Connect a repository**

### 2.2. Chọn Repository

1. Tìm repo: **LTM_AI**
2. Click **Connect**

### 2.3. Cấu hình Service

Điền thông tin như sau:

```
Name: expense-ai-backend
Region: Singapore
Branch: main
Root Directory: expense_ai
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: gunicorn api_server:app
Instance Type: Free
```

### 2.4. Advanced Settings (Optional)

Click **Advanced** → **Add Environment Variable**:

```
PYTHON_VERSION = 3.11.0
FLASK_ENV = production
```

### 2.5. Deploy!

1. Click **Create Web Service**
2. Đợi 3-5 phút
3. Render sẽ tự động:
   - Clone repo
   - Install dependencies
   - Start server

### 2.6. Lấy URL Backend

Sau khi deploy xong, copy URL:
```
https://expense-ai-backend.onrender.com
```

---

## 🎨 Bước 3: Deploy Frontend

### 3.1. Tạo Static Site

1. Click **New +**
2. Chọn **Static Site**
3. Chọn repo **LTM_AI**
4. Click **Connect**

### 3.2. Cấu hình Static Site

```
Name: expense-ai-frontend
Branch: main
Root Directory: expense_ai/frontend
Build Command: npm install && npm run build
Publish Directory: build
```

### 3.3. Environment Variables

Click **Advanced** → **Add Environment Variable**:

```
REACT_APP_API_URL = https://expense-ai-backend.onrender.com
```

### 3.4. Deploy!

1. Click **Create Static Site**
2. Đợi 5-10 phút
3. Frontend sẽ được build và deploy

### 3.5. Lấy URL Frontend

```
https://expense-ai-frontend.onrender.com
```

---

## ✅ Bước 4: Kiểm tra

### 4.1. Test Backend

Mở trình duyệt hoặc dùng curl:

```bash
curl https://expense-ai-backend.onrender.com/api/health
```

Kết quả mong đợi:
```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

### 4.2. Test Frontend

Mở trình duyệt:
```
https://expense-ai-frontend.onrender.com
```

Đăng nhập:
- Email: `admin@example.com`
- Password: `123456`

### 4.3. Test đầy đủ

- ✅ Đăng nhập
- ✅ Thêm expense
- ✅ Xem dashboard
- ✅ Quét hóa đơn
- ✅ Xem thống kê

---

## 🔄 Bước 5: Cập nhật code

Khi có thay đổi trong code:

```bash
cd c:\LTMang_AI
git add .
git commit -m "Update features"
git push origin main
```

**Render tự động deploy lại!** (Auto-deploy)

---

## 🐛 Xử lý lỗi

### Lỗi 1: "Build failed"

**Kiểm tra:**
- File `requirements.txt` có đầy đủ?
- Root Directory đúng chưa? (`expense_ai`)

**Xem logs:**
1. Vào Dashboard Render
2. Click vào service
3. Tab **Logs**

### Lỗi 2: "Application failed to start"

**Kiểm tra Start Command:**
```
gunicorn api_server:app
```

**Kiểm tra PORT:**
```python
# api_server.py
port = int(os.environ.get('PORT', 5000))
app.run(host='0.0.0.0', port=port)
```

### Lỗi 3: "CORS error"

**Cập nhật CORS trong api_server.py:**
```python
CORS(app, origins=[
    'https://expense-ai-frontend.onrender.com',
    'http://localhost:3000'
])
```

### Lỗi 4: Frontend không kết nối Backend

**Kiểm tra Environment Variable:**
```
REACT_APP_API_URL = https://expense-ai-backend.onrender.com
```

**Rebuild frontend:**
1. Vào Dashboard
2. Click **Manual Deploy** → **Clear build cache & deploy**

---

## 📊 Dashboard Render

### Xem thông tin:

1. **Logs:** Real-time logs
2. **Metrics:** CPU, Memory, Requests
3. **Events:** Deploy history
4. **Settings:** Cấu hình service

### Useful commands:

- **Manual Deploy:** Deploy lại thủ công
- **Suspend Service:** Tạm dừng service
- **Delete Service:** Xóa service

---

## 💰 Free Tier Limits

- ✅ 750 giờ/tháng (đủ chạy 24/7)
- ✅ Auto-sleep sau 15 phút không dùng
- ✅ Wake up khi có request (3-5 giây)
- ✅ 100GB bandwidth/tháng
- ✅ SSL/HTTPS miễn phí

---

## 🎯 URLs cuối cùng

Sau khi deploy xong:

```
Backend:  https://expense-ai-backend.onrender.com
Frontend: https://expense-ai-frontend.onrender.com
```

**Chia sẻ với bạn bè:**
```
Truy cập: https://expense-ai-frontend.onrender.com
Login: admin@example.com / 123456
```

---

## 🔐 Bảo mật (Khuyến nghị)

### 1. Đổi password mặc định

```python
# api_server.py
users = [
    {'email': 'admin@example.com', 'password': 'NEW_STRONG_PASSWORD'}
]
```

### 2. Thêm Environment Variables cho secrets

```
GEMINI_API_KEY = your_api_key_here
SECRET_KEY = your_secret_key_here
```

### 3. Rate limiting

```python
from flask_limiter import Limiter
limiter = Limiter(app, key_func=lambda: request.remote_addr)

@app.route('/api/expenses')
@limiter.limit("10 per minute")
def get_expenses():
    # ...
```

---

## 📱 Custom Domain (Optional)

Nếu muốn domain riêng:

1. Mua domain (Namecheap, GoDaddy)
2. Vào Render Dashboard → Settings → Custom Domain
3. Add domain: `expense-ai.com`
4. Cấu hình DNS theo hướng dẫn
5. Đợi SSL certificate (tự động)

---

## ✨ Hoàn thành!

Giờ đây website của bạn:
- ✅ Online 24/7
- ✅ Mọi người trên thế giới truy cập được
- ✅ HTTPS bảo mật
- ✅ Tự động deploy khi push code
- ✅ Giống hệt local
- ✅ Miễn phí 100%

🎉 Chúc mừng bạn đã deploy thành công!
