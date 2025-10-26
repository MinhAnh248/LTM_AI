import sqlite3
import pandas as pd

class SQLiteExpenseDB:
    def __init__(self, db_path='expense_data.db'):
        import os
        import sqlite3
        from typing import List, Dict, Optional


        class SQLiteExpenseDB:
            """Minimal SQLite-backed adapter for expenses/incomes used by the app.

            Provides a small, deterministic API used by the Flask app. The
            implementation avoids heavy dependencies (no pandas) so it is lightweight
            and portable for cloud deploys.
            """

            def __init__(self, db_path: Optional[str] = None):
                if db_path is None:
                    db_path = os.environ.get('EXPENSE_DB_PATH', 'expense_data.db')
                self.db_path = db_path
                self._init_db()

            def _init_db(self) -> None:
                conn = sqlite3.connect(self.db_path)
                cursor = conn.cursor()
                cursor.execute(
                    '''
                    CREATE TABLE IF NOT EXISTS expenses (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        date TEXT,
                        category TEXT,
                        amount REAL,
                        description TEXT,
                        user_id INTEGER DEFAULT 1
                    )
                    '''
                )
                cursor.execute(
                    '''
                    CREATE TABLE IF NOT EXISTS incomes (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        date TEXT,
                        category TEXT,
                        amount REAL,
                        description TEXT,
                        user_id INTEGER DEFAULT 1
                    )
                    '''
                )
                conn.commit()
                conn.close()
    """Minimal SQLite-backed adapter for expenses/incomes used by the app.

    Provides a small, deterministic API used by the Flask app. The
    implementation avoids heavy dependencies (no pandas) so it is lightweight
    and portable for cloud deploys.
    """

    def __init__(self, db_path: Optional[str] = None):
        if db_path is None:
            db_path = os.environ.get('EXPENSE_DB_PATH', 'expense_data.db')
        self.db_path = db_path
        self._init_db()

    def _init_db(self) -> None:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            '''
            CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT,
                category TEXT,
                amount REAL,
                description TEXT,
                user_id INTEGER DEFAULT 1
            )
            '''
        )
        cursor.execute(
            '''
            CREATE TABLE IF NOT EXISTS incomes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT,
                category TEXT,
                amount REAL,
                description TEXT,
                user_id INTEGER DEFAULT 1
            )
            '''
        )
        conn.commit()
        conn.close()

    def _row_to_dict(self, cursor: sqlite3.Cursor, row: sqlite3.Row) -> Dict:
        # Convert a sqlite row to dict using cursor description
        return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}

    def get_expenses(self) -> List[Dict]:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM expenses ORDER BY date DESC')
        rows = cursor.fetchall()
        results = [self._row_to_dict(cursor, r) for r in rows]
        conn.close()
        return results

    def add_expense(self, date: str, category: str, amount: float, description: str) -> int:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO expenses (date, category, amount, description) VALUES (?, ?, ?, ?)',
            (date, category, float(amount), description),
        )
        conn.commit()
        rowid = cursor.lastrowid
        conn.close()
        return rowid

    def delete_expense(self, expense_id: int) -> None:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM expenses WHERE id = ?', (expense_id,))
        conn.commit()
        conn.close()

    def update_expense(self, expense_id: int, date: str, category: str, amount: float, description: str) -> None:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            'UPDATE expenses SET date=?, category=?, amount=?, description=? WHERE id=?',
            (date, category, float(amount), description, expense_id),
        )
        conn.commit()
        conn.close()

    def get_incomes(self) -> List[Dict]:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM incomes ORDER BY date DESC')
        rows = cursor.fetchall()
        results = [self._row_to_dict(cursor, r) for r in rows]
        conn.close()
        return results

    def add_income(self, date: str, category: str, amount: float, description: str) -> int:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO incomes (date, category, amount, description) VALUES (?, ?, ?, ?)',
            (date, category, float(amount), description),
        )
        conn.commit()
        rowid = cursor.lastrowid
        conn.close()
        return rowid

    def get_summary(self) -> Dict:
        expenses = self.get_expenses()
        if not expenses:
            return {'total': 0, 'count': 0, 'average': 0}
        total = sum(e.get('amount', 0) for e in expenses)
        count = len(expenses)
        average = total / count if count else 0
        return {'total': float(total), 'count': count, 'average': float(average)}

    def get_remaining_budget(self) -> Dict:
        expenses = self.get_expenses()
        incomes = self.get_incomes()
        total_expenses = sum(e.get('amount', 0) for e in expenses)
        total_income = sum(i.get('amount', 0) for i in incomes)
        return {
            'total_income': float(total_income),
            'total_expenses': float(total_expenses),
            'remaining_budget': float(total_income - total_expenses),
        }

    def clear_all_expenses(self) -> None:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM expenses')
        conn.commit()
        conn.close()

    def clear_all_incomes(self) -> None:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM incomes')
        conn.commit()
        conn.close()

    def clear_all_data(self) -> None:
        self.clear_all_expenses()
        self.clear_all_incomes()

    def set_budget(self, category: str, limit: float) -> None:
        # Not implemented here; budgets are handled elsewhere in the app
        raise NotImplementedError('set_budget is not implemented for SQLiteExpenseDB')


# Backwards compatibility: older code imports `SQLiteDB`
SQLiteDB = SQLiteExpenseDB
