# 🔧 Cách thêm Environment Variable trên Render

## Cách 1: Qua Settings

1. Vào Dashboard: https://dashboard.render.com
2. Click vào service **LTM_AI**
3. Bên trái, tìm và click **Settings** (không phải Environment)
4. Scroll xuống phần **Environment Variables**
5. Click **Add Environment Variable**
6. Thêm:
   ```
   Key: GEMINI_API_KEY
   Value: AIzaSyBF7jxAXLiAQhmR8UzFBPT9tTcNmQGihhw
   ```
7. Click **Save Changes**

---

## Cách 2: Qua render.yaml (Khuyên dùng)

### Bước 1: Cập nhật file render.yaml

Thêm GEMINI_API_KEY vào file:

```yaml
services:
  - type: web
    name: expense-ai-backend
    env: python
    region: singapore
    plan: free
    buildCommand: pip install -r expense_ai/requirements.txt
    startCommand: cd expense_ai && gunicorn --workers 1 --bind 0.0.0.0:$PORT api_server:app
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: FLASK_ENV
        value: production
      - key: GEMINI_API_KEY
        value: AIzaSyBF7jxAXLiAQhmR8UzFBPT9tTcNmQGihhw
```

### Bước 2: Push lên GitHub

```cmd
cd c:\LTMang_AI
git add .
git commit -m "Add GEMINI_API_KEY to render.yaml"
git push origin main
```

Render sẽ tự động redeploy với environment variable mới!

---

## Cách 3: Thêm vào code (Không khuyên dùng)

Nếu không tìm thấy Settings, có thể hardcode tạm:

```python
# api_server.py
import os

# Thêm vào đầu file
os.environ['GEMINI_API_KEY'] = 'AIzaSyBF7jxAXLiAQhmR8UzFBPT9tTcNmQGihhw'
```

⚠️ **Lưu ý:** Không nên commit API key vào GitHub!

---

## Kiểm tra Environment Variable đã thêm chưa

### Cách 1: Xem Logs

1. Dashboard → **LTM_AI**
2. Tab **Logs**
3. Tìm dòng:
   ```
   Warning: OCR processor not available: GEMINI_API_KEY not found
   ```
4. Nếu không còn warning này → Đã thêm thành công!

### Cách 2: Test API

```bash
curl -X POST https://ltm-ai.onrender.com/api/scan-receipt \
  -F "image=@test.jpg"
```

Nếu trả về kết quả OCR → Thành công!

---

## Vị trí các tab trên Render Dashboard

Khi vào service **LTM_AI**, bên trái sẽ có:

```
📊 Events          ← Deploy history
📈 Logs            ← Real-time logs
📊 Metrics         ← CPU, Memory
⚙️  Settings       ← Environment Variables ở đây!
🔧 Environment     ← Có thể không có tab này
🐚 Shell           ← Terminal
📏 Scaling         ← Instance size
🔍 Previews        ← Preview deploys
💾 Disks           ← Storage
⚡ Jobs            ← Background jobs
```

**Environment Variables** nằm trong **Settings**, không phải tab riêng!

---

## Screenshot hướng dẫn

### Bước 1: Click Settings
```
Dashboard → LTM_AI → Settings (bên trái)
```

### Bước 2: Scroll xuống
```
Settings
├── General
├── Build & Deploy
├── Environment Variables  ← Ở đây!
├── Redirects/Rewrites
└── Danger Zone
```

### Bước 3: Add Variable
```
[Add Environment Variable]

Key:   GEMINI_API_KEY
Value: AIzaSyBF7jxAXLiAQhmR8UzFBPT9tTcNmQGihhw

[Save Changes]
```

---

## Nếu vẫn không tìm thấy

### Giải pháp: Dùng render.yaml (Tốt nhất)

File này đã có sẵn trong repo, chỉ cần cập nhật:

```yaml
# render.yaml
services:
  - type: web
    name: expense-ai-backend
    env: python
    envVars:
      - key: GEMINI_API_KEY
        value: AIzaSyBF7jxAXLiAQhmR8UzFBPT9tTcNmQGihhw
```

Push lên GitHub → Render tự động áp dụng!

---

## ✅ Xác nhận thành công

Sau khi thêm, check logs:

```
[2025-10-29 10:21:56 +0000] [58] [INFO] Booting worker with pid: 58
✅ OCR processor initialized successfully
```

Không còn warning → Thành công! 🎉
