# 🔧 Sửa lỗi các chức năng không hoạt động trên WAN

## ❌ Vấn đề hiện tại

Frontend trên Netlify (https://projectname04.netlify.app) không thể:
- ❌ Thêm chi tiêu mới
- ❌ Quét hóa đơn OCR
- ❌ Các tính năng khác

## 🔍 Nguyên nhân

Backend trên Render.com (https://ltm-ai.onrender.com) đang chạy code CŨ:
- Thiếu API endpoints: `/api/scan-receipt`, `/api/predict-category`
- Thiếu xử lý OCR
- Thiếu các tính năng mới

## ✅ Giải pháp (3 bước)

### Bước 1: Test Backend Local

```bash
# Chạy script test
cd c:\LTMang_AI\expense_ai\scripts
TEST_BACKEND.bat
```

Nếu thấy JSON response → Backend local OK!

### Bước 2: Push Code lên GitHub

```bash
# Chạy script deploy
cd c:\LTMang_AI\expense_ai\scripts
DEPLOY_BACKEND.bat
```

Script sẽ tự động:
1. Git add tất cả thay đổi
2. Commit với message
3. Push lên GitHub

### Bước 3: Deploy trên Render

1. Mở: https://dashboard.render.com
2. Chọn service: **expense-ai**
3. Click: **Manual Deploy** → **Deploy latest commit**
4. Đợi 2-3 phút

### Bước 4: Kiểm tra WAN

Sau khi deploy xong, test:

```bash
# Health check
curl https://ltm-ai.onrender.com/api/health

# Nếu OK, mở frontend
start https://projectname04.netlify.app
```

## 📋 Checklist các thay đổi

✅ **api_server.py**
- [x] Thêm `/api/scan-receipt` - Quét hóa đơn
- [x] Thêm `/api/predict-category` - AI phân loại
- [x] Thêm `/api/summary` - Tổng hợp
- [x] Thêm `/api/debts` - Quản lý nợ
- [x] Thêm `/api/savings-goals` - Tiết kiệm
- [x] Thêm `/api/reminders` - Nhắc nhở

✅ **ocr_processor.py**
- [x] Thêm class `OCRProcessor` wrapper
- [x] Tích hợp Gemini AI OCR
- [x] Xử lý upload file

✅ **Scripts**
- [x] `TEST_BACKEND.bat` - Test local
- [x] `DEPLOY_BACKEND.bat` - Deploy tự động

## 🚨 Lưu ý quan trọng

1. **Render Free Tier**: 
   - Backend sleep sau 15 phút không dùng
   - Lần đầu truy cập sau sleep mất ~30 giây
   - Giải pháp: Dùng Load Test để keep-alive

2. **Database SQLite**:
   - Data sẽ MẤT khi redeploy
   - Cần migrate sang PostgreSQL nếu muốn lưu lâu dài

3. **Gemini API Key**:
   - Đã hardcode trong `ocr_processor.py`
   - Nên chuyển sang Environment Variable

## 🔄 Nếu vẫn lỗi

### Lỗi 1: "Module not found"
```bash
# Kiểm tra requirements.txt
pip install -r requirements.txt
```

### Lỗi 2: "500 Internal Server Error"
```bash
# Xem logs trên Render
# Dashboard > expense-ai > Logs tab
```

### Lỗi 3: "CORS Error"
```bash
# Đã fix trong api_server.py
# CORS(app) cho phép tất cả origins
```

### Lỗi 4: "Unauthorized 401"
```bash
# Cần login trước
# Frontend tự động lưu token
```

## 📞 Support

Nếu vẫn gặp vấn đề:
1. Check logs trên Render Dashboard
2. Test API bằng Postman/curl
3. Kiểm tra Network tab trong Chrome DevTools
