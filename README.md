# 🚀 AI Expense Manager

Ứng dụng quản lý chi tiêu thông minh với AI, OCR quét hóa đơn, và phân tích dữ liệu.

## 📋 Yêu cầu

- Python 3.8+
- Node.js 14+
- SQLite (tự động tạo)

## 🎯 Khởi động Local

```bash
RUN.bat
```

- **Frontend**: http://10.67.148.12:3000
- **Backend**: http://10.67.148.12:5000
- **Load Test**: http://localhost:8089

## 🌐 Deploy WAN (Render - FREE)

```bash
deploy_render.bat
```

Làm theo hướng dẫn trong file `DEPLOY_WAN.md`

## 🔑 Đăng nhập

- Email: `admin@example.com`
- Password: `123456`

## 🧪 Load Test 100 Users

```bash
python test_100_users.py
```

- Host: URL từ Render hoặc `http://10.67.148.12:5000`
- Users: 100
- Spawn rate: 10

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

## 🎨 Tech Stack

**Backend:**
- Flask + Flask-CORS
- SQLite
- Pandas, Scikit-learn
- Google Gemini AI (OCR)

**Frontend:**
- React
- Recharts
- Axios
- Styled Components
