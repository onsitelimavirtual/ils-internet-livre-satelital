# Validação estática — ILS 6.2.2

- Importador JSONL com mensagem visível de arquivo selecionado e resultado de importação.
- Deduplicação de registros por timestamp antes de persistir no localStorage.
- Painel adicional para SSID/RSSI/velocidade do Wi-Fi quando presentes no campo `path.wifi`.
- Agente Termux 1.1.0 verifica disponibilidade de Termux:API e informa a limitação no diagnóstico.
- Instalador prepara `python` e pacote `termux-api`; o app complementar Android deve ser instalado separadamente e ser compatível com a origem/assinatura do Termux.
- Não foi gerado APK Android próprio. Não há comunicação automática entre página HTTPS e Termux; o fluxo permanece por arquivo local.
- Não há failover, controle de roteador, medição simultânea de WANs, nem sincronização Supabase.

Validação pendente: executar no aparelho Android real com Wi-Fi ligado, permissões concedidas e Termux:API instalado; importar arquivo gerado e confirmar RSSI/SSID efetivamente retornados pelo dispositivo.
