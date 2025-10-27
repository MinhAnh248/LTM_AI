# 💰 Expense AI - Ứng dụng Quản lý Chi tiêu với AI

## ✨ Tính năng chính

- 📸 **Quét hóa đơn tự động** với Gemini AI OCR
- 🤖 **Phân loại danh mục thông minh** 
- 📊 **Thống kê chi tiêu trực quan**
- 💾 **Lưu trữ local** không cần internet (trừ OCR)

## 🚀 Cách chạy

1. **Chạy ứng dụng:**
   ```cmd
   cd c:\LTMang_AI\expense_ai
   scripts\RUN_LOCAL.bat
   ```

2. **Truy cập:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

3. **Đăng nhập:**
   - Email: `admin@example.com`
   - Password: `123456`

## 📸 Quét hóa đơn

1. Vào trang "Thêm Chi tiêu"
2. Click "📸 Quét hóa đơn" hoặc kéo thả ảnh
3. AI sẽ tự động đọc thông tin từ hóa đơn
4. Kiểm tra và xác nhận thông tin
5. Lưu chi tiêu

## 🔧 Test API

```cmd
python test_api.py
```

## 📁 Cấu trúc

```
expense_ai/
├── api_server.py          # Backend API
├── frontend/              # React frontend
├── scripts/RUN_LOCAL.bat  # Script chạy ứng dụng
├── test_api.py           # Test API
├── .env                  # API keys (không commit)
└── requirements.txt      # Python dependencies
```

## 🔑 Cấu hình

File `.env` chứa Gemini API key để quét hóa đơn:
```
GEMINI_API_KEY=your_api_key_here
```