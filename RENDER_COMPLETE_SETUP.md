# ✅ Backend đã Live! Hoàn thiện setup

## 🎉 Backend Status: LIVE

**URL:** https://ltm-ai.onrender.com  
**Status:** ✅ Running  
**Service ID:** srv-d3mt0tm3jp1c73d28150

---

## 🔧 Bước 1: Thêm Environment Variable (Quan trọng!)

### Tại sao cần?
```
Warning: OCR processor not available: GEMINI_API_KEY not found
```

### Cách thêm:

1. Vào Dashboard Render: https://dashboard.render.com
2. Chọn service **LTM_AI**
3. Click tab **Environment** (bên trái)
4. Click **Add Environment Variable**
5. Thêm:

```
Key: GEMINI_API_KEY
Value: AIzaSyBF7jxAXLiAQhmR8UzFBPT9tTcNmQGihhw
```

6. Click **Save Changes**
7. Service sẽ tự động redeploy (1-2 phút)

---

## 🧪 Test Backend

### Test 1: Health Check
```bash
curl https://ltm-ai.onrender.com/api/health
```

Kết quả:
```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

### Test 2: Root endpoint
```
https://ltm-ai.onrender.com
```

Kết quả:
```json
{
  "message": "Expense AI API",
  "status": "running"
}
```

### Test 3: Login
```bash
curl -X POST https://ltm-ai.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123456"}'
```

---

## 🎨 Bước 2: Deploy Frontend

### Option A: Render Static Site (Khuyên dùng)

1. Vào Dashboard Render
2. Click **New +** → **Static Site**
3. Chọn repo: **LTM_AI**
4. Cấu hình:

```
Name: ltm-ai-frontend
Branch: main
Root Directory: expense_ai/frontend
Build Command: npm install && npm run build
Publish Directory: build
```

5. **Environment Variables:**

```
REACT_APP_API_URL = https://ltm-ai.onrender.com
```

6. Click **Create Static Site**
7. Đợi 5-10 phút

**URL Frontend:** `https://ltm-ai-frontend.onrender.com`

---

### Option B: Netlify (Nhanh hơn, CDN tốt hơn)

#### Bước 1: Build frontend local

```cmd
cd c:\LTMang_AI\expense_ai\frontend
npm install
npm run build
```

#### Bước 2: Cập nhật API URL

Tạo file `.env.production`:

```env
REACT_APP_API_URL=https://ltm-ai.onrender.com
```

Rebuild:
```cmd
npm run build
```

#### Bước 3: Deploy lên Netlify

1. Truy cập: https://app.netlify.com
2. Đăng nhập bằng GitHub
3. Click **Add new site** → **Deploy manually**
4. Drag & drop folder `build`
5. Đợi 1-2 phút

**URL Frontend:** `https://your-site-name.netlify.app`

#### Bước 4: Custom domain (Optional)

1. Click **Domain settings**
2. **Change site name** → Đặt tên: `ltm-ai-frontend`
3. URL mới: `https://ltm-ai-frontend.netlify.app`

---

## 🔄 Auto-Deploy đã bật

Mỗi khi push code lên GitHub:
```bash
git add .
git commit -m "Update features"
git push origin main
```

Render tự động deploy lại! ✅

---

## 📊 Monitoring

### Xem Logs:
1. Dashboard → **LTM_AI**
2. Tab **Logs**
3. Real-time logs

### Xem Metrics:
1. Tab **Metrics**
2. CPU, Memory, Requests

### Xem Events:
1. Tab **Events**
2. Deploy history

---

## 🌐 URLs cuối cùng

### Hiện tại:
- ✅ Backend: `https://ltm-ai.onrender.com`
- ⏳ Frontend: Chưa deploy

### Sau khi deploy frontend:
- ✅ Backend: `https://ltm-ai.onrender.com`
- ✅ Frontend: `https://ltm-ai-frontend.onrender.com` hoặc `https://ltm-ai-frontend.netlify.app`

---

## 📱 Chia sẻ với người khác

Sau khi deploy frontend, gửi link:

```
🌐 Expense AI - Quản lý chi tiêu thông minh

Truy cập: https://ltm-ai-frontend.netlify.app

📧 Login: admin@example.com
🔑 Password: 123456

✨ Tính năng:
- Quản lý chi tiêu
- Quét hóa đơn bằng AI
- Thống kê chi tiết
- Đa thiết bị
```

---

## ⚠️ Lưu ý Free Tier

### Giới hạn:
- ✅ 750 giờ/tháng (đủ chạy 24/7)
- ⚠️ Auto-sleep sau 15 phút không dùng
- ⏱️ Wake up: 3-5 giây khi có request đầu tiên
- ✅ 100GB bandwidth/tháng

### Tránh sleep:
1. Upgrade lên Starter ($7/tháng)
2. Hoặc dùng cron job ping mỗi 10 phút:
   ```
   https://cron-job.org
   ```

---

## 🔐 Bảo mật (Khuyến nghị)

### 1. Đổi password mặc định

Vào code, thay đổi:
```python
users = [
    {'email': 'admin@example.com', 'password': 'NEW_STRONG_PASSWORD'}
]
```

### 2. Thêm CORS cụ thể

```python
CORS(app, origins=[
    'https://ltm-ai-frontend.onrender.com',
    'https://ltm-ai-frontend.netlify.app'
])
```

### 3. Rate limiting

```python
from flask_limiter import Limiter
limiter = Limiter(app)

@app.route('/api/expenses')
@limiter.limit("10 per minute")
def get_expenses():
    # ...
```

---

## 🐛 Troubleshooting

### Lỗi 1: Service không start
- Check logs
- Verify Start Command: `cd expense_ai && gunicorn --workers 1 --bind 0.0.0.0:$PORT api_server:app`

### Lỗi 2: CORS error
- Thêm frontend URL vào CORS
- Redeploy backend

### Lỗi 3: OCR không hoạt động
- Thêm GEMINI_API_KEY vào Environment
- Redeploy

### Lỗi 4: Slow response
- Free tier sleep sau 15 phút
- Upgrade hoặc dùng cron job

---

## 📞 Support

- Render Docs: https://render.com/docs
- Render Status: https://status.render.com
- Community: https://community.render.com

---

## ✨ Hoàn thành!

Backend đã online! Giờ chỉ cần deploy frontend là xong! 🎉
