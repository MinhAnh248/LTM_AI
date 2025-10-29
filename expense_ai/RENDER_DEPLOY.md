# 🚀 Deploy lên Render - Hướng dẫn chi tiết từng bước

## 📋 Chuẩn bị

### Bước 1: Kiểm tra file cần thiết

Đảm bảo có đủ các file:
- ✅ `api_server.py` - Backend
- ✅ `requirements.txt` - Dependencies
- ✅ `render.yaml` - Cấu hình Render
- ✅ `frontend/` - Frontend React

---

## 🔧 Bước 2: Chuẩn bị code

### 2.1. Cập nhật api_server.py

Thêm vào cuối file:

```python
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
```

### 2.2. Kiểm tra requirements.txt

```txt
flask>=2.3
flask-cors>=4.0
gunicorn>=21.2
requests>=2.31
python-dotenv>=1.0
```

### 2.3. Tạo file Procfile (optional)

```
web: gunicorn api_server:app
```

---

## 📤 Bước 3: Push code lên GitHub

### 3.1. Khởi tạo Git (nếu chưa có)

```cmd
cd c:\LTMang_AI\expense_ai
git init
git add .
git commit -m "Initial commit for Render deployment"
```

### 3.2. Tạo repository trên GitHub

1. Truy cập: https://github.com/new
2. Tên repo: `expense-ai`
3. Public hoặc Private
4. Click **Create repository**

### 3.3. Push code

```cmd
git remote add origin https://github.com/YOUR_USERNAME/expense-ai.git
git branch -M main
git push -u origin main
```

---

## 🌐 Bước 4: Deploy Backend trên Render

### 4.1. Đăng ký Render

1. Truy cập: https://render.com
2. Click **Get Started for Free**
3. Đăng nhập bằng GitHub

### 4.2. Tạo Web Service

1. Click **New +** → **Web Service**
2. Chọn **Connect a repository**
3. Tìm và chọn repo `expense-ai`
4. Click **Connect**

### 4.3. Cấu hình Service

**Điền thông tin:**

| Field | Value |
|-------|-------|
| **Name** | `expense-ai-backend` |
| **Region** | Singapore (gần VN nhất) |
| **Branch** | `main` |
| **Root Directory** | `.` (để trống) |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn api_server:app` |
| **Instance Type** | `Free` |

### 4.4. Environment Variables (nếu cần)

Click **Advanced** → **Add Environment Variable**:

```
PYTHON_VERSION = 3.11.0
FLASK_ENV = production
```

### 4.5. Deploy!

1. Click **Create Web Service**
2. Đợi 3-5 phút
3. Render sẽ build và deploy tự động

### 4.6. Lấy URL

Sau khi deploy xong, bạn sẽ có URL:
```
https://expense-ai-backend.onrender.com
```

---

## 🎨 Bước 5: Deploy Frontend trên Render

### 5.1. Tạo Static Site

1. Click **New +** → **Static Site**
2. Chọn repo `expense-ai`
3. Click **Connect**

### 5.2. Cấu hình Static Site

| Field | Value |
|-------|-------|
| **Name** | `expense-ai-frontend` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `build` |

### 5.3. Environment Variables

```
REACT_APP_API_URL = https://expense-ai-backend.onrender.com
```

### 5.4. Deploy!

Click **Create Static Site**

### 5.5. Lấy URL Frontend

```
https://expense-ai-frontend.onrender.com
```

---

## ✅ Bước 6: Kiểm tra

### 6.1. Test Backend

```bash
curl https://expense-ai-backend.onrender.com/api/health
```

Kết quả:
```json
{"status": "ok", "message": "Backend is running"}
```

### 6.2. Test Frontend

Mở trình duyệt:
```
https://expense-ai-frontend.onrender.com
```

### 6.3. Test đầy đủ

1. Đăng nhập: `admin@example.com` / `123456`
2. Thêm expense
3. Xem dashboard
4. Quét hóa đơn

---

## 🔄 Bước 7: Cập nhật code

Khi có thay đổi:

```cmd
git add .
git commit -m "Update features"
git push origin main
```

Render tự động deploy lại!

---

## 🐛 Xử lý lỗi thường gặp

### Lỗi 1: Build failed

**Nguyên nhân:** Thiếu dependencies

**Giải pháp:**
```txt
# requirements.txt phải đầy đủ
flask>=2.3
flask-cors>=4.0
gunicorn>=21.2
requests>=2.31
```

### Lỗi 2: Application failed to start

**Nguyên nhân:** Start command sai

**Giải pháp:**
```
Start Command: gunicorn api_server:app
```

### Lỗi 3: CORS error

**Nguyên nhân:** Frontend không kết nối được Backend

**Giải pháp:**
```python
# api_server.py
CORS(app, origins=['https://expense-ai-frontend.onrender.com'])
```

### Lỗi 4: Port binding failed

**Nguyên nhân:** Không dùng PORT từ environment

**Giải pháp:**
```python
port = int(os.environ.get('PORT', 5000))
app.run(host='0.0.0.0', port=port)
```

---

## 📊 Giám sát

### Xem logs

1. Vào Dashboard Render
2. Chọn service
3. Click **Logs**
4. Xem real-time logs

### Metrics

- CPU usage
- Memory usage
- Request count
- Response time

---

## 💰 Chi phí

### Free Tier bao gồm:

- ✅ 750 giờ/tháng (đủ chạy 24/7)
- ✅ Tự động sleep sau 15 phút không dùng
- ✅ Wake up khi có request (3-5 giây)
- ✅ 100GB bandwidth/tháng
- ✅ SSL miễn phí

### Nâng cấp (nếu cần):

- **Starter:** $7/tháng - Không sleep
- **Standard:** $25/tháng - Nhiều resources hơn

---

## 🎯 Kết quả cuối cùng

Sau khi hoàn thành, bạn có:

### URLs công khai:

```
Backend:  https://expense-ai-backend.onrender.com
Frontend: https://expense-ai-frontend.onrender.com
```

### Tính năng:

- ✅ Mọi người trên thế giới truy cập được
- ✅ HTTPS tự động
- ✅ Tự động deploy khi push code
- ✅ Giống hệt local
- ✅ Miễn phí 100%

---

## 📱 Chia sẻ với người khác

Gửi link cho bạn bè:
```
https://expense-ai-frontend.onrender.com

Login: admin@example.com / 123456
```

Họ có thể:
- ✅ Đăng nhập
- ✅ Thêm chi tiêu
- ✅ Quét hóa đơn
- ✅ Xem thống kê
- ✅ Tất cả tính năng như local!

---

## 🔐 Bảo mật

### Khuyến nghị:

1. **Đổi password mặc định**
2. **Thêm authentication token**
3. **Rate limiting**
4. **CORS cụ thể**
5. **Environment variables cho secrets**

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:

1. Check logs trên Render Dashboard
2. Xem documentation: https://render.com/docs
3. Test local trước khi deploy
4. Đảm bảo code chạy được local

---

## ✨ Hoàn thành!

Giờ đây website của bạn đã online và mọi người có thể truy cập! 🎉
