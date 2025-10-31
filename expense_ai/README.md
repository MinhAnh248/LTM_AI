# 💰 Expense AI - Ứng dụng Quản lý Chi tiêu với AI

## ✨ Tính năng chính

- 📸 **Quét hóa đơn tự động** với Gemini AI OCR (tích hợp từ Cong-Nghe-OCR-Quet-Hoa-Don)
- 🤖 **Phân loại danh mục thông minh** dựa trên tên cửa hàng
- 📊 **Thống kê chi tiêu trực quan**
- 💾 **Lưu trữ local** không cần internet (trừ OCR)
- 🏪 **Nhận diện cửa hàng** và tự động phân loại

## 🚀 Cách chạy

### Local Mode (Chỉ máy này)
```cmd
cd c:\LTMang_AI\expense_ai
scripts\RUN_LOCAL.bat
```

### WAN Mode (Truy cập từ Internet)
```cmd
# Sử dụng Ngrok
scripts\RUN_WAN.bat

# Hoặc sử dụng Cloudflare Tunnel
scripts\RUN_WAN_CLOUDFLARE.bat
```

📝 Xem hướng dẫn chi tiết: [WAN_SETUP.md](WAN_SETUP.md)

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
# Test các endpoint cơ bản
python test_api.py

# Test OCR với ảnh mẫu
python test_ocr.py
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