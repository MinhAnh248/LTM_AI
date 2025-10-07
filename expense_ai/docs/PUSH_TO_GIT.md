# 📤 Hướng dẫn Push lên Git

## Bước 1: Khởi tạo Git (nếu chưa có)

```bash
cd C:\LTMang_AI\expense_ai
git init
```

## Bước 2: Thêm remote repository

```bash
# Thay YOUR_REPO_URL bằng URL repo của bạn
git remote add origin YOUR_REPO_URL

# Ví dụ:
# git remote add origin https://github.com/username/expense-ai.git
```

## Bước 3: Add và Commit

```bash
git add .
git commit -m "Initial commit - AI Expense Manager with SQL Server"
```

## Bước 4: Push lên Git

```bash
# Lần đầu tiên
git push -u origin main

# Hoặc nếu branch là master
git push -u origin master
```

## Cập nhật sau này

```bash
git add .
git commit -m "Update: mô tả thay đổi"
git push
```

## Lưu ý cho nhóm

### Khi clone về máy khác:

```bash
git clone YOUR_REPO_URL
cd expense_ai
```

### Cài đặt dependencies:

**Backend:**
```bash
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### Cấu hình SQL Server:

Sửa file `config.py`:
```python
SQLSERVER_CONFIG = {
    "server": "TÊN_SERVER_CỦA_BẠN\\SQLEXPRESS",
    "database": "ExpenseDB",
    "trusted_connection": True
}
```

### Khởi động:

```bash
# Cách 1: Tự động
start.bat

# Cách 2: Python
python start.py

# Cách 3: Thủ công
python api_server.py
cd frontend && npm start
```

## Các file quan trọng đã được ignore:

- ❌ `node_modules/` - Cài lại bằng `npm install`
- ❌ `__pycache__/` - Python tự tạo
- ❌ `*.db` - Database local
- ❌ `.env` - Biến môi trường

## Checklist trước khi push:

- ✅ Đã test chạy được trên máy local
- ✅ Đã xóa các file nhạy cảm (API keys, passwords)
- ✅ Đã cập nhật README.md
- ✅ Đã thêm .gitignore
- ✅ Frontend đã build thành công
