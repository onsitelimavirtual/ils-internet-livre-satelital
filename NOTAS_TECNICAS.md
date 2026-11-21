# ILS 6.3.7 — Capability Intelligence

- Nova seção no módulo Diagnóstico para identificar o ambiente de execução e capacidades disponíveis.
- Distingue navegador, PWA instalado, WebView e presença da ponte nativa `IlsAndroid`.
- A disponibilidade de RSSI/dBm exige leitura nativa com valor numérico válido; o PWA não simula métricas de rádio.
- Service Worker, armazenamento e Network Information API são apresentados como capacidades web independentes.
- SDR e controle de roteador são explicitamente marcados como dependentes de hardware/integração externa.
- A classificação é heurística e deve ser validada nos dispositivos reais.
