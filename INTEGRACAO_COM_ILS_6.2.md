# Integração ILS Termux Edge Agent ↔ ILS 6.2

## Fluxo
1. Instale o agente no Termux com `bash instalar-termux.sh`.
2. Execute uma coleta: `python "$PREFIX/bin/ils_termux_agent.py" --once`.
3. Para coleta contínua: `python "$PREFIX/bin/ils_termux_agent.py"`.
4. O arquivo padrão é `data/telemetry.jsonl`, na pasta do pacote extraído. O caminho completo pode ser conferido na saída do agente.
5. Abra o ILS 6.2 em um navegador Android, entre em **ILS SD-WAN Intelligence** e selecione esse `telemetry.jsonl` em **ILS Edge Monitor**.
6. Clique em **Importar telemetria**. Os registros são armazenados no `localStorage` do navegador daquele dispositivo.

## Limitações
- A integração desta versão é por arquivo, não sincronização automática nem API.
- O Termux mede o caminho de dados atualmente utilizado pelo Android; não mede simultaneamente uma WAN de fibra separada e uma WAN móvel.
- A conectividade do Android pode mudar entre Wi-Fi e rede móvel. O registro descreve o caminho observado no momento, mas não prova sozinho qual operadora/tecnologia transportou cada sonda.
- Latência TCP/HTTPS não é ping ICMP, SLA ou medição de throughput.
- Nenhuma rota, DNS, VPN, hotspot, firewall ou configuração de rádio é alterada.
- Os dados importados permanecem localmente no navegador. Limpar os dados do site/navegador pode apagá-los; preserve o JSONL original como backup.
