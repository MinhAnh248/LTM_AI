# Hướng dẫn Deploy WAN - Mọi người trên Internet truy cập được

## 🎯 Tổng quan

Để mọi người trên thế giới truy cập được app, cần deploy:
- **Backend** lên Render (FREE)
- **Frontend** lên Netlify (FREE)

## 🤔 Tại sao cần deploy như vậy?

### Vấn đề khi chạy local:

**1. Máy tính cá nhân không phải server:**
- Máy tính của bạn có IP động (thay đổi mỗi khi khởi động lại router)
- Không có domain name (chỉ có IP số như 10.67.148.12)
- Không có HTTPS (trình duyệt cảnh báo "Not Secure")
- Phải bật máy 24/7 để người khác truy cập

**2. Router/ISP chặn:**
- Hầu hết ISP (nhà mạng) chặn port 80, 443 từ bên ngoài
- Router có firewall, không cho phép truy cập từ Internet vào
- Cần cấu hình Port Forwarding phức tạp và không an toàn

**3. Không có tên miền:**
- Người dùng phải nhớ IP số (khó nhớ, dễ quên)
- IP thay đổi → link cũ không dùng được

### Giải pháp: Deploy lên Cloud

**Backend (Render):**
- ✅ Server chạy 24/7 (không cần bật máy)
- ✅ IP tĩnh + Domain name (https://ltm-ai.onrender.com)
- ✅ HTTPS tự động (bảo mật)
- ✅ Không bị ISP chặn
- ✅ Truy cập từ mọi nơi trên thế giới

**Frontend (Netlify):**
- ✅ CDN toàn cầu (tải nhanh ở mọi quốc gia)
- ✅ HTTPS tự động
- ✅ Domain name đẹp (https://projectname04.netlify.app)
- ✅ Tự động deploy khi push code

### Tại sao tách Backend và Frontend?

**1. Hiệu suất:**
- Frontend (HTML/CSS/JS) được cache trên CDN → Tải cực nhanh
- Backend (API) chỉ xử lý data → Giảm tải server

**2. Bảo mật:**
- Frontend public (ai cũng thấy code)
- Backend private (logic, database ẩn)

**3. Scale dễ dàng:**
- Frontend có thể scale lên hàng triệu users (CDN)
- Backend scale độc lập khi cần

**4. Chi phí:**
- Frontend: FREE (Netlify CDN)
- Backend: FREE tier đủ dùng (Render)

## 📋 Yêu cầu

- Tài khoản GitHub
- Code đã push lên GitHub: https://github.com/MinhAnh248/LTM_AI

---

## 🔧 Bước 1: Deploy Backend (Render)

### 1.1. Tại sao chọn Render?

**So sánh các nền tảng:**

| Nền tảng | Giá | RAM | CPU | Sleep? | HTTPS |
|----------|-----|-----|-----|--------|-------|
| **Render** | FREE | 512MB | 0.1 | Có (15 phút) | ✅ |
| Heroku | $5/tháng | 512MB | 1x | Không | ✅ |
| Railway | $5 credit | 512MB | 0.5 | Không | ✅ |
| AWS EC2 | $3.5/tháng | 1GB | 1 | Không | ❌ (phải setup) |
| VPS | $5/tháng | 1GB | 1 | Không | ❌ (phải setup) |

**Render thắng vì:**
- ✅ FREE hoàn toàn (không cần credit card)
- ✅ Setup đơn giản (3 phút)
- ✅ HTTPS tự động
- ✅ Auto deploy từ GitHub
- ✅ Logs và monitoring

**Nhược điểm:**
- ⚠️ Sleep sau 15 phút không dùng (lần đầu truy cập mất 30s wake up)
- ⚠️ RAM và CPU thấp (đủ cho 100 users đồng thời)

### 1.2. Tạo tài khoản Render

**Tại sao dùng GitHub để đăng ký?**
- ✅ Không cần tạo password mới (dùng GitHub account)
- ✅ Render tự động sync code từ GitHub
- ✅ Mỗi lần push code → Tự động deploy
- ✅ Bảo mật hơn (GitHub OAuth)

**Các bước:**
1. Vào: https://render.com
2. Click "Get Started"
3. Click "Sign up with GitHub"
4. Authorize Render (cho phép Render đọc repos của bạn)

### 1.3. Tạo Web Service

1. Click "New +" → "Web Service"
2. Connect repository: `MinhAnh248/LTM_AI`

3. **Cấu hình chi tiết:**

**Name**: `expense-ai`
- Tên này sẽ là subdomain: `expense-ai.onrender.com`
- Chọn tên ngắn gọn, dễ nhớ

**Region**: `Singapore`
- Gần VN nhất → Latency thấp nhất
- Các region khác: Oregon (US), Frankfurt (EU)

**Branch**: `main`
- Branch nào được deploy
- Mỗi lần push vào branch này → Auto deploy

**Root Directory**: `expense_ai`
- Vì code backend nằm trong folder `expense_ai/`
- Render sẽ chạy commands từ folder này

**Runtime**: `Python 3`
- Render tự detect từ `requirements.txt`

**Build Command**: `pip install -r requirements.txt`
- Cài đặt tất cả dependencies (Flask, pandas, etc.)
- Chạy 1 lần khi deploy

**Start Command**: `gunicorn --worker-class gevent --workers 1 --bind 0.0.0.0:5000 api_server:app`
- **gunicorn**: Production WSGI server (thay vì Flask dev server)
- **--worker-class gevent**: Async workers (xử lý nhiều requests đồng thời)
- **--workers 1**: 1 worker (free tier chỉ có 512MB RAM)
- **--bind 0.0.0.0:5000**: Listen trên tất cả interfaces, port 5000
- **api_server:app**: File `api_server.py`, object `app`

**Instance Type**: `Free`
- 512MB RAM, 0.1 CPU
- Sleep sau 15 phút không dùng

4. Click "Create Web Service"

### 1.4. Đợi Deploy (2-3 phút)

**Quá trình deploy chi tiết:**

**Bước 1: Cloning (10-20 giây)**
```
==> Cloning from https://github.com/MinhAnh248/LTM_AI
==> Cloning completed
```
- Render tải code từ GitHub về server
- Chỉ tải branch `main`, folder `expense_ai/`

**Bước 2: Building (1-2 phút)**
```
==> Running 'pip install -r requirements.txt'
==> Installing Flask, pandas, scikit-learn...
==> Build successful 🎉
```
- Cài đặt tất cả packages trong `requirements.txt`
- Tải từ PyPI (Python Package Index)
- Tổng ~200MB dependencies

**Bước 3: Deploying (30 giây)**
```
==> Deploying...
==> Running 'gunicorn api_server:app'
==> Your service is live 🎉
```
- Khởi động gunicorn server
- Bind port 5000
- Tạo URL: `https://expense-ai.onrender.com`

**Logs bạn sẽ thấy:**
```
Using Gemini OCR processor
OCR service ready!
 * Serving Flask app 'api_server'
 * Running on http://0.0.0.0:5000
```

**Nếu có lỗi:**
- Kiểm tra tab "Logs" để xem lỗi gì
- Thường do: thiếu package, code syntax error, port sai

### 1.5. Test Backend

**Test 1: Health check**

Mở: `https://expense-ai.onrender.com/api/summary`

Kết quả mong đợi:
```json
{
  "total": 0,
  "count": 0,
  "average": 0
}
```

**Test 2: Login API**

Dùng Postman hoặc curl:
```bash
curl -X POST https://expense-ai.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123456"}'
```

Kết quả:
```json
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {"id": 1, "email": "admin@example.com"}
}
```

**Test 3: CORS check**

Mở Console trong browser, chạy:
```javascript
fetch('https://expense-ai.onrender.com/api/summary')
  .then(r => r.json())
  .then(console.log)
```

Nếu thấy data → CORS OK ✅
Nếu lỗi CORS → Kiểm tra `flask-cors` trong code

---

## 🎨 Bước 2: Deploy Frontend (Netlify)

### 2.1. Tại sao chọn Netlify?

**So sánh các nền tảng frontend:**

| Nền tảng | Giá | CDN | Build time | Bandwidth |
|----------|-----|-----|------------|----------|
| **Netlify** | FREE | ✅ Global | Nhanh | 100GB/tháng |
| Vercel | FREE | ✅ Global | Nhanh | 100GB/tháng |
| GitHub Pages | FREE | ❌ | Chậm | Unlimited |
| Firebase | FREE | ✅ | Trung bình | 10GB/tháng |

**Netlify thắng vì:**
- ✅ Setup cực đơn giản (file `netlify.toml` tự động)
- ✅ CDN toàn cầu (nhanh ở mọi nơi)
- ✅ HTTPS tự động
- ✅ Auto deploy từ GitHub
- ✅ Preview deploys (test trước khi merge)

### 2.2. Tạo tài khoản Netlify

**Tại sao dùng GitHub để đăng ký?**
- ✅ Tương tự Render (không cần password mới)
- ✅ Auto deploy khi push code
- ✅ Bảo mật

**Các bước:**
1. Vào: https://app.netlify.com
2. Click "Sign up with GitHub"
3. Authorize Netlify

### 2.2. Import Project

1. Click "Add new site" → "Import an existing project"
2. Click "Deploy with GitHub"
3. Authorize Netlify
4. Chọn repository: `LTM_AI`

### 2.4. Cấu hình Deploy

**Netlify sẽ tự động detect file `netlify.toml`** - Không cần config gì!

**File `netlify.toml` giải thích:**
```toml
[build]
  base = "frontend"              # Folder chứa React app
  command = "npm install && npm run build"  # Build React
  publish = "build"              # Folder output sau khi build

[[redirects]]
  from = "/*"                    # Mọi URL
  to = "/index.html"             # Đều trỏ về index.html
  status = 200                   # (cho React Router hoạt động)
```

**Tại sao cần build?**
- React code (JSX) không chạy trực tiếp trên browser
- `npm run build` biến JSX → HTML/CSS/JS thuần
- Minify code → Giảm kích thước → Tải nhanh

Nếu Netlify không tự động detect, điền thủ công:
- **Base directory**: `expense_ai/frontend`
- **Build command**: `npm install && npm run build`
- **Publish directory**: `build`

### 2.5. Deploy

1. Click "Deploy LTM_AI"
2. Đợi 2-3 phút

**Quá trình deploy chi tiết:**

**Bước 1: Cloning (10 giây)**
```
Cloning github.com/MinhAnh248/LTM_AI
Cloning completed: 9.220s
```

**Bước 2: Installing dependencies (1 phút)**
```
Running "npm install" in frontend/
Installing react, react-dom, axios...
added 1500 packages
```
- Cài đặt tất cả packages trong `package.json`
- Tải từ npm registry
- Tổng ~300MB node_modules

**Bước 3: Building (1 phút)**
```
Running "npm run build"
Creating optimized production build...
Compiled successfully!

File sizes after gzip:
  50 KB  build/static/js/main.abc123.js
  2 KB   build/static/css/main.def456.css
```
- React JSX → JavaScript thuần
- Minify code (xóa whitespace, rút gọn tên biến)
- Optimize images
- Tạo folder `build/` với HTML/CSS/JS

**Bước 4: Deploying to CDN (30 giây)**
```
Uploading build to Netlify CDN...
Deploying to 200+ edge locations worldwide...
Deploy successful!
```
- Upload files lên CDN (Content Delivery Network)
- Phân phối đến 200+ servers toàn cầu
- User ở VN → Tải từ Singapore server (nhanh)
- User ở US → Tải từ US server (nhanh)

**URL được tạo:**
- Production: `https://projectname04.netlify.app`
- Preview: `https://deploy-preview-123--projectname04.netlify.app`

### 2.6. Test Frontend

**Test 1: Trang chủ**

Mở: `https://projectname04.netlify.app`

Bạn sẽ thấy:
- Trang login với form email/password
- Logo "AI Expense Manager"
- Nút "Đăng nhập"

**Test 2: Login**

Nhập:
- Email: `admin@example.com`
- Password: `123456`
- Click "Đăng nhập"

Nếu thành công → Chuyển đến Dashboard ✅

**Test 3: API connection**

Mở DevTools (F12) → Network tab

Khi login, bạn sẽ thấy request:
```
POST https://ltm-ai.onrender.com/api/auth/login
Status: 200 OK
Response: {"success": true, "token": "..."}
```

Nếu thấy request này → Frontend đã kết nối Backend ✅

**Test 4: Responsive**

Mở trên điện thoại hoặc resize browser
- Giao diện tự động điều chỉnh
- Menu collapse thành hamburger icon
- Bảng biểu đồ responsive

---

## ✅ Hoàn tất!

Bây giờ mọi người có thể truy cập:

- **Frontend**: https://projectname04.netlify.app
- **Backend**: https://expense-ai.onrender.com

**Login:**
- Email: `admin@example.com`
- Password: `123456`

---

## 🧪 Load Test 100 Users

Chạy local:
```bash
python -m locust -f load_test.py --host=https://expense-ai.onrender.com --web-port=8090
```

Mở: http://localhost:8090
- Users: 100
- Spawn rate: 10
- Click "Start swarming"

**Kết quả mong đợi:**
- RPS: ~20
- Failure rate: < 5%
- Response time: 1-3 giây

---

## 🔄 Cập nhật Code

**Quy trình CI/CD tự động:**

### Bước 1: Sửa code local

```bash
# Ví dụ: Sửa file api_server.py
code api_server.py
# Thêm feature mới, fix bug, etc.
```

### Bước 2: Test local

```bash
# Chạy local để test
RUN_LAN.bat

# Mở http://10.67.148.12:3000
# Test xem code mới hoạt động chưa
```

### Bước 3: Commit và push

```bash
git add .
git commit -m "Add new feature: Export to Excel"
git push origin main
```

### Bước 4: Auto deploy

**Render (Backend):**
```
[GitHub] Push detected on main branch
[Render] Starting new deploy...
[Render] Cloning latest code...
[Render] Running build...
[Render] Deploy successful! (2 minutes)
```

**Netlify (Frontend):**
```
[GitHub] Push detected on main branch
[Netlify] Starting new deploy...
[Netlify] Building React app...
[Netlify] Deploying to CDN...
[Netlify] Deploy successful! (1 minute)
```

**Bạn sẽ nhận email:**
- "Render: Deploy succeeded for expense-ai"
- "Netlify: Deploy succeeded for projectname04"

### Bước 5: Verify

Mở:
- Backend: `https://expense-ai.onrender.com/api/summary`
- Frontend: `https://projectname04.netlify.app`

Kiểm tra feature mới đã hoạt động chưa

**Rollback nếu có lỗi:**

1. Vào Render/Netlify Dashboard
2. Tab "Deploys"
3. Chọn deploy cũ (working version)
4. Click "Rollback to this deploy"
5. Hoặc revert commit:
```bash
git revert HEAD
git push origin main
```

---

## 💡 Lưu ý quan trọng

### Render Free Tier:

**Giới hạn:**
- ✅ Không giới hạn requests/giây
- ✅ Không giới hạn bandwidth
- ⚠️ **Sleep sau 15 phút không dùng**
- ⚠️ **Wake up mất 30-50 giây**
- ✅ 512MB RAM, 0.1 CPU
- ✅ 750 giờ/tháng (đủ chạy cả tháng)

**Cách hoạt động của Sleep:**
```
User 1 truy cập (8:00 AM)
→ Server wake up (30s)
→ Server active

User 2 truy cập (8:05 AM)
→ Server vẫn active (nhanh)

Không ai truy cập 15 phút
→ Server sleep (8:20 AM)

User 3 truy cập (9:00 AM)
→ Server wake up lại (30s)
```

**Giải pháp:**
- Dùng cron job ping server mỗi 10 phút (giữ server active)
- Hoặc upgrade lên Starter ($7/tháng) - không sleep

### Netlify Free Tier:

**Giới hạn:**
- ✅ Không giới hạn requests
- ✅ CDN toàn cầu (200+ locations)
- ✅ 100GB bandwidth/tháng
- ✅ 300 build minutes/tháng
- ✅ HTTPS tự động (Let's Encrypt)
- ✅ Không sleep (luôn active)

**100GB bandwidth = bao nhiêu users?**
```
Frontend size: ~2MB (sau gzip)
100GB / 2MB = 50,000 lượt truy cập/tháng
= ~1,600 users/ngày
```

**Vượt giới hạn thì sao?**
- Netlify sẽ email cảnh báo
- Site vẫn hoạt động bình thường
- Tháng sau reset về 0

### So sánh Performance:

**Local (LAN):**
- Latency: 1-5ms
- Speed: Cực nhanh
- Chỉ trong mạng nội bộ

**Render + Netlify (WAN):**
- Latency: 50-200ms (tùy vị trí)
- Speed: Nhanh (nhờ CDN)
- Toàn cầu

**Test từ VN:**
```
Ping ltm-ai.onrender.com
→ 180ms (Singapore server)

Ping projectname04.netlify.app
→ 50ms (CDN edge server gần VN)
```

---

## 🆙 Nâng cấp (Nếu cần)

### Render Starter ($7/tháng):
- Không sleep
- 512MB RAM, 0.5 CPU
- Response time nhanh hơn 50%

### Netlify Pro ($19/tháng):
- 1TB bandwidth
- Password protection
- Analytics

---

## 🐛 Troubleshooting Chi Tiết

### Lỗi 1: Backend không chạy

**Triệu chứng:**
- Deploy failed
- Status: "Build failed" hoặc "Deploy failed"

**Cách fix:**

1. **Vào Render → Logs**

2. **Tìm lỗi:**

**Lỗi A: ModuleNotFoundError**
```
ModuleNotFoundError: No module named 'flask'
```
→ Thiếu package trong `requirements.txt`
→ Fix: Thêm `flask>=3.0` vào `requirements.txt`

**Lỗi B: SyntaxError**
```
SyntaxError: invalid syntax in api_server.py line 45
```
→ Code Python sai cú pháp
→ Fix: Sửa code, test local trước khi push

**Lỗi C: Port binding**
```
OSError: [Errno 98] Address already in use
```
→ Port 5000 đã được dùng
→ Fix: Render tự động assign port, không cần fix

**Lỗi D: Database connection**
```
pyodbc.Error: Can't open lib 'ODBC Driver 17'
```
→ Đang dùng SQL Server (không có trên Render)
→ Fix: Chuyển sang SQLite (đã fix trong code)

### Lỗi 2: Frontend không hiển thị

**Triệu chứng:**
- Trang trắng
- 404 Not Found
- "Page not found"

**Cách fix:**

1. **Vào Netlify → Deploys → Deploy log**

2. **Tìm lỗi:**

**Lỗi A: npm install failed**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```
→ Conflict giữa các packages
→ Fix: Xóa `package-lock.json`, chạy `npm install` lại

**Lỗi B: Build failed**
```
Failed to compile.
Module not found: Can't resolve './components/Dashboard'
```
→ Import sai path hoặc file không tồn tại
→ Fix: Kiểm tra import statements

**Lỗi C: Out of memory**
```
JavaScript heap out of memory
```
→ Build quá lớn
→ Fix: Tăng memory: `NODE_OPTIONS=--max-old-space-size=4096`

### Lỗi 3: Frontend không kết nối Backend

**Triệu chứng:**
- Login không được
- Console error: "Failed to fetch"
- CORS error

**Cách fix:**

1. **Mở DevTools (F12) → Console**

2. **Xem lỗi:**

**Lỗi A: CORS**
```
Access to fetch at 'https://expense-ai.onrender.com/api/auth/login'
from origin 'https://projectname04.netlify.app' has been blocked by CORS policy
```
→ Backend chưa cho phép frontend domain
→ Fix: Kiểm tra `flask-cors` trong `api_server.py`:
```python
from flask_cors import CORS
CORS(app)  # Cho phép tất cả origins
```

**Lỗi B: Wrong URL**
```
GET https://ltm-ai.onrender.com/api/summary 404 Not Found
```
→ URL sai hoặc endpoint không tồn tại
→ Fix: Kiểm tra `frontend/src/services/api.js`:
```javascript
NGROK: 'https://expense-ai.onrender.com/api'  // Đúng tên domain
```

**Lỗi C: Backend sleeping**
```
GET https://expense-ai.onrender.com/api/summary (pending...)
```
→ Backend đang sleep, đang wake up
→ Đợi 30s, reload lại

**Lỗi D: Network error**
```
Failed to fetch: TypeError: NetworkError
```
→ Backend down hoặc internet mất
→ Kiểm tra Render status: https://status.render.com

### Lỗi 4: Slow performance

**Triệu chứng:**
- Trang load chậm (>5 giây)
- API response chậm

**Nguyên nhân & Fix:**

1. **Backend sleeping**
→ Lần đầu truy cập mất 30s wake up
→ Fix: Ping server mỗi 10 phút hoặc upgrade Render

2. **Database query chậm**
→ SQLite không có index
→ Fix: Thêm index cho các cột thường query:
```python
cursor.execute('CREATE INDEX idx_date ON expenses(date)')
```

3. **Frontend bundle quá lớn**
→ JavaScript file >1MB
→ Fix: Code splitting, lazy loading:
```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

4. **Nhiều requests**
→ Mỗi page load gọi 10+ API calls
→ Fix: Batch requests, cache data

### Debug Tools:

**Backend:**
```bash
# Test API trực tiếp
curl https://expense-ai.onrender.com/api/summary

# Test với authentication
curl -H "Authorization: Bearer TOKEN" \
  https://expense-ai.onrender.com/api/expenses
```

**Frontend:**
```javascript
// Trong Console
fetch('https://expense-ai.onrender.com/api/summary')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

---

## 💾 Data của người dùng lưu ở đâu?

### Tổng quan:

**Data được lưu trên server Render, không phải máy tính của bạn!**

### Chi tiết:

**1. Database: SQLite file**

File: `expense_data.db`

Vị trí:
```
Render Server:
/opt/render/project/src/expense_ai/expense_data.db
```

**Nội dung lưu trữ:**
- Users (email, password hash)
- Sessions (login tokens)
- Expenses (chi tiêu)
- Incomes (thu nhập)
- Budgets (ngân sách)
- Debts (nợ)
- Savings Goals (tiết kiệm)
- Reminders (nhắc nhở)

**2. Quy trình lưu data:**

```
User đăng nhập từ Frontend (Netlify)
↓
Gửi request đến Backend (Render)
↓
Backend xử lý và lưu vào SQLite
↓
Data được lưu trên Render server disk
```

**Ví dụ:**
```javascript
// User thêm chi tiêu trên Frontend
fetch('https://ltm-ai.onrender.com/api/expenses', {
  method: 'POST',
  body: JSON.stringify({
    date: '2025-10-15',
    category: 'an uong',
    amount: 50000,
    description: 'Com trua'
  })
})

// Backend nhận và lưu vào database
conn = sqlite3.connect('expense_data.db')
cursor.execute(
  'INSERT INTO expenses (date, category, amount, description) VALUES (?, ?, ?, ?)',
  ('2025-10-15', 'an uong', 50000, 'Com trua')
)
conn.commit()
```

### ⚠️ Lưu ý quan trọng:

**1. Data không mất khi deploy lại**

- Render giữ data trong disk persistent
- Mỗi lần deploy mới, data cũ vẫn còn
- **TRỪ KHI** bạn xóa service hoặc clear data

**2. Data có thể mất khi:**

❌ **Suspend service** (tạm dừng)
- Render có thể xóa data sau 90 ngày suspend

❌ **Delete service** (xóa hoàn toàn)
- Data bị xóa vĩnh viễn

❌ **Free tier limitations**
- Render free tier không bảo đảm data persistence 100%
- Nên backup thường xuyên

**3. Mỗi user có data riêng**

```sql
-- Mỗi record có user_id
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,  -- Phân biệt user
  date TEXT,
  category TEXT,
  amount REAL,
  description TEXT
)
```

- User A chỉ thấy data của User A
- User B chỉ thấy data của User B
- Data không bị lẫn giữa các users

### 🛡️ Bảo mật:

**1. Password không lưu plain text**

```python
# Không lưu: "123456"
# Lưu: "e10adc3949ba59abbe56e057f20f883e" (SHA256 hash)

import hashlib
password_hash = hashlib.sha256(password.encode()).hexdigest()
```

**2. Token authentication**

```python
# Mỗi lần login, tạo token
token = jwt.encode({
  'user_id': 1,
  'exp': datetime.now() + timedelta(days=7)
}, SECRET_KEY)

# Token lưu trong browser (localStorage)
# Không lưu password trong browser
```

**3. HTTPS encryption**

```
User Browser ↔️ [HTTPS encrypted] ↔️ Render Server
```

- Tất cả data truyền qua mạng được mã hóa
- Không ai đánh chặn được

### 💾 Backup Data:

**Cách 1: Export qua API**

```python
# Tạo endpoint export
@app.route('/api/export-data')
def export_data():
    expenses = db.get_expenses()
    return expenses.to_json()

# User download file JSON
```

**Cách 2: Download database file**

```bash
# SSH vào Render server (cần paid plan)
render ssh expense-ai

# Copy database file
scp expense_data.db local_backup.db
```

**Cách 3: Auto backup (Khuyến nghị)**

```python
# Thêm vào code: Tự động backup mỗi ngày
import schedule
import shutil
from datetime import datetime

def backup_database():
    backup_name = f'backup_{datetime.now().strftime("%Y%m%d")}.db'
    shutil.copy('expense_data.db', backup_name)
    # Upload lên Google Drive / Dropbox / S3

schedule.every().day.at("02:00").do(backup_database)
```

### 🔄 Migration sang database khác:

Nếu muốn data bền vững hơn:

**Option 1: PostgreSQL (Render)**
- Render cung cấp PostgreSQL free tier
- Data persistence tốt hơn SQLite
- Setup: https://render.com/docs/databases

**Option 2: MongoDB Atlas (FREE)**
- 512MB storage miễn phí
- Cloud database, không mất data
- Setup: https://www.mongodb.com/cloud/atlas

**Option 3: Supabase (FREE)**
- PostgreSQL + API tự động
- 500MB storage miễn phí
- Setup: https://supabase.com

### 📊 Giới hạn Storage:

**Render Free Tier:**
- Disk: Không giới hạn rõ ràng
- Thực tế: ~1GB là an toàn
- SQLite file thường < 100MB cho 1000 users

**Tính toán:**
```
1 expense record ≈ 200 bytes
1000 expenses = 200KB
10,000 expenses = 2MB
100,000 expenses = 20MB

→ Đủ cho hàng triệu records!
```

### ❓ FAQ:

**Q: Nếu Render down thì sao?**
A: Data vẫn còn, chỉ tạm thời không truy cập được. Khi Render up lại, data vẫn nguyên vẹn.

**Q: Nếu tôi xóa GitHub repo thì sao?**
A: Data trên Render KHÔNG bị ảnh hưởng. GitHub chỉ chứa code, không chứa data.

**Q: Nếu tôi deploy lại thì sao?**
A: Data vẫn còn. Deploy chỉ cập nhật code, không xóa database.

**Q: Làm sao xem data trong database?**
A: Tạo endpoint API để xem:
```python
@app.route('/api/debug/database')
def view_database():
    conn = sqlite3.connect('expense_data.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM expenses')
    return jsonify(cursor.fetchall())
```

**Q: Data có được mã hóa không?**
A: 
- Password: Có (SHA256 hash)
- Data khác: Không (plain text trong database)
- Truyền qua mạng: Có (HTTPS)

**Q: Render nhân viên có xem được data không?**
A: Về mặt kỹ thuật: Có (vì data trên server của họ). Nhưng Render có privacy policy cam kết không truy cập data của users.

## 📞 Hỗ trợ & Tài liệu

### Documentation:
- **Render Docs**: https://render.com/docs
  - Web Services: https://render.com/docs/web-services
  - Deploy Hooks: https://render.com/docs/deploy-hooks
  - Environment Variables: https://render.com/docs/environment-variables

- **Netlify Docs**: https://docs.netlify.com
  - Build Configuration: https://docs.netlify.com/configure-builds/overview/
  - Redirects: https://docs.netlify.com/routing/redirects/
  - Environment Variables: https://docs.netlify.com/environment-variables/overview/

### Community:
- **Render Community**: https://community.render.com
- **Netlify Community**: https://answers.netlify.com
- **Stack Overflow**: Tag `render` hoặc `netlify`

### GitHub:
- **Repository**: https://github.com/MinhAnh248/LTM_AI
- **Issues**: https://github.com/MinhAnh248/LTM_AI/issues
- **Pull Requests**: https://github.com/MinhAnh248/LTM_AI/pulls

### Status Pages:
- **Render Status**: https://status.render.com
- **Netlify Status**: https://www.netlifystatus.com

### Video Tutorials:
- **Deploy Flask to Render**: https://www.youtube.com/results?search_query=deploy+flask+to+render
- **Deploy React to Netlify**: https://www.youtube.com/results?search_query=deploy+react+to+netlify

### Liên hệ:
- **Email**: ntri97543@gmail.com (Collaborator)
- **GitHub**: @MinhAnh248
