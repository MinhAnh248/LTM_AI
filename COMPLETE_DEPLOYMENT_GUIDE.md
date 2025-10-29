# 🎉 Hướng dẫn Deploy hoàn chỉnh - WAN Mode với MFA

## ✅ Tình trạng hiện tại:

### Backend (Render):
- ✅ URL: https://ltm-ai.onrender.com
- ✅ Status: Live
- ✅ MFA: Đã có code

### Frontend (Netlify):
- ✅ URL: https://courageous-manatee-534de7.netlify.app
- ⏳ Cần update với AuthPage

---

## 🚀 Bước 1: Cập nhật Backend với MFA

### Push code mới lên GitHub:

```cmd
cd c:\LTMang_AI
git add .
git commit -m "Add MFA authentication for WAN"
git push origin main
```

Render sẽ tự động redeploy!

---

## 🎨 Bước 2: Cập nhật Frontend với AuthPage

### Cách 1: Tự động (Khuyên dùng)

```cmd
c:\LTMang_AI\UPDATE_NETLIFY.bat
```

Script sẽ:
1. ✅ Install dependencies
2. ✅ Build frontend
3. ✅ Mở folder build
4. ✅ Mở Netlify

### Cách 2: Thủ công

```cmd
cd c:\LTMang_AI\expense_ai\frontend
npm install
npm run build
```

Sau đó:
1. Vào https://app.netlify.com
2. Chọn site: **courageous-manatee-534de7**
3. Tab **Deploys**
4. Drag & drop folder `build`
5. Đợi 1-2 phút

---

## 🔧 Bước 3: Cấu hình Environment Variables

### Trên Netlify:

1. Site settings → Environment variables
2. Add variable:
   ```
   REACT_APP_API_URL = https://ltm-ai.onrender.com
   ```
3. Save
4. Trigger deploy

### Trên Render (nếu chưa có):

1. Dashboard → LTM_AI
2. Environment (bên trái)
3. Add variable:
   ```
   GEMINI_API_KEY = AIzaSyBF7jxAXLiAQhmR8UzFBPT9tTcNmQGihhw
   ```
4. Save

---

## 🧪 Bước 4: Test hệ thống

### Test Backend:

```bash
# Health check
curl https://ltm-ai.onrender.com/api/health

# Register
curl -X POST https://ltm-ai.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# Check OTP in Render logs
# Render Dashboard → Logs → Tìm "OTP: 123456"

# Verify OTP
curl -X POST https://ltm-ai.onrender.com/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

### Test Frontend:

1. Mở: https://courageous-manatee-534de7.netlify.app
2. Thấy trang đăng nhập/đăng ký
3. Click "Đăng ký"
4. Nhập email + password
5. Xem OTP trong Render logs
6. Nhập OTP
7. Vào dashboard

---

## 📊 Luồng hoạt động hoàn chỉnh:

```
1. User mở website
   ↓
2. Hiện trang đăng nhập/đăng ký
   ↓
3. User chọn "Đăng ký"
   ↓
4. Nhập email + password → POST /api/register
   ↓
5. Backend gửi OTP (hiện trong logs)
   ↓
6. User nhập OTP → POST /api/auth/verify-otp
   ↓
7. Backend xác thực → Trả token
   ↓
8. Frontend lưu token → Redirect dashboard
   ↓
9. Mọi API call đều gửi token trong header
   ↓
10. Backend kiểm tra token → Cho phép truy cập
```

---

## 🎯 URLs cuối cùng:

### Production:
- **Backend:** https://ltm-ai.onrender.com
- **Frontend:** https://courageous-manatee-534de7.netlify.app

### Test:
- **Health:** https://ltm-ai.onrender.com/api/health
- **Register:** POST https://ltm-ai.onrender.com/api/register
- **Verify:** POST https://ltm-ai.onrender.com/api/auth/verify-otp
- **Login:** POST https://ltm-ai.onrender.com/api/login

---

## 🔐 Tính năng bảo mật:

- ✅ Bắt buộc đăng ký
- ✅ MFA với OTP
- ✅ OTP hết hạn sau 5 phút
- ✅ Tối đa 3 lần thử OTP
- ✅ Token-based authentication
- ✅ Protected routes
- ✅ HTTPS (tự động)
- ✅ CORS configured

---

## 📱 Chia sẻ với người khác:

```
🌐 Expense AI - Quản lý chi tiêu thông minh

Website: https://courageous-manatee-534de7.netlify.app

✨ Tính năng:
- Đăng ký tài khoản với xác thực OTP
- Quản lý chi tiêu cá nhân
- Quét hóa đơn bằng AI
- Thống kê chi tiết
- Bảo mật cao với MFA

🔐 Bảo mật:
- Xác thực 2 yếu tố (OTP)
- Mã hóa HTTPS
- Token authentication
```

---

## 🐛 Troubleshooting:

### Lỗi 1: Frontend không kết nối Backend
**Giải pháp:**
- Check REACT_APP_API_URL trong Netlify
- Rebuild frontend

### Lỗi 2: OTP không nhận được
**Giải pháp:**
- Xem Render logs để lấy OTP
- Trong production, cấu hình SMTP để gửi email thật

### Lỗi 3: CORS error
**Giải pháp:**
- Cập nhật CORS trong backend:
```python
CORS(app, origins=['https://courageous-manatee-534de7.netlify.app'])
```

### Lỗi 4: Token không hoạt động
**Giải pháp:**
- Clear localStorage
- Đăng nhập lại

---

## ✅ Checklist hoàn thành:

- [x] Backend có MFA
- [x] Frontend có AuthPage
- [x] Protected routes
- [x] Deploy Backend (Render)
- [ ] Deploy Frontend (Netlify) ← Làm bước này
- [ ] Test đầy đủ
- [ ] Chia sẻ với người khác

---

## 🎊 Hoàn thành!

Sau khi deploy frontend, bạn có:
- ✅ Website công khai trên Internet
- ✅ Bảo mật với MFA
- ✅ Mọi người phải đăng ký mới dùng được
- ✅ Tất cả tính năng hoạt động

**Chúc mừng bạn đã hoàn thành deploy WAN mode!** 🎉
