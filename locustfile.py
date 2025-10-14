import os
from locust import HttpUser, task, between

class ExpenseUser(HttpUser):
    wait_time = between(1, 5)  # Wait 1-5 seconds between tasks

    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        # For this test, we will access public endpoints.
        # If login was required, you would do it here.
        pass

    @task(10)
    def get_expenses(self):
        """Simulate user fetching the main expenses list."""
        self.client.get("/api/expenses")

    @task(5)
    def get_summary(self):
        """Simulate user viewing the summary dashboard."""
        self.client.get("/api/summary")

    @task(3)
    def add_expense(self):
        """Simulate user adding a new expense."""
        new_expense = {
            "date": "2025-10-13",
            "category": "an uong",
            "amount": 50000,
            "description": "Bua trua voi dong nghiep"
        }
        self.client.post("/api/expenses", json=new_expense)

    @task(2)
    def get_category_breakdown(self):
        """Simulate user checking the category breakdown chart."""
        self.client.get("/api/category-breakdown")

    @task(1)
    def get_ai_analysis(self):
        """Simulate user looking at the AI analysis page."""
        self.client.get("/api/analysis")
