# 🔒 Phân quyền dữ liệu - Mỗi user có data riêng

## ✅ Đã cập nhật:

### Trước (Tất cả user xem chung):
```python
@app.route('/api/expenses')
def expenses():
    return jsonify(data_store['expenses'])  # Trả TẤT CẢ expenses
```

### Sau (Mỗi user chỉ xem của mình):
```python
@app.route('/api/expenses')
def expenses():
    user_id = get_user_id_from_token()  # Lấy user_id từ token
    user_expenses = [e for e in data_store['expenses'] 
                     if e.get('user_id') == user_id]  # Lọc theo user_id
    return jsonify(user_expenses)  # Chỉ trả expenses của user này
```

---

## 🎯 Cách hoạt động:

```
User A đăng nhập → Nhận token A
  ↓
User A thêm expense → Lưu với user_id = A
  ↓
User A xem expenses → Chỉ thấy expenses có user_id = A
  ↓
User B đăng nhập → Nhận token B
  ↓
User B xem expenses → Chỉ thấy expenses có user_id = B
  ↓
User A và User B KHÔNG thấy data của nhau!
```

---

## 📊 Dữ liệu được phân quyền:

- ✅ Expenses (Chi tiêu)
- ✅ Incomes (Thu nhập)
- ✅ Budgets (Ngân sách)
- ✅ Debts (Nợ)
- ✅ Savings (Tiết kiệm)
- ✅ Reminders (Nhắc nhở)
- ✅ Summary (Thống kê)

---

## 🔐 Bảo mật:

### 1. Token authentication
```javascript
// Frontend gửi token trong mọi request
fetch('/api/expenses', {
    headers: {
        'Authorization': localStorage.getItem('token')
    }
});
```

### 2. Backend kiểm tra token
```python
def get_user_id_from_token():
    token = request.headers.get('Authorization')
    user = find_user_by_token(token)
    return user['id']
```

### 3. Lọc dữ liệu theo user_id
```python
user_expenses = [e for e in expenses if e['user_id'] == user_id]
```

---

## 🧪 Test phân quyền:

### User A:
```bash
# Đăng ký User A
curl -X POST /api/register -d '{"email":"userA@test.com","password":"123"}'

# Đăng nhập User A
curl -X POST /api/login -d '{"email":"userA@test.com","password":"123"}'
# Response: {"token": "token-A"}

# Thêm expense với token A
curl -X POST /api/expenses \
  -H "Authorization: token-A" \
  -d '{"amount":100,"description":"Expense A"}'

# Xem expenses với token A
curl /api/expenses -H "Authorization: token-A"
# Response: [{"amount":100,"description":"Expense A","user_id":1}]
```

### User B:
```bash
# Đăng ký User B
curl -X POST /api/register -d '{"email":"userB@test.com","password":"123"}'

# Đăng nhập User B
curl -X POST /api/login -d '{"email":"userB@test.com","password":"123"}'
# Response: {"token": "token-B"}

# Xem expenses với token B
curl /api/expenses -H "Authorization: token-B"
# Response: []  ← KHÔNG thấy expense của User A!

# Thêm expense với token B
curl -X POST /api/expenses \
  -H "Authorization: token-B" \
  -d '{"amount":200,"description":"Expense B"}'

# Xem expenses với token B
curl /api/expenses -H "Authorization: token-B"
# Response: [{"amount":200,"description":"Expense B","user_id":2}]
```

---

## ✅ Kết quả:

- ✅ User A chỉ thấy data của User A
- ✅ User B chỉ thấy data của User B
- ✅ Không thể xem data của người khác
- ✅ Không thể sửa/xóa data của người khác
- ✅ Mỗi user có không gian riêng biệt

---

## 🚀 Deploy:

```bash
cd c:\LTMang_AI
git add .
git commit -m "Add user data isolation - each user has separate data"
git push origin main
```

Render tự động deploy!

---

## 📱 Frontend không cần thay đổi:

Frontend đã gửi token trong mọi request:
```javascript
// services/api.js
const token = localStorage.getItem('token');
fetch(url, {
    headers: {
        'Authorization': token
    }
});
```

Backend tự động lọc data theo token!

---

## 🎯 Tóm tắt:

**Trước:** Tất cả user xem chung data  
**Sau:** Mỗi user có data riêng, hoàn toàn tách biệt

**Bảo mật:** Token-based authentication + User ID filtering

**Kết quả:** Multi-user system hoàn chỉnh! 🎉
