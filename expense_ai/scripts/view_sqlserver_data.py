import sys
import os

# Add parent directory to path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(parent_dir, 'src'))

from db_factory import get_database

db = get_database()

print("=" * 60)
print("📊 DỮ LIỆU SQL SERVER - ExpenseDB")
print("=" * 60)

# Thu nhập
print("\n💰 THU NHẬP:")
print("-" * 60)
incomes = db.get_incomes()
if incomes.empty:
    print("Chưa có dữ liệu thu nhập")
else:
    print(incomes.to_string(index=False))

# Chi tiêu
print("\n💸 CHI TIÊU:")
print("-" * 60)
expenses = db.get_expenses()
if expenses.empty:
    print("Chưa có dữ liệu chi tiêu")
else:
    print(expenses.to_string(index=False))

# Ngân sách
print("\n💼 NGÂN SÁCH:")
print("-" * 60)
budget_info = db.get_remaining_budget()
print(f"Tổng thu nhập:    {budget_info['total_income']:,.0f} đ")
print(f"Tổng chi tiêu:    {budget_info['total_expense']:,.0f} đ")
print(f"Ngân sách còn:    {budget_info['remaining_budget']:,.0f} đ")

print("\n" + "=" * 60)
