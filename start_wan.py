import subprocess
import time
import sys
import os
import re

def start_backend():
    """Khởi động Flask backend"""
    print("[*] Starting backend...")
    backend = subprocess.Popen(
        [sys.executable, "api_server.py"],
        cwd=os.path.dirname(os.path.abspath(__file__))
    )
    time.sleep(3)
    return backend

def start_cloudflare():
    """Khởi động Cloudflare tunnel và lấy URL"""
    print("[*] Starting Cloudflare tunnel...")
    
    cloudflared_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cloudflared.exe")
    
    tunnel = subprocess.Popen(
        [cloudflared_path, "tunnel", "--url", "http://localhost:5000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1
    )
    
    # Đợi và lấy URL
    url = None
    for line in tunnel.stderr:
        print(line.strip())
        if "trycloudflare.com" in line:
            match = re.search(r'https://[a-zA-Z0-9-]+\.trycloudflare\.com', line)
            if match:
                url = match.group(0)
                print(f"\n[+] Cloudflare URL: {url}")
                break
    
    return tunnel, url

def update_api_js(url):
    """Cập nhật frontend API URL"""
    api_js_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 
                               "frontend", "src", "services", "api.js")
    
    with open(api_js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Cập nhật MODE và NGROK URL
    content = re.sub(r"const MODE = '[^']*'", "const MODE = 'NGROK'", content)
    content = re.sub(
        r"NGROK: 'https://[^']*'",
        f"NGROK: '{url}/api'",
        content
    )
    
    with open(api_js_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"[+] Updated api.js with URL: {url}/api")

def start_frontend():
    """Khởi động React frontend"""
    print("[*] Starting frontend...")
    frontend_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend")
    
    frontend = subprocess.Popen(
        ["npm", "start"],
        cwd=frontend_path,
        shell=True
    )
    return frontend

def main():
    print("=" * 50)
    print("Starting Expense AI - WAN Mode")
    print("=" * 50)
    print()
    
    processes = []
    
    try:
        # 1. Start backend
        backend = start_backend()
        processes.append(backend)
        
        # 2. Start Cloudflare tunnel
        tunnel, url = start_cloudflare()
        processes.append(tunnel)
        
        if not url:
            print("[-] Failed to get Cloudflare URL")
            return
        
        # 3. Update frontend API URL
        update_api_js(url)
        
        # 4. Start frontend
        time.sleep(2)
        frontend = start_frontend()
        processes.append(frontend)
        
        print()
        print("=" * 50)
        print("[+] All services started!")
        print("=" * 50)
        print(f"[+] Public URL: {url}")
        print(f"[+] Frontend: http://localhost:3000")
        print()
        print("Press Ctrl+C to stop all services")
        print("=" * 50)
        
        # Keep running
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n\n[*] Stopping all services...")
        for p in processes:
            p.terminate()
        print("[+] All services stopped")
    except Exception as e:
        print(f"[-] Error: {e}")
        for p in processes:
            p.terminate()

if __name__ == "__main__":
    main()
