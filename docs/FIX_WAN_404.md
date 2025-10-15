# Fix lỗi 404 "Page not found" trên Netlify

## 🐛 Vấn đề

Khi truy cập `https://projectname04.netlify.app/add` hoặc bất kỳ route nào khác ngoài `/`, bạn gặp lỗi:

```
Page not found
Looks like you've followed a broken link or entered a URL that doesn't exist on this site.
```

## 🔍 Nguyên nhân

**React Router vs Server Routing:**

### Cách React Router hoạt động:

```
User vào: https://projectname04.netlify.app
↓
Netlify trả về: index.html
↓
React Router load và xử lý routing trong browser
↓
User click link "/add" → React Router chuyển trang (không reload)
✅ Hoạt động bình thường
```

### Vấn đề khi refresh hoặc truy cập trực tiếp:

```
User vào: https://projectname04.netlify.app/add
↓
Netlify tìm file: /add/index.html
↓
❌ File không tồn tại → 404 Error
```

**Tại sao?**
- React là Single Page Application (SPA)
- Chỉ có 1 file HTML duy nhất: `index.html`
- Tất cả routes (`/add`, `/dashboard`, `/settings`) đều do React Router xử lý trong browser
- Netlify server không biết về các routes này

## ✅ Giải pháp

Cần báo cho Netlify: "Với MỌI URL, hãy trả về `index.html` và để React Router xử lý"

### Cách 1: File `_redirects` (Đơn giản nhất)

**Tạo file:** `frontend/public/_redirects`

```
/*    /index.html   200
```

**Giải thích:**
- `/*`: Mọi URL (bất kỳ path nào)
- `/index.html`: Trả về file index.html
- `200`: Status code 200 (OK), không phải 301/302 redirect

**Cách hoạt động:**
```
User vào: /add
↓
Netlify đọc _redirects
↓
Trả về: index.html (nhưng URL vẫn là /add)
↓
React Router nhận URL /add và render component AddExpense
✅ Hoạt động!
```

### Cách 2: File `netlify.toml` (Linh hoạt hơn)

**Tạo file:** `netlify.toml` (ở root của repo)

```toml
[build]
  base = "frontend"
  command = "npm install && npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Giải thích:**
- `[build]`: Cấu hình build
  - `base`: Folder chứa frontend code
  - `command`: Lệnh build
  - `publish`: Folder output sau build
- `[[redirects]]`: Cấu hình redirect
  - `from = "/*"`: Từ mọi URL
  - `to = "/index.html"`: Đến index.html
  - `status = 200`: Rewrite (không phải redirect)

## 🔧 Các bước fix

### Bước 1: Kiểm tra file đã có chưa

```bash
# Kiểm tra _redirects
ls frontend/public/_redirects

# Kiểm tra netlify.toml
ls netlify.toml
```

### Bước 2: Nếu chưa có, tạo file

**Option A: Dùng _redirects**

```bash
echo "/*    /index.html   200" > frontend/public/_redirects
```

**Option B: Dùng netlify.toml**

Tạo file `netlify.toml` ở root với nội dung như trên.

### Bước 3: Push lên GitHub

```bash
git add .
git commit -m "Fix: Add Netlify redirects for React Router"
git push origin main
```

### Bước 4: Netlify tự động deploy

```
[GitHub] Push detected
↓
[Netlify] Starting new deploy...
↓
[Netlify] Building React app...
↓
[Netlify] Copying _redirects to build folder
↓
[Netlify] Deploy successful!
```

### Bước 5: Test

Truy cập trực tiếp:
- `https://projectname04.netlify.app/add` ✅
- `https://projectname04.netlify.app/dashboard` ✅
- `https://projectname04.netlify.app/settings` ✅

## 🎯 Vị trí file quan trọng

### Trước khi build:

```
expense_ai/
├── netlify.toml              ← Ở root của repo
└── frontend/
    └── public/
        └── _redirects        ← Ở public folder
```

### Sau khi build:

```
frontend/build/
├── index.html
├── _redirects               ← Được copy vào build folder
└── static/
```

**Quan trọng:** File `_redirects` phải ở `public/` để được copy vào `build/` khi build.

## 🔄 So sánh 2 cách

| Tiêu chí | _redirects | netlify.toml |
|----------|-----------|--------------|
| **Đơn giản** | ✅ Cực đơn giản | ⚠️ Phức tạp hơn |
| **Linh hoạt** | ❌ Chỉ redirects | ✅ Cấu hình build + redirects |
| **Vị trí** | `public/_redirects` | Root của repo |
| **Ưu tiên** | Thấp | Cao (override _redirects) |

**Khuyến nghị:** Dùng CẢ HAI để đảm bảo:
- `_redirects`: Backup nếu netlify.toml không hoạt động
- `netlify.toml`: Cấu hình chính thức, rõ ràng hơn

## 🐛 Troubleshooting

### Lỗi 1: Vẫn 404 sau khi push

**Nguyên nhân:** Netlify chưa deploy lại

**Fix:**
1. Vào Netlify Dashboard
2. Tab "Deploys"
3. Click "Trigger deploy" → "Clear cache and deploy"

### Lỗi 2: _redirects không hoạt động

**Nguyên nhân:** File không được copy vào build folder

**Kiểm tra:**
```bash
# Sau khi build local
ls frontend/build/_redirects
```

Nếu không có file → File đặt sai vị trí

**Fix:** Đảm bảo file ở `frontend/public/_redirects`, không phải `frontend/_redirects`

### Lỗi 3: netlify.toml không hoạt động

**Nguyên nhân:** File đặt sai vị trí

**Fix:** File phải ở root của repo (cùng cấp với folder `frontend/`), không phải trong `frontend/`

```
✅ Đúng:
expense_ai/netlify.toml

❌ Sai:
expense_ai/frontend/netlify.toml
```

### Lỗi 4: API calls bị 404

**Nguyên nhân:** Redirect cả API calls

**Fix:** Thêm exception cho API:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://ltm-ai.onrender.com/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Giải thích:**
- Rule đầu: API calls → Proxy đến backend
- Rule sau: Tất cả còn lại → index.html
- Netlify xử lý theo thứ tự, rule đầu match trước

## 📚 Tài liệu tham khảo

- **Netlify Redirects**: https://docs.netlify.com/routing/redirects/
- **React Router + Netlify**: https://docs.netlify.com/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps
- **Netlify TOML**: https://docs.netlify.com/configure-builds/file-based-configuration/

## ✅ Checklist

- [ ] File `_redirects` có trong `frontend/public/`
- [ ] File `netlify.toml` có ở root của repo
- [ ] Đã push lên GitHub
- [ ] Netlify đã deploy lại
- [ ] Test truy cập trực tiếp các routes
- [ ] Test refresh trang
- [ ] Test API calls vẫn hoạt động

---

**Hoàn thành!** Giờ mọi routes đều hoạt động bình thường trên Netlify! 🎉
