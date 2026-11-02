"""Servidor local simples: python servidor.py
Abre o site no computador e mostra o endereço para abrir no celular (mesmo Wi-Fi)."""
import http.server, socketserver, socket, webbrowser, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
PORT = 8000
def ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try: s.connect(("10.255.255.255", 1)); return s.getsockname()[0]
    except OSError: return "127.0.0.1"
    finally: s.close()
class H(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, ".woff2": "font/woff2", ".js": "text/javascript"}
    def log_message(self, *a): pass
with socketserver.TCPServer(("0.0.0.0", PORT), H) as srv:
    print(f"\nNo computador: http://localhost:{PORT}\nNo celular (mesmo Wi-Fi): http://{ip()}:{PORT}\n\nCtrl+C para parar.")
    webbrowser.open(f"http://localhost:{PORT}")
    try: srv.serve_forever()
    except KeyboardInterrupt: pass
