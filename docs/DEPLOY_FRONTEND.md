# Deploy Frontend - Vercel (FREE)

## Cách 1: Vercel CLI (Nhanh - 2 phút)

```bash
deploy_frontend.bat
```

Hoặc thủ công:
```bash
cd frontend
npm install -g vercel
npm run build
vercel --prod
```

## Cách 2: Vercel Web (Dễ nhất)

1. Vào: https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import repository: `MinhAnh248/LTM_AI`
5. Settings:
   - **Root Directory**: `expense_ai/frontend`
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Click "Deploy"

## Cách 3: Netlify (Alternative)

1. Vào: https://netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Connect GitHub → Select `LTM_AI`
5. Settings:
   - **Base directory**: `expense_ai/frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `expense_ai/frontend/build`
6. Click "Deploy"

## Sau khi deploy:

URL sẽ là: `https://your-app.vercel.app` hoặc `https://your-app.netlify.app`

Mọi người có thể truy cập:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://ltm-ai.onrender.com

## Lưu ý:

Frontend đã được cấu hình để gọi backend Render:
```javascript
NGROK: 'https://ltm-ai.onrender.com/api'
```

Không cần thay đổi gì thêm!
