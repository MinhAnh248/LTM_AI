# 🚀 Hướng dẫn Deploy Backend lên Render.com

## Bước 1: Chuẩn bị code

Code đã sẵn sàng với các file:
- ✅ `api_server.py` - Backend API đầy đủ tính năng
- ✅ `requirements.txt` - Dependencies
- ✅ `config/render.yaml` - Cấu hình Render

## Bước 2: Push code lên GitHub

```bash
cd c:\LTMang_AI\expense_ai
git add .
git commit -m "Update backend with full features"
git push origin main
```

## Bước 3: Deploy trên Render.com

1. Truy cập: https://dashboard.render.com
2. Chọn service: **expense-ai** (https://ltm-ai.onrender.com)
3. Click **Manual Deploy** > **Deploy latest commit**
4. Đợi 2-3 phút để deploy hoàn tất

## Bước 4: Kiểm tra Backend

Sau khi deploy xong, test các endpoints:

```bash
# Health check
curl https://ltm-ai.onrender.com/api/health

# Login test
curl -X POST https://ltm-ai.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123456"}'
```

## Bước 5: Cập nhật Frontend (nếu cần)

Frontend trên Netlify đã được cấu hình sẵn để kết nối với:
- Backend WAN: `https://ltm-ai.onrender.com/api`

Không cần thay đổi gì thêm!

## ⚠️ Lưu ý quan trọng

1. **Render Free Tier**: Backend sẽ sleep sau 15 phút không hoạt động
2. **Cold Start**: Lần đầu truy cập sau khi sleep mất ~30 giây
3. **Database**: Đang dùng SQLite, data sẽ mất khi redeploy

## 🔧 Troubleshooting

### Lỗi: "Module not found"
- Kiểm tra `requirements.txt` có đầy đủ dependencies
- Redeploy lại service

### Lỗi: "500 Internal Server Error"
- Xem logs trên Render Dashboard
- Kiểm tra database đã được khởi tạo chưa

### Lỗi: "CORS"
- Đã cấu hình CORS trong `api_server.py`
- Nếu vẫn lỗi, thêm domain Netlify vào whitelist

## 📊 Monitoring

- **Render Dashboard**: https://dashboard.render.com
- **Backend Logs**: Click vào service > Logs tab
- **Load Test**: http://localhost:8090 (chạy từ RUN_ALL.bat)
