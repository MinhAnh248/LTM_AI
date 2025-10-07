# Hướng dẫn Setup nhanh cho Team

## Bước 1: Clone repository
```bash
git clone <repository-url>
cd expense_ai
```

## Bước 2: Cài đặt Python dependencies
```bash
pip install -r requirements.txt
pip install -r requirements_ocr.txt
```

## Bước 3: Cài đặt Tesseract OCR

**Windows:**
- Tải: https://github.com/UB-Mannheim/tesseract/wiki
- Cài vào: `C:\Program Files\Tesseract-OCR\`
- Tải `vie.traineddata` cho tiếng Việt

## Bước 4: Cài đặt Frontend
```bash
cd frontend
npm install
cd ..
```

## Bước 5: Database đã có sẵn!
✅ File `expense_data.db` đã được tạo sẵn trong repository
✅ Không cần chạy thêm lệnh nào

## Bước 6: Chạy ứng dụng

**Windows:**
```bash
start.bat
```

**Hoặc chạy thủ công:**
```bash
# Terminal 1 - Backend
python api_server.py

# Terminal 2 - Frontend  
cd frontend
npm start
```

## Truy cập:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Nếu cần tạo lại database:
```bash
python create_db.py
```

Xong! Đơn giản vậy thôi 🎉
