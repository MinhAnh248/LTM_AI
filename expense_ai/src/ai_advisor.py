import pandas as pd
from datetime import datetime, timedelta

class ExpenseAdvisor:
    def __init__(self, db):
        self.db = db
    
    def analyze_spending_pattern(self):
        df = self.db.get_expenses()
        if df.empty:
            return "Chưa có dữ liệu chi tiêu để phân tích."
        
        df['date'] = pd.to_datetime(df['date'])
        current_month = datetime.now().month
        current_year = datetime.now().year
        
        # Chi tiêu tháng hiện tại
        current_month_data = df[
            (df['date'].dt.month == current_month) & 
            (df['date'].dt.year == current_year)
        ]
        
        if current_month_data.empty:
            return "Chưa có chi tiêu nào trong tháng này."
        
        total_current = current_month_data['amount'].sum()
        by_category = current_month_data.groupby('category')['amount'].sum()
        
        # Tính phần trăm theo danh mục
        category_percent = (by_category / total_current * 100).round(1)
        
        advice = []
        advice.append(f"📊 Tổng chi tiêu tháng này: {total_current:,.0f}đ")
        advice.append("\n🏷️ Phân bổ theo danh mục:")
        
        for category, percent in category_percent.items():
            advice.append(f"  • {category}: {percent}% ({by_category[category]:,.0f}đ)")
            
            # Đưa ra lời khuyên
            if category == 'ăn uống' and percent > 30:
                advice.append("    ⚠️ Chi tiêu ăn uống cao! Nên nấu ăn tại nhà nhiều hơn.")
            elif category == 'giải trí' and percent > 20:
                advice.append("    ⚠️ Chi tiêu giải trí cao! Cân nhắc giảm bớt.")
        
        return "\n".join(advice)
    
    def predict_next_week(self):
        df = self.db.get_expenses()
        if len(df) < 7:
            return "Cần ít nhất 7 ngày dữ liệu để dự đoán."
        
        df['date'] = pd.to_datetime(df['date'])
        last_week = df[df['date'] >= (datetime.now() - timedelta(days=7))]
        
        if last_week.empty:
            avg_daily = df['amount'].sum() / len(df['date'].dt.date.unique())
        else:
            avg_daily = last_week['amount'].sum() / 7
        
        predicted_week = avg_daily * 7
        
        return f"💡 Dự đoán chi tiêu tuần tới: {predicted_week:,.0f}đ (dựa trên xu hướng gần đây)"
    
    def get_savings_tips(self):
        df = self.db.get_expenses()
        if df.empty:
            return "Chưa có dữ liệu để đưa ra lời khuyên tiết kiệm."
        
        by_category = df.groupby('category')['amount'].sum().sort_values(ascending=False)
        top_category = by_category.index[0]
        
        tips = {
            'ăn uống': "🍽️ Nấu ăn tại nhà, mang cơm trưa, hạn chế order đồ ăn",
            'đi lại': "🚗 Sử dụng phương tiện công cộng, đi chung xe, đi bộ khi có thể",
            'giải trí': "🎮 Tìm hoạt động miễn phí, giảm đi bar/karaoke",
            'học tập': "📚 Tìm khóa học online miễn phí, mượn sách thư viện",
            'hóa đơn': "💡 Tiết kiệm điện nước, chọn gói cước phù hợp"
        }
        
        return f"💰 Lời khuyên tiết kiệm cho '{top_category}' (chi tiêu cao nhất):\n{tips.get(top_category, 'Theo dõi chi tiêu thường xuyên')}"