import sqlite3
import json
from datetime import datetime

def view_database():
    """Xem toàn bộ database"""
    
    try:
        conn = sqlite3.connect('expense_data.db')
        cursor = conn.cursor()
        
        print("=" * 80)
        print("DATABASE VIEWER - expense_data.db")
        print("=" * 80)
        print()
        
        # Lấy danh sách tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        print(f"📊 Tổng số bảng: {len(tables)}")
        print()
        
        # Xem từng table
        for table in tables:
            table_name = table[0]
            
            # Đếm số records
            cursor.execute(f'SELECT COUNT(*) FROM {table_name}')
            count = cursor.fetchone()[0]
            
            print(f"📋 Bảng: {table_name}")
            print(f"   Số records: {count}")
            
            if count > 0:
                # Lấy columns
                cursor.execute(f'SELECT * FROM {table_name} LIMIT 1')
                columns = [description[0] for description in cursor.description]
                print(f"   Columns: {', '.join(columns)}")
                
                # Lấy 5 records đầu
                cursor.execute(f'SELECT * FROM {table_name} LIMIT 5')
                rows = cursor.fetchall()
                
                print(f"   Dữ liệu mẫu (5 records đầu):")
                for i, row in enumerate(rows, 1):
                    print(f"      {i}. {row}")
            
            print()
        
        # Thống kê tổng quan
        print("=" * 80)
        print("📈 THỐNG KÊ TỔNG QUAN")
        print("=" * 80)
        
        stats = {}
        for table in tables:
            table_name = table[0]
            cursor.execute(f'SELECT COUNT(*) FROM {table_name}')
            stats[table_name] = cursor.fetchone()[0]
        
        for table_name, count in stats.items():
            print(f"   {table_name}: {count} records")
        
        # Kích thước file
        import os
        if os.path.exists('expense_data.db'):
            size = os.path.getsize('expense_data.db')
            print(f"\n   Kích thước file: {size:,} bytes ({size/1024:.2f} KB)")
        
        conn.close()
        
        print()
        print("=" * 80)
        print("✅ Hoàn tất!")
        print("=" * 80)
        
    except Exception as e:
        print(f"❌ Lỗi: {e}")

def export_to_json():
    """Export database ra file JSON"""
    
    try:
        conn = sqlite3.connect('expense_data.db')
        cursor = conn.cursor()
        
        # Lấy tất cả tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        result = {}
        
        for table in tables:
            table_name = table[0]
            cursor.execute(f'SELECT * FROM {table_name}')
            columns = [description[0] for description in cursor.description]
            rows = cursor.fetchall()
            
            # Convert to list of dicts
            result[table_name] = [
                dict(zip(columns, row)) for row in rows
            ]
        
        conn.close()
        
        # Save to JSON
        filename = f'database_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Đã export database ra file: {filename}")
        
    except Exception as e:
        print(f"❌ Lỗi: {e}")

if __name__ == '__main__':
    import sys
    
    print()
    print("🔍 DATABASE VIEWER")
    print()
    print("Chọn chức năng:")
    print("1. Xem database")
    print("2. Export ra JSON")
    print()
    
    if len(sys.argv) > 1:
        choice = sys.argv[1]
    else:
        choice = input("Nhập lựa chọn (1 hoặc 2): ")
    
    if choice == '1':
        view_database()
    elif choice == '2':
        export_to_json()
    else:
        print("❌ Lựa chọn không hợp lệ!")
