# 🌐 Hướng dẫn Triển khai Mạng LAN/WAN/VPN

## 📋 Mục lục
1. [LAN - Mạng nội bộ](#1-lan---mạng-nội-bộ)
2. [WAN - Internet công cộng](#2-wan---internet-công-cộng)
3. [VPN - Mạng riêng ảo](#3-vpn---mạng-riêng-ảo)

---

## 1. LAN - Mạng nội bộ

### 🎯 Kịch bản: Dùng trong văn phòng/nhà

### Bước 1: Cấu hình Backend cho LAN

Sửa `api_server.py`:
```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
```

### Bước 2: Tìm IP máy chủ

**Windows:**
```bash
ipconfig
# Tìm IPv4 Address: 192.168.1.100 (ví dụ)
```

**Linux/Mac:**
```bash
ifconfig
# hoặc
ip addr show
```

### Bước 3: Mở Firewall

**Windows:**
```bash
# Mở Windows Defender Firewall
# Add Inbound Rule cho port 5000 và 3000
netsh advfirewall firewall add rule name="Flask API" dir=in action=allow protocol=TCP localport=5000
netsh advfirewall firewall add rule name="React App" dir=in action=allow protocol=TCP localport=3000
```

### Bước 4: Cấu hình Frontend

Sửa `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://192.168.1.100:5000/api';
```

### Bước 5: Build Frontend cho Production

```bash
cd frontend
npm run build
```

### Bước 6: Serve Frontend từ Backend

Cài thêm:
```bash
pip install flask-static-digest
```

Sửa `api_server.py`:
```python
from flask import send_from_directory

# Serve React build
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join('frontend/build', path)):
        return send_from_directory('frontend/build', path)
    else:
        return send_from_directory('frontend/build', 'index.html')
```

### Bước 7: Khởi động

```bash
python api_server.py
```

### Bước 8: Truy cập từ máy khác

```
http://192.168.1.100:5000
```

---

## 2. WAN - Internet công cộng

### 🎯 Kịch bản: Truy cập từ bất kỳ đâu qua Internet

### Phương án A: Sử dụng Ngrok (Nhanh nhất)

#### Bước 1: Cài Ngrok
```bash
# Download từ https://ngrok.com/download
# Hoặc dùng chocolatey
choco install ngrok
```

#### Bước 2: Đăng ký tài khoản Ngrok
- Truy cập: https://dashboard.ngrok.com/signup
- Lấy authtoken

#### Bước 3: Cấu hình Ngrok
```bash
ngrok config add-authtoken YOUR_TOKEN
```

#### Bước 4: Tạo script khởi động

`start_with_ngrok.bat`:
```batch
@echo off
echo Starting Backend...
start "Backend" cmd /k "python api_server.py"
timeout /t 3

echo Starting Ngrok...
start "Ngrok" cmd /k "ngrok http 5000"

echo.
echo Check Ngrok URL at: http://localhost:4040
pause
```

#### Bước 5: Lấy URL công khai
- Mở http://localhost:4040
- Copy URL: `https://abc123.ngrok.io`

#### Bước 6: Cấu hình Frontend
```javascript
const API_BASE_URL = 'https://abc123.ngrok.io/api';
```

### Phương án B: Deploy lên Cloud (Production)

#### Option 1: Heroku (Free tier)

**Bước 1:** Tạo `Procfile`:
```
web: gunicorn api_server:app
```

**Bước 2:** Cài gunicorn:
```bash
pip install gunicorn
pip freeze > requirements.txt
```

**Bước 3:** Deploy:
```bash
heroku login
heroku create expense-ai-app
git push heroku main
```

#### Option 2: Railway.app (Đơn giản hơn)

1. Truy cập: https://railway.app
2. Connect GitHub repo
3. Deploy tự động
4. Lấy URL: `https://expense-ai.railway.app`

#### Option 3: AWS/Azure/GCP (Professional)

**AWS EC2:**
```bash
# 1. Tạo EC2 instance (Ubuntu)
# 2. SSH vào server
ssh -i key.pem ubuntu@ec2-ip

# 3. Cài đặt
sudo apt update
sudo apt install python3-pip nodejs npm
git clone https://github.com/MinhAnh248/LTM_AI.git
cd LTM_AI/expense_ai

# 4. Cài dependencies
pip3 install -r requirements.txt
cd frontend && npm install && npm run build

# 5. Chạy với PM2
sudo npm install -g pm2
pm2 start api_server.py --interpreter python3

# 6. Cấu hình Nginx
sudo apt install nginx
# Tạo config nginx
```

---

## 3. VPN - Mạng riêng ảo

### 🎯 Kịch bản: Kết nối an toàn giữa các văn phòng

### Phương án A: Sử dụng ZeroTier (Đơn giản nhất)

#### Bước 1: Cài ZeroTier

**Windows:**
```bash
# Download: https://www.zerotier.com/download/
```

**Linux:**
```bash
curl -s https://install.zerotier.com | sudo bash
```

#### Bước 2: Tạo Network

1. Đăng ký: https://my.zerotier.com
2. Create Network
3. Lấy Network ID: `abc123def456`

#### Bước 3: Join Network

**Máy chủ:**
```bash
zerotier-cli join abc123def456
```

**Máy client:**
```bash
zerotier-cli join abc123def456
```

#### Bước 4: Authorize trên Dashboard

- Vào https://my.zerotier.com
- Authorize các thiết bị
- Lấy IP ảo: `172.25.0.1` (ví dụ)

#### Bước 5: Cấu hình App

```javascript
const API_BASE_URL = 'http://172.25.0.1:5000/api';
```

### Phương án B: OpenVPN (Professional)

#### Bước 1: Cài OpenVPN Server

**Ubuntu Server:**
```bash
sudo apt update
sudo apt install openvpn easy-rsa
```

#### Bước 2: Tạo certificates

```bash
make-cadir ~/openvpn-ca
cd ~/openvpn-ca
./easyrsa init-pki
./easyrsa build-ca
./easyrsa gen-req server nopass
./easyrsa sign-req server server
```

#### Bước 3: Cấu hình server

Tạo `/etc/openvpn/server.conf`:
```
port 1194
proto udp
dev tun
ca ca.crt
cert server.crt
key server.key
dh dh.pem
server 10.8.0.0 255.255.255.0
push "route 192.168.1.0 255.255.255.0"
keepalive 10 120
cipher AES-256-CBC
user nobody
group nogroup
persist-key
persist-tun
status openvpn-status.log
verb 3
```

#### Bước 4: Tạo client config

```bash
./easyrsa gen-req client1 nopass
./easyrsa sign-req client client1
```

#### Bước 5: Client kết nối

```bash
sudo openvpn --config client.ovpn
```

---

## 🔒 Bảo mật

### 1. HTTPS/SSL

**Sử dụng Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 2. Authentication

Thêm vào `api_server.py`:
```python
from functools import wraps
from flask import request

API_KEY = "your-secret-key-here"

def require_api_key(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        key = request.headers.get('X-API-Key')
        if key != API_KEY:
            return jsonify({'error': 'Invalid API key'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/expenses', methods=['POST'])
@require_api_key
def add_expense():
    # ...
```

### 3. Rate Limiting

```bash
pip install flask-limiter
```

```python
from flask_limiter import Limiter

limiter = Limiter(app, key_func=lambda: request.remote_addr)

@app.route('/api/expenses', methods=['POST'])
@limiter.limit("10 per minute")
def add_expense():
    # ...
```

---

## 📊 So sánh các phương án

| Phương án | Độ khó | Chi phí | Bảo mật | Tốc độ | Phù hợp |
|-----------|--------|---------|---------|--------|---------|
| LAN | ⭐ | Free | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Văn phòng nhỏ |
| Ngrok | ⭐⭐ | Free/Paid | ⭐⭐ | ⭐⭐⭐ | Demo, Test |
| ZeroTier VPN | ⭐⭐ | Free | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Team nhỏ |
| Cloud (Railway) | ⭐⭐ | $5-20/tháng | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Production |
| AWS/Azure | ⭐⭐⭐⭐ | $20-100/tháng | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Enterprise |
| OpenVPN | ⭐⭐⭐⭐⭐ | Free | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Corporate |

---

## 🚀 Khuyến nghị

**Cho nhóm học tập:**
- ✅ LAN (trong phòng lab)
- ✅ Ngrok (demo cho giáo viên)
- ✅ ZeroTier (làm việc nhóm từ xa)

**Cho dự án thực tế:**
- ✅ Railway/Heroku (startup)
- ✅ AWS/Azure (doanh nghiệp)
- ✅ OpenVPN (bảo mật cao)

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Firewall đã mở port chưa
2. IP address đúng chưa
3. CORS đã cấu hình chưa
4. Database connection string đúng chưa
