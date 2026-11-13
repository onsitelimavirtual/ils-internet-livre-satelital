from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parent
if not (ROOT / "index.html").is_file():
    raise SystemExit("index.html não encontrado junto deste servidor.")

os.chdir(ROOT)

class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

PORTS = (8000, 8001, 8080)
server = None
for port in PORTS:
    try:
        server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
        print(f"ILS 4.2 iniciado: http://127.0.0.1:{port}")
        break
    except OSError:
        pass

if server is None:
    raise SystemExit("Portas 8000, 8001 e 8080 ocupadas. Encerre outro servidor e tente novamente.")

try:
    server.serve_forever()
except KeyboardInterrupt:
    print("Servidor encerrado.")
finally:
    server.server_close()
