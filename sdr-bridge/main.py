"""ILS 5.9 local RTL-SDR bridge — receive-only spectrum endpoint."""
from __future__ import annotations
import csv, io, os, shutil, subprocess, tempfile, threading
from pathlib import Path
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

APP_VERSION = "5.9.0"
RTL_POWER = os.getenv("RTL_POWER_BIN", "rtl_power")
ALLOWED_ORIGINS = [x.strip() for x in os.getenv(
    "ILS_ALLOWED_ORIGINS",
    "https://onsitelimavirtual.github.io,https://lima-virtual-pro.github.io"
).split(",") if x.strip()]
SCAN_LOCK = threading.Lock()

app = FastAPI(title="ILS SDR Bridge", version=APP_VERSION)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    binary = shutil.which(RTL_POWER)
    return {
        "status": "ok" if binary else "degraded",
        "device": "RTL-SDR via rtl_power" if binary else "rtl_power não encontrado",
        "mode": "receive-only",
        "version": APP_VERSION,
        "ready": bool(binary),
    }

@app.get("/spectrum")
def spectrum(
    start_mhz: float = Query(..., ge=24, le=1766),
    stop_mhz: float = Query(..., ge=24, le=1766),
    step_khz: int = Query(50, ge=25, le=250),
    gain: str = Query("auto"),
):
    if stop_mhz <= start_mhz or stop_mhz - start_mhz > 100:
        raise HTTPException(400, "Faixa inválida: fim deve ser maior e largura máxima é 100 MHz.")
    if step_khz not in (25, 50, 100, 250):
        raise HTTPException(400, "Passo permitido: 25, 50, 100 ou 250 kHz.")
    if gain != "auto" and gain not in ("0", "10", "20", "30", "40"):
        raise HTTPException(400, "Ganho não permitido.")
    binary = shutil.which(RTL_POWER)
    if not binary:
        raise HTTPException(503, "rtl_power não está instalado ou não está no PATH.")
    if not SCAN_LOCK.acquire(blocking=False):
        raise HTTPException(409, "Outra leitura SDR já está em andamento.")
    try:
        with tempfile.TemporaryDirectory(prefix="ils-sdr-") as folder:
            output = str(Path(folder) / "spectrum.csv")
            freq_range = f"{start_mhz:g}M:{stop_mhz:g}M:{step_khz}k"
            command = [binary, "-f", freq_range, "-1"]
            if gain != "auto":
                command += ["-g", gain]
            command.append(output)
            try:
                proc = subprocess.run(command, capture_output=True, text=True, timeout=55, check=False)
            except subprocess.TimeoutExpired:
                raise HTTPException(504, "Leitura SDR excedeu 55 segundos.")
            if proc.returncode != 0:
                detail = (proc.stderr or proc.stdout or "Falha no rtl_power").strip()[-900:]
                raise HTTPException(502, detail)
            csv_path = Path(output)
            if not csv_path.exists() or not csv_path.stat().st_size:
                raise HTTPException(502, "rtl_power não produziu amostras.")
            samples = []
            with csv_path.open("r", newline="", encoding="utf-8", errors="replace") as handle:
                for row in csv.reader(handle):
                    if len(row) < 7:
                        continue
                    try:
                        low_hz = float(row[2]); step_hz = float(row[4])
                        powers = [float(v) for v in row[6:] if v.strip()]
                    except ValueError:
                        continue
                    for index, power in enumerate(powers):
                        if -250 <= power <= 100:
                            samples.append({
                                "frequency_mhz": round((low_hz + index * step_hz) / 1_000_000, 6),
                                "power_db": round(power, 2),
                            })
            if len(samples) < 2:
                raise HTTPException(502, "Não foi possível interpretar as amostras CSV do rtl_power.")
            return {
                "status": "ok",
                "mode": "receive-only",
                "device": "RTL-SDR / rtl_power",
                "unit": "dBFS",
                "start_mhz": start_mhz,
                "stop_mhz": stop_mhz,
                "step_khz": step_khz,
                "gain": gain,
                "sample_count": len(samples),
                "samples": samples,
            }
    finally:
        SCAN_LOCK.release()
