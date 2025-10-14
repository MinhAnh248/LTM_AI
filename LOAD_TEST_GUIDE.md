# Load Test Guide - 100 Users Concurrent

## Chuẩn bị

1. **Cài đặt Locust** (nếu chưa có):
```bash
pip install locust
```

2. **Khởi động Backend**:
```bash
python api_server.py
```

3. **Đảm bảo Ngrok đang chạy** và trỏ đến port 5000

## Chạy Load Test

### Cách 1: Sử dụng Web UI (Khuyến nghị)

1. Chạy script:
```bash
run_load_test.bat
```

2. Mở trình duyệt: `http://localhost:8089`

3. Nhập thông tin:
   - **Host**: `https://uniocular-abraham-phrenetically.ngrok-free.dev`
   - **Number of users**: `100`
   - **Spawn rate**: `10` (tăng 10 users/giây)

4. Click **"Start swarming"**

5. Quan sát kết quả:
   - **RPS** (Requests per second): Số request/giây
   - **Response time**: Thời gian phản hồi
   - **Failures**: Số lỗi
   - **Charts**: Biểu đồ real-time

### Cách 2: Chạy Command Line (Headless)

```bash
locust -f load_test.py --host=https://uniocular-abraham-phrenetically.ngrok-free.dev --users 100 --spawn-rate 10 --run-time 5m --headless
```

## Kịch bản Test

Script sẽ mô phỏng người dùng thực hiện:
- **60%**: Xem danh sách chi tiêu
- **40%**: Xem tổng quan & phân loại
- **20%**: Thêm chi tiêu mới
- **20%**: Xem thu nhập & ngân sách

## Đánh giá kết quả

### ✅ Hệ thống tốt nếu:
- Response time < 1000ms (1 giây)
- Failure rate < 1%
- RPS > 50 requests/second

### ⚠️ Cần tối ưu nếu:
- Response time > 2000ms (2 giây)
- Failure rate > 5%
- RPS < 20 requests/second

### ❌ Hệ thống quá tải nếu:
- Response time > 5000ms (5 giây)
- Failure rate > 10%
- Nhiều timeout errors

## Tối ưu hóa (nếu cần)

1. **Sử dụng Production Server**:
```bash
pip install waitress
waitress-serve --host=0.0.0.0 --port=5000 api_server:app
```

2. **Tăng workers**:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 api_server:app
```

3. **Enable caching** trong database queries

4. **Sử dụng CDN** cho static files

## Lưu ý

- Ngrok free tier có giới hạn: 40 requests/minute
- Để test thực sự 100 users, cần ngrok paid hoặc deploy lên server thật
- Test trên localhost sẽ cho kết quả tốt hơn nhiều so với qua ngrok
