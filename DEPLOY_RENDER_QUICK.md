# Deploy lên Render - 3 phút

## Bước 1: Vào Render

1. Mở: https://render.com
2. Sign up with GitHub
3. Authorize Render

## Bước 2: Tạo Web Service

1. Click "New +" → "Web Service"
2. Connect repository: `MinhAnh248/LTM_AI`
3. Root Directory: `expense_ai`
4. Settings:
   - **Name**: `expense-ai`
   - **Region**: Singapore (gần VN nhất)
   - **Branch**: `main`
   - **Root Directory**: `expense_ai`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python api_server.py`
   - **Instance Type**: Free

5. Click "Create Web Service"

## Bước 3: Đợi Deploy (2-3 phút)

Render sẽ:
- Clone repo
- Install dependencies
- Start server
- Tạo URL: `https://expense-ai.onrender.com`

## Bước 4: Test Backend

Mở: `https://expense-ai.onrender.com/api/summary`

Nếu thấy JSON → Thành công!

## Bước 5: Cập nhật Frontend

Mở `frontend/src/services/api.js`:
```javascript
const MODE = 'NGROK';
NGROK: 'https://expense-ai.onrender.com/api'
```

Commit và push:
```bash
git add .
git commit -m "Update API URL"
git push
```

## Bước 6: Deploy Frontend (Optional)

### Option A: Vercel (Khuyến nghị)
```bash
cd frontend
npm install -g vercel
vercel
```

### Option B: Netlify
```bash
cd frontend
npm run build
# Drag & drop folder `build` vào netlify.com
```

## Xong!

- **Backend**: https://expense-ai.onrender.com
- **Frontend**: https://expense-ai.vercel.app (nếu dùng Vercel)

## Lưu ý

- Render free tier: Sleep sau 15 phút không dùng
- Lần đầu truy cập sẽ mất 30s để wake up
- Không giới hạn requests khi đã wake
