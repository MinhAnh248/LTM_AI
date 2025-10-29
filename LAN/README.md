# 🌐 LAN Network Mode - Expense AI

## 📋 Mô tả

Chế độ LAN Network cho phép chạy 2 server riêng biệt:
- **Admin Server** (Port 5000): Chỉ truy cập từ LAN
- **Public Server** (Port 8000): Truy cập công khai, có rate limiting

---

## 🚀 Cách chạy

### Cách 1: Double-click file
```
RUN_LAN.bat
```

### Cách 2: Command line
```cmd
cd c:\LTMang_AI\LAN
RUN_LAN.bat
```

---

## 🔐 Phân quyền truy cập

### Admin Server (Port 5000)
- ✅ Truy cập: Chỉ từ LAN
- ✅ Quyền: Full admin control
- ✅ Features:
  - Xem tất cả users
  - Quản lý hệ thống
  - Thống kê toàn bộ
  - Không giới hạn request

**URL:** `http://[YOUR_IP]:5000`

### Public Server (Port 8000)
- ✅ Truy cập: Tất cả thiết bị
- ⚠️ Quyền: Limited access
- ⚠️ Features:
  - Chỉ xem expenses của mình
  - Rate limit: 5 requests/phút
  - Không thể thêm/xóa
  - Demo data only

**URL:** `http://[YOUR_IP]:8000`

---

## 📊 Cấu trúc

```
LAN/
├── admin_server.py      # Admin server (LAN only)
├── public_server.py     # Public server (rate limited)
├── RUN_LAN.bat         # Script chạy cả 2 server
├── start_lan.bat       # Script cũ (deprecated)
└── frontend/
    ├── templates/
    │   └── admin_dashboard.html
    └── static/
        ├── admin.css
        └── admin.js
```

---

## 🔧 Cấu hình Firewall

Nếu không truy cập được từ thiết bị khác:

```cmd
netsh advfirewall firewall add rule name="Admin Server" dir=in action=allow protocol=TCP localport=5000
netsh advfirewall firewall add rule name="Public Server" dir=in action=allow protocol=TCP localport=8000
```

---

## 🧪 Test

### Test Admin Server:
```bash
curl http://localhost:5000/admin/stats
```

### Test Public Server:
```bash
curl http://localhost:8000/api/health
```

---

## ⚙️ Tùy chỉnh

### Thay đổi port:

**admin_server.py:**
```python
app.run(host='0.0.0.0', port=5000, debug=True)
```

**public_server.py:**
```python
app.run(host='0.0.0.0', port=8000, debug=True)
```

### Thay đổi rate limit:

**public_server.py:**
```python
@rate_limit(max_requests=5, window=60)  # 5 requests/60 giây
```

---

## 📝 Login

- **Email:** admin@example.com
- **Password:** 123456

---

## ❓ FAQ

**Q: Tại sao cần 2 server?**
A: Phân quyền rõ ràng - Admin có full quyền, Public bị giới hạn.

**Q: Làm sao biết IP của mình?**
A: Script tự động hiển thị khi chạy, hoặc gõ `ipconfig` trong CMD.

**Q: Thiết bị khác không truy cập được?**
A: Kiểm tra Firewall và đảm bảo cùng WiFi.

---

## 🎯 Kết luận

Hệ thống LAN Network Mode cung cấp:
- ✅ Phân quyền rõ ràng
- ✅ Bảo mật tốt hơn
- ✅ Rate limiting cho public
- ✅ Dễ dàng mở rộng
