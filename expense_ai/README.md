# 🚀 AI Expense Manager

Ứng dụng quản lý chi tiêu thông minh với AI, OCR quét hóa đơn, và phân tích dữ liệu.

## 📋 Yêu cầu

- Python 3.8+
- Node.js 14+
- SQL Server (LAPTOP-F130SI9E\SQLEXPRESS)

## 🎯 Khởi động nhanh

### Cách 1: Dùng file .bat (Windows - Đơn giản nhất)
```bash
start.bat
```

### Cách 2: Dùng Python script
```bash
python start.py
```

### Cách 3: Khởi động thủ công
```bash
# Terminal 1 - Backend
python api_server.py

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🌐 Truy cập

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔑 Đăng nhập

Nhập bất kỳ email/password nào để đăng nhập (không cần xác thực)

## 📊 Tính năng

- ✅ Quản lý thu nhập & chi tiêu
- ✅ OCR quét hóa đơn (Gemini AI)
- ✅ Phân loại tự động bằng AI
- ✅ Dashboard & biểu đồ
- ✅ Báo cáo & phân tích
- ✅ Cảnh báo ngân sách

## 🗄️ Database

- **Server**: LAPTOP-F130SI9E\SQLEXPRESS
- **Database**: ExpenseDB
- **Tables**: expenses, incomes, budgets

## 🛠️ Công cụ hữu ích

```bash
# Xem dữ liệu SQL Server
python view_sqlserver_data.py

# Xóa toàn bộ dữ liệu
python clear_data.py
```

## 📝 Cấu trúc dự án

```
expense_ai/
├── api_server.py          # Flask backend
├── config.py              # SQL Server config
├── ocr_processor.py       # Gemini OCR
├── start.bat              # Khởi động (Windows)
├── start.py               # Khởi động (Python)
├── src/
│   ├── db_factory.py
│   ├── sqlserver_database.py
│   ├── ai_classifier.py
│   └── ai_advisor.py
└── frontend/              # React frontend
    ├── src/
    └── package.json
```

## 🎨 Tech Stack

**Backend:**
- Flask + Flask-CORS
- SQL Server + pyodbc
- Pandas, Scikit-learn
- Google Gemini AI

**Frontend:**
- React + Styled Components
- Recharts (biểu đồ)
- Axios
- React Hot Toast
