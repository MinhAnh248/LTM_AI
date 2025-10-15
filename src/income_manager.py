import sqlite3
import pandas as pd

class IncomeManager:
    def __init__(self, db_path="expense_data.db"):
        self.db_path = db_path
    
    def add_income(self, user_id, date, category, amount, description):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        try:
            cursor.execute('''INSERT INTO incomes (user_id, date, category, amount, description)
                            VALUES (?, ?, ?, ?, ?)''', (user_id, date, category, amount, description))
            conn.commit()
            return {'success': True}
        except Exception as e:
            return {'success': False, 'error': str(e)}
        finally:
            conn.close()
    
    def get_incomes(self, user_id):
        conn = sqlite3.connect(self.db_path)
        try:
            return pd.read_sql_query('SELECT * FROM incomes WHERE user_id = ?', conn, params=(user_id,))
        finally:
            conn.close()
    
    def delete_income(self, user_id, income_id):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        try:
            cursor.execute('DELETE FROM incomes WHERE id = ? AND user_id = ?', (income_id, user_id))
            conn.commit()
            return {'success': True}
        finally:
            conn.close()
    
    def update_income(self, user_id, income_id, date, category, amount, description):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        try:
            cursor.execute('''UPDATE incomes SET date=?, category=?, amount=?, description=?
                            WHERE id=? AND user_id=?''', (date, category, amount, description, income_id, user_id))
            conn.commit()
            return {'success': True}
        finally:
            conn.close()
    
    def get_income_summary(self, user_id):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        try:
            cursor.execute('SELECT SUM(amount) FROM incomes WHERE user_id = ?', (user_id,))
            total = cursor.fetchone()[0] or 0
            return {'total': total}
        finally:
            conn.close()
