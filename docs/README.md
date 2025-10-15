# 🚀 AI Expense Manager

Ứng dụng quản lý chi tiêu thông minh với AI, OCR quét hóa đơn, và phân tích dữ liệu.

## 📋 Yêu cầu

- Python 3.8+
- Node.js 14+
- SQLite (tự động tạo)

## 🎯 Khởi động

### Chế độ LAN (Mạng nội bộ)

```bash
RUN_LAN.bat
```

Chạy Backend + Frontend trên LAN
- Mọi người trong cùng WiFi có thể truy cập
- Không giới hạn requests
- Nhanh nhất

### Chế độ Full (LAN + Load Test)

```bash
RUN_ALL.bat
```

Chạy Backend + Frontend + Load Test Monitor

## 🌐 Truy cập

### LAN (Mạng nội bộ):
- Frontend: http://10.67.148.12:3000
- Backend: http://10.67.148.12:5000
- Load Test: http://localhost:8090

### WAN (Internet - Mọi người):
- Frontend: https://projectname04.netlify.app
- Backend: https://ltm-ai.onrender.com

**Hướng dẫn deploy WAN:** Xem file `HUONG_DAN_WAN.md`

## 🔑 Đăng nhập

- Email: `admin@example.com`
- Password: `123456`

## ❓ Câu hỏi thường gặp

Xem file `TRA_LOI_CAU_HOI.md` để biết:
- Data của người dùng lưu ở đâu?
- Làm sao backup data?
- Data có bị mất không?
- Và nhiều câu hỏi khác...

## 🧪 Load Test 100 Users

Vào http://localhost:8090:
- Number of users: `100`
- Spawn rate: `10`
- Click "Start swarming"

**Kết quả mong đợi:**
- RPS: ~20
- Failure rate: < 5%
- Response time: 1-3 giây

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
