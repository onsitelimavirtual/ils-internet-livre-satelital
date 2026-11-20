#!/data/data/com.termux/files/usr/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
command -v pkg >/dev/null 2>&1 || { echo 'Execute este instalador dentro do Termux oficial.'; exit 1; }
pkg update -y
pkg install -y python termux-api
chmod +x "$ROOT/bin/ils_termux_agent.py"
mkdir -p "$ROOT/data"
echo
echo 'ILS Termux Edge Agent 1.1.0 preparado.'
echo 'IMPORTANTE: além do pacote termux-api, instale o aplicativo Android Termux:API compatível com a mesma origem/assinatura do Termux.'
echo 'Depois conceda as permissões solicitadas pelo Android.'
echo '1) Diagnóstico: python "$ROOT/bin/ils_termux_agent.py" --check'
echo '2) Teste único: python "$ROOT/bin/ils_termux_agent.py" --once'
echo '3) Monitor contínuo: python "$ROOT/bin/ils_termux_agent.py"'
echo '4) Arquivo para importar no ILS: "$ROOT/data/telemetry.jsonl"'
