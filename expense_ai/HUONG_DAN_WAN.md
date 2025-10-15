# Hướng dẫn chạy WAN Mode

## Vấn đề hiện tại
- Render.com đang deploy code CŨ từ GitHub (commit 21186b3)
- Code mới nhất chưa được push lên GitHub
- Free tier của Render sẽ sleep sau 15 phút không hoạt động
- Khi sleep, cần 30-50 giây để wake up

## Giải pháp

### Cách 1: Push code mới lên GitHub (Khuyến nghị)
```bash
cd c:\LTMang_AI
git add .
git commit -m "Update: Full LAN support with OCR, fix all APIs"
git push origin main
```

Sau đó vào Render Dashboard và click "Manual Deploy"

### Cách 2: Chạy LAN mode thay thế
```bash
cd c:\LTMang_AI\expense_ai\scripts
RUN_LAN.bat
```

## Lưu ý về Render Free Tier
- Server sẽ sleep sau 15 phút không hoạt động
- Request đầu tiên sau khi sleep sẽ mất 30-50 giây
- Đây là giới hạn của free tier, không thể tránh được
- Nếu cần server luôn online, cần upgrade lên paid plan

## Kiểm tra trạng thái
- Frontend WAN: https://projectname04.netlify.app
- Backend WAN: https://ltm-ai.onrender.com/api/health
- Nếu backend trả về 502/504, có nghĩa server đang sleep, đợi 30s rồi thử lại
