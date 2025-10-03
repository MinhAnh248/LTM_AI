<img width="1600" alt="demo-app" src="https://github.com/user-attachments/assets/b0756efb-814e-4f31-a8ae-1aa88fa48491" />

# 🧾 Ứng Dụng Quản Lý & Nhận Diện Hóa Đơn

## 📌 Tổng quan

Đây là một ứng dụng web hỗ trợ người dùng tải lên hóa đơn (ảnh/PDF) và áp dụng công nghệ OCR (Tesseract.js) kết hợp AI (Gemini) để:

- Trích xuất văn bản từ hóa đơn.

- Phân tích, bóc tách dữ liệu quan trọng như: cửa hàng, ngày mua, tổng tiền, danh sách mặt hàng.

- Cho phép lưu trữ và tìm kiếm hóa đơn dễ dàng với Firebase Firestore.

<img width="1400" alt="ocr-preview" src="https://github.com/user-attachments/assets/1b42f882-5738-495f-8e1f-bee58a879e41" />

## 🚀 Các chức năng chính

- **🔤 OCR đa ngôn ngữ**: Hỗ trợ nhận diện Tiếng Việt, Tiếng Anh hoặc chế độ tự động.

- **🤖 Phân tích bằng AI**: Gemini tự động phân loại và sắp xếp thông tin từ văn bản.

- **👀 Xem & Tìm kiếm**:

   - Hiển thị chi tiết kết quả phân tích.

   - Tìm hóa đơn đã lưu theo cửa hàng, ngày hoặc tổng tiền.

- **📑 Xuất & chia sẻ dữ liệu**:

   - Copy thông tin vào clipboard.

   - Xuất ra file Excel (.xlsx).

   - Lưu trực tiếp lên Firestore để quản lý lâu dài.

## 🗂️ Quản lý dữ liệu:

- Xem lại toàn bộ hóa đơn đã lưu.

- Xóa khi không cần thiết.

## 🛠️ Công nghệ tích hợp

- Giao diện: HTML5, TailwindCSS

- Nhận diện văn bản: Tesseract.js
.
- Trí tuệ nhân tạo: Google Gemini API.

- Cơ sở dữ liệu: Firebase Firestore.

- Đăng nhập: Firebase Authentication (ẩn danh).

## 📂 Cấu trúc dự án

- BTLApp.html → chứa toàn bộ giao diện và logic chính.

- Gồm 2 phần chính:

   - Upload & Phân tích (người dùng tải hóa đơn lên).

   - Hóa đơn đã lưu (quản lý & tìm kiếm dữ liệu).

## ⚡ Hướng dẫn sử dụng

- Tải file BTLApp.html về máy tính.

- Mở trực tiếp trên trình duyệt (Chrome/Edge/Firefox).

- Tải lên hình ảnh hoặc PDF hóa đơn.

- Xem kết quả phân tích ở phần hiển thị bên phải.

Có thể xuất ra Excel hoặc lưu lên Firebase để quản lý.

## 📸 Giao diện người dùng

- Thiết kế hiện đại với TailwindCSS.

- Hỗ trợ xem trước ảnh trước khi xử lý.

- Kết quả hiển thị rõ ràng: bảng sản phẩm + tổng tiền nổi bật.

---

✨ Đây là giải pháp tiện lợi cho cá nhân, kế toán hoặc doanh nghiệp trong việc số hóa hóa đơn và quản lý chi phí nhanh chóng, hiệu quả.

---
<h2 id="copyright">© Bản quyền</h2>
    <div align="center">
        <p>© 2025 Nguyễn Trung Hiếu - Nhóm 11-CNTT_17-04, Khoa Công nghệ Thông tin, Đại học Đại Nam.</p>
        <p>Được thực hiện bởi<br>
        <strong>Nhóm 11-CNTT_17-04 tại Đại học Đại Nam</strong></p>
        <p><strong>Email liên hệ:</strong> <a href="mailto:hieutrungngyen962005@gmail.com">hieutrungnguyen962005@gmail.com</a></p>
    </div>
