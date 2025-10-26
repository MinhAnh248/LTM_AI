# Fix Render Gevent Error

Vào Render Dashboard:
1. https://dashboard.render.com/web/srv-d3mt0tm3jp1c73d28150
2. Settings > Start Command
3. Xóa: `cd expense_ai && gunicorn --worker-class gevent --workers 1 --bind 0.0.0.0:$PORT api_server:app`
4. Thay bằng: `gunicorn --workers 1 --bind 0.0.0.0:$PORT --chdir expense_ai api_server:app`
5. Save Changes
6. Manual Deploy
