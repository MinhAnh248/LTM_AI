import sqlite3
import pandas as pd

class ReminderManager:
    def __init__(self, db_path="expense_data.db"):
        self.db_path = db_path
    
    def add_reminder(self, user_id, title, reminder_type, due_date, amount, repeat_type, repeat_interval, description):
        return {'success': True}
    
    def get_reminders(self, user_id, include_completed=False):
        return pd.DataFrame()
    
    def mark_completed(self, user_id, reminder_id):
        return {'success': True}
    
    def delete_reminder(self, user_id, reminder_id):
        return {'success': True}
    
    def get_due_reminders(self, user_id, days_ahead=7):
        return pd.DataFrame()
    
    def get_reminder_summary(self, user_id):
        return {'active_reminders': 0, 'overdue': 0, 'due_today': 0, 'due_this_week': 0}
