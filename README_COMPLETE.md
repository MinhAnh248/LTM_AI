# EXPENSE AI - HỆ THỐNG HOÀN CHỈNH

## 🎯 Tính năng
- ✅ Quản lý chi tiêu, thu nhập
- ✅ Quản lý nợ, tiết kiệm, nhắc nhở
- ✅ OCR quét hóa đơn (Gemini AI)
- ✅ Dashboard với biểu đồ
- ✅ Chạy LAN và WAN

## 📁 Cấu trúc
```
LTMang_AI/
├── expense_ai/
│   ├── api_server.py          # Backend LAN (đầy đủ tính năng)
│   ├── api_server_wan.py      # Backend WAN (đơn giản)
│   ├── frontend/              # React frontend
│   ├── scripts/
│   │   ├── RUN_LAN.bat       # Chạy LAN mode
│   │   └── RUN_ALL.bat       # Chạy WAN mode
│   └── data/
│       └── lan_data.json     # Dữ liệu LAN
├── DEPLOY_WAN.bat            # Deploy lên GitHub
└── README_COMPLETE.md        # File này

```

## 🚀 Chạy LAN Mode (Khuyến nghị)
```bash
cd c:\LTMang_AI\expense_ai\scripts
RUN_LAN.bat
```
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Không cần đăng nhập
- Dữ liệu lưu trong file

## 🌐 Chạy WAN Mode
```bash
cd c:\LTMang_AI\expense_ai\scripts
RUN_ALL.bat
```
- Frontend: https://projectname04.netlify.app
- Backend: https://ltm-ai.onrender.com
- Load Test: http://localhost:8090

## 🔧 Fix WAN (nếu lỗi)
1. Chạy: `c:\LTMang_AI\DEPLOY_WAN.bat`
2. Vào: https://dashboard.render.com/web/srv-d3mt0tm3jp1c73d28150
3. Settings > Start Command
4. Đổi thành: `gunicorn --workers 1 --bind 0.0.0.0:$PORT --chdir expense_ai api_server:app`
5. Save > Manual Deploy

## 📊 Tính năng chi tiết

### LAN Mode
- ✅ Tất cả API endpoints
- ✅ OCR quét hóa đơn (Gemini)
- ✅ Lưu dữ liệu vào file JSON
- ✅ Auto-refresh dashboard
- ✅ Không cần đăng nhập
- ✅ Chạy offline

### WAN Mode
- ✅ Frontend trên Netlify
- ✅ Backend trên Render
- ✅ Load testing với Locust
- ⚠️ Free tier: sleep sau 15 phút
- ⚠️ Wake up: 30-50 giây

## 🎨 Giao diện
- Dashboard với biểu đồ
- Quản lý chi tiêu
- Quản lý thu nhập
- Quản lý nợ
- Quản lý tiết kiệm
- Nhắc nhở thanh toán
- Ngân sách và cảnh báo

## 🔑 Đăng nhập (WAN)
- Email: admin@example.com
- Password: 123456

## 📝 Lưu ý
- LAN mode: Dữ liệu lưu trong `expense_ai/data/lan_data.json`
- WAN mode: Dữ liệu lưu trong memory (mất khi restart)
- Render free tier: Server sleep sau 15 phút không hoạt động
