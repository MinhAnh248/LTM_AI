import sqlite3
from datetime import datetime, timedelta
import random

def create_sample_data():
    conn = sqlite3.connect('expense_data.db')
    cursor = conn.cursor()
    
    data = {
        'an uong': (['Cơm trưa', 'Cafe', 'Ăn sáng'], [20000, 50000, 80000]),
        'di lai': (['Grab', 'Xăng xe', 'Xe bus'], [15000, 50000, 100000]),
        'mua sam': (['Quần áo', 'Giày dép', 'Điện thoại'], [200000, 500000, 1000000]),
        'suc khoe': (['Thuốc', 'Khám bệnh', 'Gym'], [50000, 200000, 500000]),
        'giai tri': (['Xem phim', 'Du lịch', 'Cafe'], [50000, 200000, 300000]),
        'hoc tap': (['Sách', 'Khóa học', 'Laptop'], [100000, 300000, 1000000])
    }
    
    for _ in range(50):
        cat = random.choice(list(data.keys()))
        cursor.execute('INSERT INTO expenses VALUES (?, ?, ?, ?, ?)', (
            1,
            (datetime.now() - timedelta(days=random.randint(0, 30))).strftime('%Y-%m-%d'),
            cat,
            random.choice(data[cat][1]),
            random.choice(data[cat][0])
        ))
    
    for _ in range(10):
        cursor.execute('INSERT INTO incomes VALUES (?, ?, ?, ?, ?)', (
            1,
            (datetime.now() - timedelta(days=random.randint(0, 30))).strftime('%Y-%m-%d'),
            random.choice(['Lương', 'Thưởng', 'Làm thêm']),
            random.choice([5000000, 10000000, 15000000]),
            'Thu nhập'
        ))
    
    conn.commit()
    conn.close()
    print("✅ Đã tạo dữ liệu mẫu!")

if __name__ == '__main__':
    create_sample_data()
