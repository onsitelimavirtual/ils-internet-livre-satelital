# Notas técnicas — ILS 6.3.9

- `validLocatorCoords(lat, lon)` verifica finitude e limites geográficos.
- `explainLocatorCoords()` apresenta erro específico ao usuário.
- Removido listener duplicado de `#testSdr`; a função `testLocalSdrBridge()` é a única responsável pela consulta.
- A indisponibilidade da ponte local é tratada como dependência opcional; não há polling automático da porta 8765.
- `ILS_getLocalErrorAudit()` expõe registros locais para depuração; `ILS_clearLocalErrorAudit()` limpa o histórico.
- Registro limitado aos últimos 40 eventos e armazenado somente no navegador.


## ILS 6.3.10 — integração do Observatório
- Conectado ao RPC `get_connectivity_observatory_public_summary` do projeto Painel Lima Virtual.
- Uso de chave publicável Supabase; nenhuma chave `service_role` incluída.
- Removida a expectativa de consultar eventos brutos/identificadores pela interface pública.
- A interface apresenta somente grupos agregados e exporta CSV agregado.
- O backend aplica limiar mínimo de cinco participantes distintos por grupo.
- A consulta vazia é tratada como ausência de grupos publicáveis, não como erro de rede.
- Atualizado nome do cache do Service Worker para forçar a instalação dos arquivos da versão 6.3.10.
