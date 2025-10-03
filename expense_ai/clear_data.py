import sys
sys.path.append('src')

from db_factory import get_database

db = get_database()

print("Đang xóa toàn bộ dữ liệu...")
db.clear_all_data()
print("✅ Đã xóa toàn bộ dữ liệu (thu nhập, chi tiêu, ngân sách)")
print("Bạn có thể bắt đầu lại từ đầu!")
