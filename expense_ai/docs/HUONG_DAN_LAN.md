# HƯỚNG DẪN CHẠY HỆ THỐNG TRÊN MẠNG LAN

## 🎯 Mục đích
Cho phép nhiều thiết bị trong cùng mạng WiFi/LAN truy cập ứng dụng Expense AI từ máy chủ của bạn.

---

## 📋 Yêu cầu

### 1. Tất cả thiết bị phải cùng mạng WiFi
**Vì sao?** LAN (Local Area Network) chỉ hoạt động trong cùng 1 mạng nội bộ. Các thiết bị khác mạng không thể kết nối với nhau.

### 2. Biết địa chỉ IP của máy chủ
**Vì sao?** Các thiết bị khác cần biết "địa chỉ nhà" của máy chủ để gửi request đến đúng nơi.

**Cách kiểm tra IP:**
```cmd
ipconfig
```
Tìm dòng `IPv4 Address` trong phần `Wireless LAN adapter Wi-Fi`
Ví dụ: `10.67.148.12`

---

## 🚀 Các bước thực hiện

### Bước 1: Cấu hình Backend (Flask API)

**File cần sửa:** `api_server.py` (hoặc file chạy Flask)

```python
if __name__ == '__main__':
    app.run(
        host='0.0.0.0',  # Quan trọng! Cho phép truy cập từ mọi IP
        port=5000,
        debug=True
    )
```

**Giải thích:**
- `host='0.0.0.0'`: Lắng nghe trên TẤT CẢ network interfaces
  - Nếu để `127.0.0.1` hoặc `localhost`: CHỈ máy chủ truy cập được
  - Với `0.0.0.0`: Mọi thiết bị trong mạng đều truy cập được
- `port=5000`: Cổng mà backend lắng nghe

---

### Bước 2: Cấu hình Frontend (React)

**File cần sửa:** `frontend/src/services/api.js`

```javascript
const API_URLS = {
    LOCAL: 'http://localhost:5000/api',
    LAN: 'http://10.67.148.12:5000/api',  // Thay IP máy chủ của bạn
};

const MODE = 'LAN';  // Đổi từ 'LOCAL' sang 'LAN'
```

**Giải thích:**
- Frontend cần biết địa chỉ chính xác của backend
- `localhost` chỉ hoạt động trên chính máy đó
- Phải dùng IP thực (VD: `10.67.148.12`) để các thiết bị khác kết nối được

---

### Bước 3: Cấu hình Windows Firewall

**Vì sao cần?** Windows Firewall mặc định chặn các kết nối từ bên ngoài vào máy tính.

**Cách mở:**

#### Cách 1: Dùng lệnh (Nhanh)
```cmd
netsh advfirewall firewall add rule name="Flask Backend" dir=in action=allow protocol=TCP localport=5000
netsh advfirewall firewall add rule name="React Frontend" dir=in action=allow protocol=TCP localport=3000
```

#### Cách 2: Giao diện (Chi tiết)
1. Mở `Windows Defender Firewall with Advanced Security`
2. Click `Inbound Rules` → `New Rule`
3. Chọn `Port` → Next
4. Chọn `TCP` → Nhập port `5000` → Next
5. Chọn `Allow the connection` → Next
6. Chọn tất cả (Domain, Private, Public) → Next
7. Đặt tên: "Flask Backend" → Finish
8. Lặp lại cho port `3000`

**Giải thích:**
- `Inbound Rules`: Quy tắc cho kết nối VÀO máy tính
- Port `5000`: Backend API
- Port `3000`: Frontend React Dev Server

---

### Bước 4: Chạy hệ thống

**Chạy file:** `scripts/RUN_LAN.bat`

Script này sẽ:
1. Dọn dẹp các process cũ trên port 5000 và 3000
2. Khởi động Backend trên `0.0.0.0:5000`
3. Khởi động Frontend trên `0.0.0.0:3000`
4. Tự động mở browser

---

## 🌐 Truy cập từ thiết bị khác

### Từ máy tính/laptop khác:
```
http://10.67.148.12:3000
```

### Từ điện thoại:
1. Kết nối cùng WiFi với máy chủ
2. Mở trình duyệt
3. Nhập: `http://10.67.148.12:3000`

---

## 🔍 Khắc phục sự cố

### Lỗi: "Cannot connect to server"

**Nguyên nhân 1:** Không cùng mạng WiFi
- **Giải pháp:** Kiểm tra lại kết nối WiFi

**Nguyên nhân 2:** Firewall chặn
- **Giải pháp:** Kiểm tra lại Firewall rules (Bước 3)

**Nguyên nhân 3:** Backend chưa chạy
- **Giải pháp:** Kiểm tra cửa sổ cmd Backend có đang chạy không

**Nguyên nhân 4:** Sai IP
- **Giải pháp:** Chạy lại `ipconfig` để lấy IP mới (IP có thể thay đổi)

### Lỗi: "CORS error"

**Nguyên nhân:** Backend chưa cho phép CORS từ IP khác

**Giải pháp:** Thêm vào `api_server.py`:
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

---

## 📊 So sánh các chế độ

| Chế độ | Host | Truy cập | Sử dụng |
|--------|------|----------|---------|
| **LOCAL** | `127.0.0.1` | Chỉ máy chủ | Dev cá nhân |
| **LAN** | `0.0.0.0` | Cùng WiFi | Team nội bộ |
| **WAN** | `0.0.0.0` + Ngrok | Internet | Public |

---

## ⚠️ Lưu ý bảo mật

1. **Chỉ dùng trong mạng tin cậy:** LAN mode không có mã hóa
2. **Đổi mật khẩu mặc định:** `admin@example.com / 123456`
3. **Tắt khi không dùng:** Đóng các cửa sổ cmd để dừng server
4. **Không mở Firewall cho Public network:** Chỉ mở cho Private/Domain

---

## 🎓 Kiến thức bổ sung

### Tại sao phải dùng `0.0.0.0`?

```
127.0.0.1 (localhost)  →  Chỉ máy chủ
0.0.0.0               →  Tất cả network interfaces
                          ├─ 127.0.0.1 (loopback)
                          ├─ 10.67.148.12 (WiFi)
                          └─ 192.168.x.x (Ethernet)
```

### Cách hoạt động của LAN:

```
[Điện thoại]  ──WiFi──┐
                      │
[Laptop]      ──WiFi──┼──[Router]──[Internet]
                      │
[Máy chủ]     ──WiFi──┘
(10.67.148.12:5000)
```

Tất cả thiết bị kết nối qua Router, có thể giao tiếp với nhau trong mạng nội bộ.

---

## ✅ Checklist

- [ ] Kiểm tra IP máy chủ: `ipconfig`
- [ ] Backend chạy với `host='0.0.0.0'`
- [ ] Frontend config `LAN` mode với IP đúng
- [ ] Firewall mở port 5000 và 3000
- [ ] Tất cả thiết bị cùng WiFi
- [ ] Test truy cập từ thiết bị khác

---

**Hoàn thành!** Giờ bạn có thể chia sẻ ứng dụng với mọi người trong cùng mạng WiFi! 🎉
