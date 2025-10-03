import pyodbc
import pandas as pd
from datetime import datetime

class SQLServerExpenseDB:
    def __init__(self, server, database, username=None, password=None, trusted_connection=True):
        self.server = server
        self.database = database
        self.username = username
        self.password = password
        self.trusted_connection = trusted_connection
        self.connection_string = self._build_connection_string()
        self.init_db()
    
    def _build_connection_string(self):
        if self.trusted_connection:
            return f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={self.server};DATABASE={self.database};Trusted_Connection=yes;"
        else:
            return f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={self.server};DATABASE={self.database};UID={self.username};PWD={self.password};"
    
    def init_db(self):
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        
        # Bảng expenses
        cursor.execute('''
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='expenses' AND xtype='U')
            CREATE TABLE expenses (
                id INT IDENTITY(1,1) PRIMARY KEY,
                date DATE NOT NULL,
                category NVARCHAR(50) NOT NULL,
                amount DECIMAL(18,2) NOT NULL,
                description NVARCHAR(255),
                created_at DATETIME DEFAULT GETDATE()
            )
        ''')
        
        # Bảng incomes
        cursor.execute('''
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='incomes' AND xtype='U')
            CREATE TABLE incomes (
                id INT IDENTITY(1,1) PRIMARY KEY,
                date DATE NOT NULL,
                category NVARCHAR(50) NOT NULL,
                amount DECIMAL(18,2) NOT NULL,
                description NVARCHAR(255),
                created_at DATETIME DEFAULT GETDATE()
            )
        ''')
        
        # Bảng budgets
        cursor.execute('''
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='budgets' AND xtype='U')
            CREATE TABLE budgets (
                id INT IDENTITY(1,1) PRIMARY KEY,
                category NVARCHAR(50) NOT NULL UNIQUE,
                limit_amount DECIMAL(18,2) NOT NULL,
                updated_at DATETIME DEFAULT GETDATE()
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def add_expense(self, date, category, amount, description=""):
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO expenses (date, category, amount, description)
            VALUES (?, ?, ?, ?)
        ''', (date, category, amount, description))
        conn.commit()
        conn.close()
    
    def get_expenses(self, start_date=None, end_date=None):
        conn = pyodbc.connect(self.connection_string)
        query = "SELECT * FROM expenses"
        params = []
        
        if start_date and end_date:
            query += " WHERE date BETWEEN ? AND ?"
            params = [start_date, end_date]
        
        df = pd.read_sql(query, conn, params=params)
        conn.close()
        return df
    
    def get_summary(self):
        conn = pyodbc.connect(self.connection_string)
        df = pd.read_sql("SELECT * FROM expenses", conn)
        conn.close()
        
        if df.empty:
            return {}
        
        summary = {
            'total': df['amount'].sum(),
            'avg_daily': df['amount'].mean(),
            'by_category': df.groupby('category')['amount'].sum().to_dict(),
            'count': len(df)
        }
        return summary
    
    def delete_expense(self, expense_id):
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM expenses WHERE id = ?", (expense_id,))
        conn.commit()
        conn.close()
    
    def clear_all_expenses(self):
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM expenses")
        conn.commit()
        conn.close()
    
    def clear_all_incomes(self):
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM incomes")
        conn.commit()
        conn.close()
    
    def clear_all_data(self):
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM expenses")
        cursor.execute("DELETE FROM incomes")
        cursor.execute("DELETE FROM budgets")
        conn.commit()
        conn.close()
    
    def add_income(self, date, category, amount, description=""):
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO incomes (date, category, amount, description)
            VALUES (?, ?, ?, ?)
        ''', (date, category, amount, description))
        conn.commit()
        conn.close()
    
    def get_incomes(self):
        conn = pyodbc.connect(self.connection_string)
        df = pd.read_sql("SELECT * FROM incomes ORDER BY date DESC", conn)
        conn.close()
        return df
    
    def set_budget(self, category, limit_amount):
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        cursor.execute('''
            IF EXISTS (SELECT 1 FROM budgets WHERE category = ?)
                UPDATE budgets SET limit_amount = ?, updated_at = GETDATE() WHERE category = ?
            ELSE
                INSERT INTO budgets (category, limit_amount) VALUES (?, ?)
        ''', (category, limit_amount, category, category, limit_amount))
        conn.commit()
        conn.close()
    
    def get_budgets(self):
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        cursor.execute('SELECT category, limit_amount FROM budgets')
        budgets = {row[0]: row[1] for row in cursor.fetchall()}
        conn.close()
        return budgets
    
    def get_remaining_budget(self):
        """Tính ngân sách còn lại = Thu nhập - Chi tiêu"""
        conn = pyodbc.connect(self.connection_string)
        cursor = conn.cursor()
        
        # Tổng thu nhập
        cursor.execute('SELECT COALESCE(SUM(amount), 0) FROM incomes')
        total_income = float(cursor.fetchone()[0] or 0)
        
        # Tổng chi tiêu
        cursor.execute('SELECT COALESCE(SUM(amount), 0) FROM expenses')
        total_expense = float(cursor.fetchone()[0] or 0)
        
        remaining = total_income - total_expense
        
        conn.close()
        return {
            'total_income': total_income,
            'total_expense': total_expense,
            'remaining_budget': remaining
        }