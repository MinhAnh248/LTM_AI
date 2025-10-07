# Hướng dẫn cài đặt Expense AI

## Yêu cầu hệ thống
- Python 3.8+
- Node.js 14+
- Tesseract OCR

## Bước 1: Clone repository
```bash
git clone <repository-url>
cd expense_ai
```

## Bước 2: Cài đặt Backend

### 2.1. Tạo virtual environment (khuyến nghị)
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

### 2.2. Cài đặt Python dependencies
```bash
pip install -r requirements.txt
pip install -r requirements_ocr.txt
```

### 2.3. Cài đặt Tesseract OCR

**Windows:**
1. Tải Tesseract từ: https://github.com/UB-Mannheim/tesseract/wiki
2. Cài đặt vào `C:\Program Files\Tesseract-OCR\`
3. Tải Vietnamese language data:
   - Tải `vie.traineddata` từ: https://github.com/tesseract-ocr/tessdata
   - Copy vào `C:\Program Files\Tesseract-OCR\tessdata\`

**Linux:**
```bash
sudo apt-get install tesseract-ocr tesseract-ocr-vie
```

**Mac:**
```bash
brew install tesseract tesseract-lang
```

### 2.4. Khởi tạo Database
```bash
python init_database.py
```

Lệnh này sẽ tạo file `expense_data.db` với tất cả các bảng cần thiết.

## Bước 3: Cài đặt Frontend

```bash
cd frontend
npm install
```

## Bước 4: Chạy ứng dụng

### Cách 1: Sử dụng file batch (Windows)
```bash
start.bat
```

### Cách 2: Chạy thủ công

**Terminal 1 - Backend:**
```bash
python api_server.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Bước 5: Truy cập ứng dụng

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Tính năng chính

✅ Quản lý chi tiêu với AI phân loại tự động
✅ Quét hóa đơn bằng OCR (Tesseract)
✅ Quản lý thu nhập
✅ Cảnh báo ngân sách
✅ Quản lý nợ
✅ Mục tiêu tiết kiệm
✅ Nhắc nhở thanh toán
✅ Báo cáo và phân tích

## Xử lý lỗi thường gặp

### Lỗi: "Tesseract OCR not available"
- Kiểm tra Tesseract đã được cài đặt
- Kiểm tra đường dẫn trong `tesseract_ocr.py` (dòng 16)

### Lỗi: "No module named 'flask'"
```bash
pip install -r requirements.txt
```

### Lỗi: "npm: command not found"
- Cài đặt Node.js từ: https://nodejs.org/

### Lỗi database
```bash
# Xóa database cũ và tạo lại
del expense_data.db
python init_database.py
```

## Cấu trúc dự án

```
expense_ai/
├── src/                    # Backend modules
│   ├── auth.py            # Authentication
│   ├── income_manager.py  # Income management
│   ├── debt_manager.py    # Debt tracking
│   ├── savings_manager.py # Savings goals
│   └── ...
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   └── services/     # API services
│   └── package.json
├── api_server.py         # Main API server
├── tesseract_ocr.py      # OCR processor
├── init_database.py      # Database initialization
├── requirements.txt      # Python dependencies
└── start.bat            # Quick start script

```

## Liên hệ hỗ trợ

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub hoặc liên hệ team.
