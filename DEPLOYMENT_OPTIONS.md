# Deployment Options - 100 Users WAN

## 🚀 Option 1: Railway (Khuyến nghị - MIỄN PHÍ)

### Ưu điểm:
- ✅ Miễn phí $5 credit/tháng
- ✅ Deploy trong 5 phút
- ✅ Tự động HTTPS
- ✅ Không giới hạn requests
- ✅ URL cố định

### Cách deploy:

1. Tạo tài khoản: https://railway.app
2. Install Railway CLI:
```bash
npm install -g @railway/cli
```

3. Login:
```bash
railway login
```

4. Deploy:
```bash
railway init
railway up
```

5. Lấy URL: `https://your-app.railway.app`

---

## 🌐 Option 2: Render (MIỄN PHÍ)

### Ưu điểm:
- ✅ Hoàn toàn miễn phí
- ✅ Tự động deploy từ GitHub
- ✅ HTTPS miễn phí
- ✅ Không cần credit card

### Cách deploy:

1. Push code lên GitHub
2. Đăng ký: https://render.com
3. New → Web Service
4. Connect GitHub repo
5. Build command: `pip install -r requirements.txt`
6. Start command: `python api_server.py`

---

## ☁️ Option 3: Vercel (Frontend) + Railway (Backend)

### Ưu điểm:
- ✅ Frontend cực nhanh (CDN toàn cầu)
- ✅ Backend ổn định
- ✅ Miễn phí

### Cách deploy:

**Frontend (Vercel):**
```bash
cd frontend
npm install -g vercel
vercel
```

**Backend (Railway):**
```bash
railway up
```

---

## 🐳 Option 4: Docker + VPS (Tốt nhất cho production)

### Ưu điểm:
- ✅ Kiểm soát hoàn toàn
- ✅ Không giới hạn
- ✅ Giá rẻ ($5/tháng)

### VPS providers:
- DigitalOcean: $5/tháng
- Vultr: $5/tháng
- Linode: $5/tháng

---

## 🔥 Option 5: Cloudflare Tunnel (MIỄN PHÍ - Thay thế Ngrok)

### Ưu điểm:
- ✅ Hoàn toàn miễn phí
- ✅ Không giới hạn requests
- ✅ Nhanh hơn ngrok
- ✅ Không cần mở port

### Cách setup:

1. Install:
```bash
# Download từ: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
```

2. Login:
```bash
cloudflared tunnel login
```

3. Tạo tunnel:
```bash
cloudflared tunnel create expense-ai
```

4. Chạy:
```bash
cloudflared tunnel --url http://localhost:5000
```

5. Lấy URL: `https://xxx.trycloudflare.com`

---

## 📱 Option 6: Ngrok Pro ($8/tháng)

### Ưu điểm:
- ✅ Không giới hạn requests
- ✅ URL cố định
- ✅ Custom domain

---

## 🎯 Khuyến nghị theo nhu cầu:

### Test ngắn hạn (1-2 ngày):
→ **Cloudflare Tunnel** (miễn phí, không giới hạn)

### Demo/Prototype (1-2 tuần):
→ **Railway** hoặc **Render** (miễn phí)

### Production (lâu dài):
→ **VPS + Docker** ($5/tháng, kiểm soát tốt)

### Startup/Business:
→ **Vercel (Frontend) + Railway (Backend)** (scale tốt)

---

## 🚀 Quick Start - Cloudflare Tunnel (5 phút)

```bash
# 1. Download cloudflared
# Windows: https://github.com/cloudflare/cloudflared/releases

# 2. Chạy backend
python api_server.py

# 3. Mở terminal mới, chạy tunnel
cloudflared tunnel --url http://localhost:5000

# 4. Copy URL và cập nhật frontend/src/services/api.js
# NGROK: 'https://xxx.trycloudflare.com/api'

# 5. Chạy frontend
cd frontend
npm start
```

Done! 100 người có thể truy cập không giới hạn!
