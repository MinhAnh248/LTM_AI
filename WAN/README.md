# 🌐 WAN Mode - Internet Public Access

## 🎯 Mục đích

Phiên bản WAN được tối ưu cho truy cập Internet công khai với:
- ✅ Bắt buộc đăng ký tài khoản
- ✅ Xác thực MFA (OTP qua email)
- ✅ Token-based authentication
- ✅ Protected API endpoints
- ✅ Tối ưu bảo mật

---

## 🔐 Tính năng bảo mật

### 1. Đăng ký với OTP
```
User đăng ký → Nhận OTP → Xác thực → Tạo tài khoản
```

### 2. Đăng nhập
```
Email + Password → Nhận token → Truy cập API
```

### 3. Protected Routes
Tất cả API đều yêu cầu token trong header:
```
Authorization: token-123
```

---

## 🚀 Deploy lên Render

### Bước 1: Push lên GitHub

```bash
cd c:\LTMang_AI\WAN
git init
git add .
git commit -m "WAN mode with MFA"
git push origin main
```

### Bước 2: Deploy trên Render

1. Vào https://render.com
2. New → Web Service
3. Chọn repo
4. Root Directory: `WAN`
5. Build: `pip install -r requirements.txt`
6. Start: `gunicorn wan_auth_server:app`
7. Deploy!

---

## 🧪 Test API

### 1. Health Check
```bash
curl https://your-wan-server.onrender.com/api/health
```

### 2. Đăng ký
```bash
curl -X POST https://your-wan-server.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

### 3. Xem OTP trong logs
```
Render Dashboard → Logs → Tìm OTP
```

### 4. Xác thực OTP
```bash
curl -X POST https://your-wan-server.onrender.com/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

### 5. Đăng nhập
```bash
curl -X POST https://your-wan-server.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

### 6. Truy cập API (với token)
```bash
curl https://your-wan-server.onrender.com/api/expenses \
  -H "Authorization: token-1"
```

---

## 📱 Frontend Integration

Frontend cần:
1. Trang đăng ký/đăng nhập
2. Form nhập OTP
3. Lưu token vào localStorage
4. Gửi token trong mọi request

```javascript
// Login
const response = await fetch('/api/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email, password})
});

const data = await response.json();
localStorage.setItem('token', data.token);

// API calls
fetch('/api/expenses', {
  headers: {
    'Authorization': localStorage.getItem('token')
  }
});
```

---

## 🔒 Bảo mật

- ✅ OTP hết hạn sau 5 phút
- ✅ Tối đa 3 lần thử OTP
- ✅ Token-based authentication
- ✅ CORS enabled
- ✅ HTTPS (Render tự động)

---

## 📊 So sánh LAN vs WAN

| Tính năng | LAN | WAN |
|-----------|-----|-----|
| **Truy cập** | Chỉ mạng nội bộ | Internet công khai |
| **Đăng ký** | Không cần | Bắt buộc |
| **MFA** | Không | Có (OTP) |
| **Token** | Không | Có |
| **Bảo mật** | Thấp | Cao |

---

## ✅ Checklist Deploy

- [x] Server code (wan_auth_server.py)
- [x] Requirements.txt
- [x] Render.yaml
- [x] README.md
- [ ] Push lên GitHub
- [ ] Deploy trên Render
- [ ] Test API
- [ ] Deploy Frontend
- [ ] Cấu hình CORS

---

## 🎯 URLs

Sau khi deploy:
- Backend: `https://expense-ai-wan.onrender.com`
- Frontend: `https://expense-ai-wan-frontend.netlify.app`

**Mọi người phải đăng ký và xác thực OTP mới sử dụng được!** 🔐
