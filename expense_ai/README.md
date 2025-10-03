# 🤖 AI Expense Manager

Hệ thống quản lý chi tiêu thông minh với AI - Phân loại tự động, phân tích xu hướng, và gợi ý tiết kiệm cá nhân hóa.

![AI Expense Manager](https://img.shields.io/badge/AI-Expense%20Manager-blue?style=for-the-badge&logo=robot)
![Python](https://img.shields.io/badge/Python-3.8+-green?style=flat-square&logo=python)
![React](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)
![Flask](https://img.shields.io/badge/Flask-2.3+-red?style=flat-square&logo=flask)

## ✨ Tính năng nổi bật

### 🧠 AI Thông minh
- **Phân loại tự động**: Nhập "ăn phở" → AI tự động phân loại "ăn uống"
- **Phân tích xu hướng**: Theo dõi pattern chi tiêu của bạn
- **Dự đoán chi tiêu**: Dự báo chi tiêu tuần tới
- **Gợi ý tiết kiệm**: Lời khuyên cá nhân hóa dựa trên thói quen

### 📊 Dashboard Trực quan
- Biểu đồ tròn phân bổ theo danh mục
- Biểu đồ đường xu hướng theo thời gian
- Thống kê tổng quan: tổng chi tiêu, trung bình/ngày
- Responsive design, đẹp trên mọi thiết bị

### 💰 Quản lý Ngân sách
- Đặt ngân sách cho từng danh mục
- Theo dõi tiến độ chi tiêu real-time
- Cảnh báo khi sắp vượt ngân sách
- Progress bar trực quan với màu sắc thông minh

### 📋 Quản lý Giao dịch
- Form nhập liệu thông minh với AI suggestions
- Lịch sử giao dịch với bộ lọc mạnh mẽ
- Tìm kiếm theo mô tả, danh mục, thời gian
- Chỉnh sửa/xóa giao dịch (coming soon)

### 📊 Báo cáo & Phân tích
- Báo cáo chi tiết theo khoảng thời gian
- Phân tích AI: xu hướng, dự đoán, gợi ý
- Xuất báo cáo Excel/PDF (coming soon)
- Insights thông minh về thói quen chi tiêu

## 🚀 Cài đặt nhanh

### Cách 1: Chạy tự động (Windows)
```bash
# Clone repository
git clone <repository-url>
cd expense_ai

# Chạy script tự động (Windows)
start_app.bat
```

### Cách 2: Chạy thủ công

#### Backend (Python Flask)
```bash
# Cài đặt dependencies
pip install -r requirements.txt

# Tạo dữ liệu mẫu (tùy chọn)
python create_sample_data.py

# Chạy API server
python api_server.py
```

#### Frontend (React)
```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm start
```

### Cách 3: Chạy với script Python
```bash
python start_app.py
```

## 🎯 Demo & Screenshots

### Dashboard
- 📊 Tổng quan chi tiêu với biểu đồ đẹp mắt
- 📈 Xu hướng chi tiêu theo thời gian
- 🏷️ Phân bổ theo danh mục

### AI Smart Input
- 🤖 Nhập "mua cafe" → AI gợi ý "ăn uống"
- ⚡ Real-time suggestions
- 🎯 Độ chính xác cao với từ khóa tiếng Việt

### Budget Management
- 🎯 Đặt ngân sách cho từng danh mục
- 📊 Progress bar với màu sắc thông minh
- ⚠️ Cảnh báo khi vượt ngân sách

## �️ Công nghệ sử dụng

### Backend
- **Flask**: Web framework nhẹ và linh hoạt
- **SQLite**: Database đơn giản, không cần setup
- **Pandas**: Xử lý và phân tích dữ liệu
- **AI Classifier**: Thuật toán phân loại tùy chỉnh

### Frontend
- **React 18**: UI framework hiện đại
- **Styled Components**: CSS-in-JS styling
- **Recharts**: Biểu đồ đẹp và tương tác
- **Lucide React**: Icons đẹp và nhất quán
- **React Hot Toast**: Notifications thông minh

### Features
- **Responsive Design**: Hoạt động tốt trên mọi thiết bị
- **Real-time Updates**: Cập nhật dữ liệu ngay lập tức
- **Modern UI/UX**: Giao diện đẹp, dễ sử dụng
- **Vietnamese Support**: Tối ưu cho người Việt

## 📁 Cấu trúc dự án

```
expense_ai/
├── 🐍 Backend (Python Flask)
│   ├── src/
│   │   ├── ai_classifier.py      # 🤖 AI phân loại
│   │   ├── ai_advisor.py         # 💡 AI phân tích & gợi ý
│   │   ├── sqlite_database.py    # 💾 Database SQLite
│   │   └── db_factory.py         # 🏭 Database factory
│   ├── api_server.py             # 🌐 Flask API server
│   └── requirements.txt          # 📦 Python dependencies
│
├── ⚛️ Frontend (React)
│   ├── src/
│   │   ├── components/           # 🧩 React components
│   │   ├── pages/               # 📄 Các trang chính
│   │   ├── services/            # 🔌 API client
│   │   └── App.js               # 🚀 Main app
│   ├── public/                  # 🌐 Static files
│   └── package.json             # 📦 Node dependencies
│
├── 🚀 Scripts & Docs
│   ├── start_app.py             # 🐍 Python startup script
│   ├── start_app.bat            # 🪟 Windows batch script
│   ├── create_sample_data.py    # 🎯 Tạo dữ liệu mẫu
│   ├── SETUP.md                 # 📖 Hướng dẫn chi tiết
│   └── README.md                # 📋 File này
```

## 🎯 Roadmap

### Version 2.0 (Coming Soon)
- [ ] 📱 Mobile App (React Native)
- [ ] 🔐 User Authentication & Multi-user
- [ ] 📊 Advanced Analytics với Machine Learning
- [ ] 🏦 Tích hợp API ngân hàng
- [ ] 📄 Xuất báo cáo Excel/PDF
- [ ] 🤖 ChatGPT integration cho tư vấn chi tiêu

### Version 2.1
- [ ] 📸 OCR nhận diện hóa đơn
- [ ] 👨‍👩‍👧‍👦 Chia sẻ ngân sách gia đình
- [ ] 🔔 Push notifications
- [ ] 📈 Đầu tư tracking
- [ ] 🌍 Multi-language support

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Hãy:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ & Hỗ trợ

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](link-to-issues)
- 💬 Discussions: [GitHub Discussions](link-to-discussions)

## 🙏 Acknowledgments

- [Recharts](https://recharts.org/) - Thư viện biểu đồ tuyệt vời
- [Lucide](https://lucide.dev/) - Icons đẹp và nhất quán
- [Styled Components](https://styled-components.com/) - CSS-in-JS tuyệt vời
- [Flask](https://flask.palletsprojects.com/) - Web framework Python tuyệt vời

---

**⭐ Nếu project này hữu ích, hãy cho chúng tôi một star nhé! ⭐**

*Made with ❤️ for Vietnamese users*