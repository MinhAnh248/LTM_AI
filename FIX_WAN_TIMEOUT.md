# Fix WAN Timeout Issue

## Vấn đề
Render deploy bị timeout sau 15 phút vì:
1. Code trên GitHub cũ (commit 21186b3)
2. File api_server.py trên GitHub khác với local
3. Thiếu hoặc lỗi dependencies

## Giải pháp nhanh

### Bước 1: Copy file WAN đơn giản
```bash
copy c:\LTMang_AI\expense_ai\api_server_wan.py c:\LTMang_AI\expense_ai\api_server.py
```

### Bước 2: Push lên GitHub
```bash
cd c:\LTMang_AI
git add expense_ai/api_server.py
git commit -m "Fix: Simple WAN API server"
git push origin main
```

### Bước 3: Manual Deploy trên Render
1. Vào https://dashboard.render.com
2. Chọn service "LTM_AI"
3. Click "Manual Deploy" > "Deploy latest commit"
4. Đợi 2-3 phút

## Kiểm tra
- Backend: https://ltm-ai.onrender.com/api/health
- Nếu trả về `{"status": "ok"}` là thành công

## Lưu ý
- Render free tier sẽ sleep sau 15 phút
- Request đầu tiên sau sleep mất 30-50 giây
- Đây là giới hạn của free tier

## Nếu vẫn lỗi
Dùng LAN mode thay thế:
```bash
cd c:\LTMang_AI\expense_ai\scripts
RUN_LAN.bat
```
