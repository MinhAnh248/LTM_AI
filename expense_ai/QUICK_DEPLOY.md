# ⚡ Hướng dẫn Deploy Nhanh

## ✅ Đã hoàn thành

Code đã được commit local với message:
```
Update backend with full features: OCR, AI classifier, all endpoints
```

## 🚀 Bước tiếp theo (2 bước đơn giản)

### Bước 1: Push lên GitHub

Mở Git Bash hoặc Command Prompt và chạy:

```bash
cd c:\LTMang_AI\expense_ai
git push origin main
```

Nếu lỗi kết nối, thử:
```bash
# Kiểm tra kết nối internet
ping github.com

# Hoặc dùng SSH thay vì HTTPS
git remote set-url origin git@github.com:MinhAnh248/LTM_AI.git
git push origin main
```

### Bước 2: Deploy trên Render

1. Mở trình duyệt: https://dashboard.render.com
2. Đăng nhập tài khoản
3. Tìm service: **expense-ai** (hoặc tên service của bạn)
4. Click nút: **Manual Deploy** 
5. Chọn: **Deploy latest commit**
6. Đợi 2-3 phút để build và deploy

### Bước 3: Kiểm tra

Sau khi deploy xong (status = Live):

```bash
# Test backend
curl https://ltm-ai.onrender.com/api/health

# Mở frontend
start https://projectname04.netlify.app
```

## 📋 Các thay đổi đã commit

✅ **Backend API** (api_server.py)
- Thêm `/api/scan-receipt` - Quét hóa đơn OCR
- Thêm `/api/predict-category` - AI phân loại
- Thêm `/api/summary` - Tổng hợp chi tiêu
- Thêm `/api/debts` - Quản lý nợ
- Thêm `/api/savings-goals` - Mục tiêu tiết kiệm
- Thêm `/api/reminders` - Nhắc nhở

✅ **OCR Processor** (ocr_processor.py)
- Thêm class OCRProcessor wrapper
- Tích hợp Gemini AI
- Xử lý upload file

✅ **Scripts**
- DEPLOY_BACKEND.bat - Deploy tự động
- TEST_BACKEND.bat - Test local
- RUN_ALL.bat - Chạy WAN + Load Test

✅ **Documentation**
- DEPLOY_RENDER.md
- FIX_WAN_ISSUES.md
- QUICK_DEPLOY.md (file này)

## 🔧 Troubleshooting

### Lỗi: Cannot push to GitHub
```bash
# Kiểm tra remote
git remote -v

# Nếu cần, thêm lại remote
git remote add origin https://github.com/MinhAnh248/LTM_AI.git
```

### Lỗi: Build failed trên Render
- Kiểm tra `requirements.txt` có đầy đủ
- Xem logs trên Render Dashboard
- Đảm bảo Python version = 3.11

### Lỗi: 500 Internal Server Error
- Xem logs chi tiết trên Render
- Kiểm tra database đã init chưa
- Test local trước: `python api_server.py`

## 📞 Nếu cần hỗ trợ

1. Chụp màn hình lỗi
2. Copy logs từ Render Dashboard
3. Kiểm tra Network tab trong Chrome DevTools
