#!/usr/bin/env python3
"""ILS SDR Bridge — RTL-SDR receive-only spectrum scans.
Requires rtl_power from rtl-sdr tools and a compatible RTL-SDR receiver.
Binds to loopback only. Do not expose this service to the Internet.
"""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs
from pathlib import Path
import subprocess, shutil, tempfile, csv, io, json, time, datetime, os

HOST, PORT = "127.0.0.1", 8765
RTL_POWER = shutil.which("rtl_power")

def health():
    devices = False
    if RTL_POWER:
        try:
            p = subprocess.run([RTL_POWER, "-h"], capture_output=True, text=True, timeout=2)
            # rtl_power -h may return non-zero; device presence is checked by a short scan.
            devices = False
        except Exception:
            pass
    return {"status":"ok", "backend":"rtl_power", "rtl_power":RTL_POWER or "não encontrada",
            "device_present":False, "device":"Detecção física ocorre ao iniciar uma varredura",
            "message":"Ponte local ativa. Conecte RTL-SDR compatível e execute uma varredura para confirmar a recepção.",
            "mode":"receive-only"}

class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print("[ILS-SDR]", fmt % args)
    def send_json(self, code, obj):
        raw=json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(code); self.send_header("Content-Type","application/json; charset=utf-8")
        self.send_header("Content-Length",str(len(raw))); self.send_header("Cache-Control","no-store")
        self.send_header("Access-Control-Allow-Origin","*"); self.send_header("Access-Control-Allow-Methods","GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers","Content-Type"); self.end_headers(); self.wfile.write(raw)
    def do_OPTIONS(self): self.send_json(200,{"status":"ok"})
    def do_GET(self):
        u=urlparse(self.path)
        if u.path=="/health": return self.send_json(200,health())
        if u.path!="/scan": return self.send_json(404,{"error":"Endpoint não encontrado"})
        if not RTL_POWER: return self.send_json(503,{"error":"rtl_power não instalado. Instale os utilitários RTL-SDR no computador que possui o receptor."})
        q=parse_qs(u.query)
        try:
            start=float(q.get("start_mhz",["88"])[0]); stop=float(q.get("stop_mhz",["108"])[0]); step=float(q.get("step_khz",["50"])[0]); gain=q.get("gain",["auto"])[0]
        except ValueError: return self.send_json(400,{"error":"Parâmetros numéricos inválidos"})
        if not (24<=start<stop<=1766 and stop-start<=100 and 10<=step<=1000):
            return self.send_json(400,{"error":"Faixa permitida: 24–1766 MHz; intervalo máximo 100 MHz; passo 10–1000 kHz."})
        with tempfile.TemporaryDirectory(prefix="ils_sdr_") as td:
            output=Path(td)/"scan.csv"
            args=[RTL_POWER,"-f",f"{start}M:{stop}M:{step}k","-i","1","-e","2s","-1","-c","0"]
            if gain!="auto":
                try: args.extend(["-g",str(max(0,min(49,int(float(gain)))) )])
                except ValueError: return self.send_json(400,{"error":"Ganho inválido"})
            args.append(str(output))
            try:
                proc=subprocess.run(args,capture_output=True,text=True,timeout=18)
            except subprocess.TimeoutExpired: return self.send_json(504,{"error":"Tempo limite da varredura excedido"})
            except Exception as e: return self.send_json(500,{"error":str(e)})
            if proc.returncode!=0 or not output.exists():
                msg=(proc.stderr or proc.stdout or "Falha ao iniciar receptor").strip()[-1200:]
                return self.send_json(503,{"error":"Falha na recepção SDR: "+msg})
            samples=[]
            try:
                with output.open(newline="",encoding="utf-8",errors="replace") as f:
                    for row in csv.reader(f):
                        if len(row)<7: continue
                        try:
                            f1=float(row[2]); f2=float(row[3]); bins=int(row[4]); powers=[float(x) for x in row[6:] if x.strip()]
                            if not powers: continue
                            for i,p in enumerate(powers):
                                freq=(f1+(f2-f1)*(i+0.5)/max(1,len(powers)))/1e6
                                samples.append({"frequency_mhz":round(freq,6),"power_dbfs":round(p,2)})
                        except (ValueError,IndexError): continue
            except Exception as e: return self.send_json(500,{"error":"Não foi possível interpretar a saída do rtl_power: "+str(e)})
            if not samples: return self.send_json(503,{"error":"O receptor não retornou amostras utilizáveis. Verifique antena, conexão USB e faixa suportada."})
            samples.sort(key=lambda x:x["frequency_mhz"])
            return self.send_json(200,{"status":"ok","device":"RTL-SDR via rtl_power","start_mhz":start,"stop_mhz":stop,"samples":samples,"timestamp":datetime.datetime.now().astimezone().isoformat(timespec="seconds"),"note":"Potência relativa em dBFS conforme rtl_power; não é dBm calibrado. Recepção passiva, sem transmissão."})

if __name__=="__main__":
    print(f"ILS SDR Bridge em http://{HOST}:{PORT}")
    print("Somente loopback. RTL-SDR/rtl_power necessário. Ctrl+C para encerrar.")
    ThreadingHTTPServer((HOST,PORT),Handler).serve_forever()
