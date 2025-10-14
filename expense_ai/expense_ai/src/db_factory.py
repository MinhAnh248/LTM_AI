import sys
import os
sys.path.append('.')

from sqlserver_database import SQLServerExpenseDB
from config import SQLSERVER_CONFIG

def get_database():
    return SQLServerExpenseDB(
        server=SQLSERVER_CONFIG['server'],
        database=SQLSERVER_CONFIG['database'],
        trusted_connection=SQLSERVER_CONFIG['trusted_connection']
    )