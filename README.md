# 🚀 AI Expense Manager

Ứng dụng quản lý chi tiêu thông minh với AI, OCR quét hóa đơn, và phân tích dữ liệu.

## 📋 Yêu cầu

- Python 3.8+
- Node.js 14+
- SQLite (tự động tạo)

## 🎯 Khởi động nhanh - ONE CLICK

```bash
RUN.bat
```

Script sẽ tự động:
- ✅ Khởi động Backend (Flask)
- ✅ Khởi động Frontend (React)
- ✅ Khởi động Cloudflare Tunnel (WAN)
- ✅ Khởi động Load Test UI (Locust)
- ✅ Mở trình duyệt

## 🌐 Truy cập sau khi chạy

- **Frontend**: http://10.67.148.12:3000
- **Backend API**: http://10.67.148.12:5000
- **Load Test**: http://localhost:8089

## 🔑 Đăng nhập

- Email: `admin@example.com`
- Password: `123456`

## 🧪 Load Test 100 Users

1. Chạy `RUN.bat`
2. Mở http://localhost:8089 (tự động mở)
3. Host đã được set sẵn: http://10.67.148.12:5000
4. Number of users: 100
5. Spawn rate: 10
6. Click "Start swarming"

**Kết quả mong đợi:**
- Response time: < 500ms
- Failure rate: 0%
- RPS: > 50

## 📊 Tính năng

- ✅ Quản lý thu nhập & chi tiêu
- ✅ OCR quét hóa đơn (Gemini AI)
- ✅ Phân loại tự động bằng AI
- ✅ Dashboard & biểu đồ
- ✅ Báo cáo & phân tích
- ✅ Cảnh báo ngân sách

## 🗄️ Database

- **Type**: SQLite
- **File**: expense_data.db
- **Tables**: users, sessions, expenses, incomes, budgets, debts, savings_goals, reminders

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
