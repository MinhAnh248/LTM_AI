import sqlite3
import pandas as pd

class SQLiteExpenseDB:
    def __init__(self, db_path='expense_data.db'):
        self.db_path = db_path
        self._init_db()
    
    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT,
                category TEXT,
                amount REAL,
                description TEXT,
                user_id INTEGER DEFAULT 1
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS incomes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT,
                category TEXT,
                amount REAL,
                description TEXT,
                user_id INTEGER DEFAULT 1
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def get_expenses(self):
        conn = sqlite3.connect(self.db_path)
        df = pd.read_sql_query('SELECT * FROM expenses ORDER BY date DESC', conn)
        conn.close()
        return df
    
    def add_expense(self, date, category, amount, description):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO expenses (date, category, amount, description) VALUES (?, ?, ?, ?)',
            (str(date), category, amount, description)
        )
        conn.commit()
        conn.close()
    
    def delete_expense(self, expense_id):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM expenses WHERE id = ?', (expense_id,))
        conn.commit()
        conn.close()
    
    def update_expense(self, expense_id, date, category, amount, description):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            'UPDATE expenses SET date=?, category=?, amount=?, description=? WHERE id=?',
            (str(date), category, amount, description, expense_id)
        )
        conn.commit()
        conn.close()
    
    def get_incomes(self):
        conn = sqlite3.connect(self.db_path)
        df = pd.read_sql_query('SELECT * FROM incomes ORDER BY date DESC', conn)
        conn.close()
        return df
    
    def add_income(self, date, category, amount, description):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO incomes (date, category, amount, description) VALUES (?, ?, ?, ?)',
            (str(date), category, amount, description)
        )
        conn.commit()
        conn.close()
    
    def get_summary(self):
        df = self.get_expenses()
        if df.empty:
            return {'total': 0, 'count': 0, 'average': 0}
        return {
            'total': float(df['amount'].sum()),
            'count': len(df),
            'average': float(df['amount'].mean())
        }
    
    def get_remaining_budget(self):
        expenses_df = self.get_expenses()
        incomes_df = self.get_incomes()
        
        total_expenses = expenses_df['amount'].sum() if not expenses_df.empty else 0
        total_income = incomes_df['amount'].sum() if not incomes_df.empty else 0
        
        return {
            'total_income': float(total_income),
            'total_expenses': float(total_expenses),
            'remaining_budget': float(total_income - total_expenses)
        }
    
    def clear_all_expenses(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM expenses')
        conn.commit()
        conn.close()
    
    def clear_all_incomes(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM incomes')
        conn.commit()
        conn.close()
    
    def clear_all_data(self):
        self.clear_all_expenses()
        self.clear_all_incomes()
    
    def set_budget(self, category, limit):
        pass
