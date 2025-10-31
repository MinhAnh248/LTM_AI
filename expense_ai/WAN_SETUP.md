# 🌐 Hướng dẫn Setup WAN Mode

## Cách 1: Sử dụng Ngrok (Khuyến nghị - Miễn phí)

### Bước 1: Cài đặt Ngrok
1. Truy cập: https://ngrok.com/download
2. Tải ngrok cho Windows
3. Giải nén file `ngrok.exe`
4. Di chuyển `ngrok.exe` vào thư mục dễ truy cập (ví dụ: `C:\ngrok\`)

### Bước 2: Đăng ký tài khoản
1. Truy cập: https://dashboard.ngrok.com/signup
2. Đăng ký tài khoản miễn phí
3. Copy authtoken từ dashboard

### Bước 3: Cấu hình Ngrok
```cmd
cd C:\ngrok
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

### Bước 4: Chạy WAN Mode
```cmd
cd c:\LTMang_AI\expense_ai
scripts\RUN_WAN.bat
```

### Bước 5: Lấy URL công khai
1. Mở cửa sổ "Ngrok Tunnel"
2. Tìm dòng "Forwarding"
3. Copy URL (ví dụ: `https://xxxx-xx-xx-xx-xx.ngrok-free.app`)
4. Hoặc truy cập: http://localhost:4040

### Bước 6: Cập nhật Frontend (nếu cần)
Nếu muốn frontend cũng truy cập qua WAN, cập nhật file:
`frontend/src/services/api.js`

```javascript
const API_BASE_URL = 'https://your-ngrok-url.ngrok-free.app/api';
```

## Cách 2: Sử dụng Cloudflare Tunnel (Miễn phí, Không giới hạn)

### Bước 1: Cài đặt Cloudflared
1. Tải: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
2. Cài đặt cloudflared

### Bước 2: Chạy tunnel
```cmd
cloudflared tunnel --url http://localhost:5000
```

### Bước 3: Copy URL
Cloudflare sẽ tạo URL dạng: `https://xxxx.trycloudflare.com`

## Cách 3: Deploy lên Cloud (Production)

### Render.com (Miễn phí)
1. Push code lên GitHub
2. Kết nối Render với GitHub repo
3. Deploy backend
4. Deploy frontend lên Netlify/Vercel

### Railway.app (Miễn phí)
1. Push code lên GitHub
2. Kết nối Railway với GitHub repo
3. Deploy tự động

## ⚠️ Lưu ý

### Ngrok Free Plan:
- ✅ Miễn phí
- ⚠️ URL thay đổi mỗi lần restart
- ⚠️ Giới hạn 40 connections/phút
- ⚠️ Session timeout sau 2 giờ

### Cloudflare Tunnel:
- ✅ Miễn phí không giới hạn
- ✅ Không timeout
- ⚠️ URL thay đổi mỗi lần restart

### Production Deploy:
- ✅ URL cố định
- ✅ Không giới hạn
- ✅ Tự động scale
- ⚠️ Cần setup CI/CD

## 🔒 Bảo mật

Khi chạy WAN mode:
1. ✅ Đã có CORS protection
2. ✅ Đã có rate limiting
3. ⚠️ Nên thêm authentication mạnh hơn
4. ⚠️ Nên sử dụng HTTPS (ngrok/cloudflare tự động có)
5. ⚠️ Không expose API key trong code

## 📊 Monitoring

- Ngrok Dashboard: http://localhost:4040
- Xem requests, responses, replay requests
- Monitor traffic real-time