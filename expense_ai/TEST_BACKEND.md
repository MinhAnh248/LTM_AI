# Test Backend

## Kiểm tra Backend đang chạy

1. Mở browser: https://ltm-ai.onrender.com/api/health
2. Nếu thấy `{"status": "ok", "message": "Backend is running"}` → Backend OK
3. Nếu lỗi 404/502 → Backend chưa deploy hoặc đang sleep

## Kiểm tra Frontend

1. Mở: https://projectname04.netlify.app
2. Nếu thấy trang login → Frontend OK
3. Nếu lỗi 404 → Netlify chưa deploy

## Nếu không mở được

### Backend không chạy:
- Vào https://dashboard.render.com
- Click service "LTM_AI"
- Xem tab "Logs" để biết lỗi gì
- Click "Manual Deploy" → "Deploy latest commit"

### Frontend không chạy:
- Vào https://app.netlify.com
- Click site "projectname04"
- Xem "Deploys" để biết lỗi gì
- Click "Trigger deploy"

## Nếu không quét được hóa đơn

Backend hiện tại chỉ trả về dữ liệu mẫu. Cần thêm OCR thật.

## Chạy local để test

```cmd
cd c:\LTMang_AI\expense_ai\expense_ai
python api_server.py
```

Mở: http://localhost:5000/api/health
