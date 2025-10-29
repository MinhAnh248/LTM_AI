# 📧 Cấu hình gửi OTP qua Email

## 🎯 Hiện tại: OTP chỉ hiện trong logs

Để gửi OTP qua email thật, cần cấu hình Gmail SMTP.

---

## 📋 Bước 1: Tạo App Password từ Gmail

### 1.1. Bật 2-Step Verification

1. Vào: https://myaccount.google.com/security
2. Tìm **2-Step Verification**
3. Click **Get Started**
4. Làm theo hướng dẫn để bật

### 1.2. Tạo App Password

1. Vào: https://myaccount.google.com/apppasswords
2. Chọn app: **Mail**
3. Chọn device: **Other** → Nhập: "Expense AI"
4. Click **Generate**
5. Copy mã 16 ký tự (ví dụ: `abcd efgh ijkl mnop`)

---

## 🔧 Bước 2: Thêm Environment Variables

### Trên Render:

1. Dashboard → **LTM_AI**
2. Tab **Environment** (bên trái)
3. Add 2 variables:

```
SMTP_EMAIL = your-email@gmail.com
SMTP_PASSWORD = abcdefghijklmnop
```

4. **Save Changes**
5. Service sẽ tự động redeploy

---

## 🧪 Bước 3: Test gửi email

### Test API:

```bash
curl -X POST https://ltm-ai.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

### Kiểm tra:

1. **Có SMTP config:** Email sẽ được gửi đến `test@example.com`
2. **Không có SMTP config:** OTP hiện trong Render logs

---

## 📝 Bước 4: Cập nhật code (đã làm)

File `mfa_auth.py` đã được cập nhật để:
- ✅ Kiểm tra SMTP_EMAIL và SMTP_PASSWORD
- ✅ Nếu có → Gửi email thật
- ✅ Nếu không → In ra console (như hiện tại)

---

## 🎨 Email template

Email sẽ có dạng:

```
Subject: Expense AI - Mã xác thực OTP

🔐 Mã xác thực OTP

Xin chào,

Mã OTP của bạn là:

┌─────────────┐
│   123456    │
└─────────────┘

Mã này có hiệu lực trong 5 phút.

Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.

────────────────
Expense AI - Quản lý chi tiêu thông minh
```

---

## 🔐 Bảo mật

### ✅ Nên làm:
- Dùng App Password, không dùng password Gmail thật
- Lưu trong Environment Variables, không commit vào code
- Bật 2-Step Verification

### ❌ Không nên:
- Commit SMTP password vào GitHub
- Dùng password Gmail thật
- Share App Password với người khác

---

## 🚀 Deploy với Email

### Push code mới:

```bash
cd c:\LTMang_AI
git add .
git commit -m "Add real email sending for OTP"
git push origin main
```

### Thêm Environment Variables trên Render:

```
SMTP_EMAIL = your-email@gmail.com
SMTP_PASSWORD = your-app-password
```

### Test:

```bash
curl -X POST https://ltm-ai.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"your-real-email@gmail.com","password":"123456"}'
```

Check email inbox!

---

## 🐛 Troubleshooting

### Lỗi 1: "Username and Password not accepted"

**Nguyên nhân:** Dùng password Gmail thật thay vì App Password

**Giải pháp:** Tạo App Password theo hướng dẫn trên

### Lỗi 2: "SMTP Authentication Error"

**Nguyên nhân:** App Password sai hoặc 2-Step Verification chưa bật

**Giải pháp:** 
1. Bật 2-Step Verification
2. Tạo lại App Password
3. Copy đúng 16 ký tự (không có dấu cách)

### Lỗi 3: Email không đến

**Nguyên nhân:** Email vào Spam

**Giải pháp:** Check Spam folder

---

## 📊 So sánh

| Phương án | Ưu điểm | Nhược điểm |
|-----------|---------|------------|
| **Console logs** | Đơn giản, không cần setup | Chỉ admin thấy được |
| **Gmail SMTP** | User nhận email thật | Cần setup App Password |
| **SendGrid** | Professional, analytics | Cần đăng ký service |
| **AWS SES** | Scalable, rẻ | Phức tạp setup |

---

## ✅ Checklist

- [x] Code đã cập nhật
- [ ] Tạo App Password từ Gmail
- [ ] Thêm SMTP_EMAIL vào Render
- [ ] Thêm SMTP_PASSWORD vào Render
- [ ] Push code lên GitHub
- [ ] Test gửi email
- [ ] Check email inbox

---

## 🎯 Kết quả

Sau khi setup:
- ✅ User đăng ký → Nhận OTP qua email
- ✅ Email đẹp với HTML template
- ✅ Bảo mật với App Password
- ✅ Không cần xem logs nữa

**User experience tốt hơn nhiều!** 📧✨
