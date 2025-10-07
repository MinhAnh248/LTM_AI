import subprocess
import time
import os
import sys

print("=" * 50)
print("   AI EXPENSE MANAGER - STARTING...")
print("=" * 50)
print()

# Get current directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# Start Backend
print("[1/2] Starting Backend (Flask API)...")
backend_process = subprocess.Popen(
    [sys.executable, "api_server.py"],
    cwd=current_dir,
    creationflags=subprocess.CREATE_NEW_CONSOLE if os.name == 'nt' else 0
)
time.sleep(3)

# Start Frontend
print("[2/2] Starting Frontend (React)...")
frontend_dir = os.path.join(current_dir, "frontend")
frontend_process = subprocess.Popen(
    ["npm", "start"],
    cwd=frontend_dir,
    shell=True,
    creationflags=subprocess.CREATE_NEW_CONSOLE if os.name == 'nt' else 0
)

print()
print("=" * 50)
print("   SERVERS STARTED!")
print("=" * 50)
print("   Backend:  http://localhost:5000")
print("   Frontend: http://localhost:3000")
print("=" * 50)
print()
print("Press Ctrl+C to stop all servers...")

try:
    backend_process.wait()
    frontend_process.wait()
except KeyboardInterrupt:
    print("\nStopping servers...")
    backend_process.terminate()
    frontend_process.terminate()
    print("Servers stopped!")
