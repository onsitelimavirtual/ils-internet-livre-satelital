# ILS Termux Edge Agent 1.1.0 — Android Bridge

Agente Android/Termux de monitoramento somente leitura. Registra sondas TCP/HTTPS e, quando disponível, informações da rede Wi-Fi conectada via Termux:API (SSID, BSSID, RSSI e velocidade do link).

## Instalar/atualizar

No diretório `ILS_Termux_DualWAN`, execute `bash instalar-termux.sh`. O instalador instala Python e o pacote `termux-api`. Também é necessário instalar separadamente o aplicativo complementar Termux:API, compatível com a origem/assinatura do Termux instalado.

## Comandos

- Diagnóstico: `python bin/ils_termux_agent.py --check`
- Uma coleta: `python bin/ils_termux_agent.py --once`
- Contínuo: `python bin/ils_termux_agent.py` (Ctrl+C para parar)
- Versão: `python bin/ils_termux_agent.py --version`

Arquivo: `data/telemetry.jsonl`. Para importar no ILS, copie para Downloads com `cp data/telemetry.jsonl ~/storage/downloads/telemetry.jsonl`, selecione no ILS 6.2.2 e toque em Importar.

**Limite:** a ponte é via Termux:API + arquivo local, não é APK nativo próprio nem sincronização automática com o navegador. O Android pode ocultar SSID/RSSI. Não faz failover, não altera rotas e não mede duas WANs simultaneamente.
