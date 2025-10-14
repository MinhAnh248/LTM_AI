# Quick Start Guide

## Chạy WAN (100 người từ mạng khác nhau)

### Cách 1: Tự động (Khuyến nghị)
```bash
python start_wan.py
```

Script sẽ tự động:
1. Khởi động backend
2. Khởi động Cloudflare tunnel
3. Lấy URL public
4. Cập nhật frontend API URL
5. Khởi động frontend

### Cách 2: Thủ công

**Terminal 1 - Backend:**
```bash
python api_server.py
```

**Terminal 2 - Cloudflare:**
```bash
.\cloudflared.exe tunnel --url http://localhost:5000
```
Copy URL (https://xxx.trycloudflare.com)

**Terminal 3 - Update API:**
Mở `frontend\src\services\api.js`:
```javascript
const MODE = 'NGROK';
NGROK: 'https://YOUR-URL.trycloudflare.com/api'
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm start
```

---

## Chạy LAN (mạng nội bộ)

```bash
.\start_all.bat
```

Truy cập: `http://10.67.148.12:3000`

---

## Load Test (100 users)

```bash
.\run_load_test.bat
```

Mở: `http://localhost:8089`
- Host: URL từ Cloudflare
- Users: 100
- Spawn rate: 10

---

## Đăng nhập

- Email: `admin@example.com`
- Password: `123456`
