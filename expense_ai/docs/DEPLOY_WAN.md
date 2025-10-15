# Deploy WAN - Railway (5 phút)

## Bước 1: Chuẩn bị

```bash
# Push code lên GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/expense-ai.git
git push -u origin main
```

## Bước 2: Deploy lên Railway

1. Truy cập: https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Chọn "Deploy from GitHub repo"
5. Chọn repository `expense-ai`
6. Railway tự động detect và deploy

## Bước 3: Lấy URL

1. Vào project → Settings → Domains
2. Click "Generate Domain"
3. Copy URL: `https://your-app.up.railway.app`

## Bước 4: Cập nhật Frontend

Mở `frontend/src/services/api.js`:
```javascript
const MODE = 'NGROK';
NGROK: 'https://your-app.up.railway.app/api'
```

## Bước 5: Deploy Frontend lên Vercel

```bash
cd frontend
npm install -g vercel
vercel
```

---

# Hoặc dùng Render (Miễn phí 100%)

## Bước 1: Push lên GitHub (như trên)

## Bước 2: Deploy Backend

1. Truy cập: https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - Name: expense-ai-backend
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python api_server.py`
5. Click "Create Web Service"

## Bước 3: Deploy Frontend

1. New → Static Site
2. Connect GitHub repo
3. Settings:
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`
4. Environment Variables:
   - `REACT_APP_API_URL`: URL từ backend
5. Click "Create Static Site"

---

# Hoặc dùng Ngrok Pro ($8/tháng)

```bash
# Upgrade ngrok
ngrok config add-authtoken YOUR_TOKEN

# Chạy với domain cố định
ngrok http 5000 --domain=your-domain.ngrok-free.app
```

---

# Khuyến nghị

**Cho demo/test (1-2 tuần):**
→ Railway (miễn phí $5 credit)

**Cho production:**
→ Render (miễn phí hoàn toàn)

**Cho development:**
→ Ngrok Pro (domain cố định)
