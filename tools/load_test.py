from locust import HttpUser, task, between
import random
from datetime import datetime, timedelta

class ExpenseUser(HttpUser):
    wait_time = between(1, 3)
    
    def on_start(self):
        """Login khi user bắt đầu"""
        response = self.client.post("/api/auth/login", json={
            "email": "admin@example.com",
            "password": "123456"
        })
        if response.status_code == 200:
            data = response.json()
            self.token = data.get('token')
            self.client.headers.update({'Authorization': f'Bearer {self.token}'})
    
    @task(3)
    def view_expenses(self):
        """Xem danh sách chi tiêu"""
        self.client.get("/api/expenses")
    
    @task(2)
    def view_summary(self):
        """Xem tổng quan"""
        self.client.get("/api/summary")
    
    @task(2)
    def view_category_breakdown(self):
        """Xem phân loại chi tiêu"""
        self.client.get("/api/category-breakdown")
    
    @task(1)
    def add_expense(self):
        """Thêm chi tiêu mới"""
        categories = ['an uong', 'di lai', 'mua sam', 'suc khoe', 'giai tri', 'hoc tap']
        amounts = [20000, 50000, 100000, 150000, 200000, 500000]
        
        self.client.post("/api/expenses", json={
            "date": datetime.now().strftime('%Y-%m-%d'),
            "category": random.choice(categories),
            "amount": random.choice(amounts),
            "description": f"Test expense {random.randint(1, 1000)}"
        })
    
    @task(1)
    def view_incomes(self):
        """Xem thu nhập"""
        self.client.get("/api/incomes")
    
    @task(1)
    def view_budget(self):
        """Xem ngân sách"""
        self.client.get("/api/budget")
