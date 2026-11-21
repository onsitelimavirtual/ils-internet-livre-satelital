# Notas técnicas — ILS 6.3.9

- `validLocatorCoords(lat, lon)` verifica finitude e limites geográficos.
- `explainLocatorCoords()` apresenta erro específico ao usuário.
- Removido listener duplicado de `#testSdr`; a função `testLocalSdrBridge()` é a única responsável pela consulta.
- A indisponibilidade da ponte local é tratada como dependência opcional; não há polling automático da porta 8765.
- `ILS_getLocalErrorAudit()` expõe registros locais para depuração; `ILS_clearLocalErrorAudit()` limpa o histórico.
- Registro limitado aos últimos 40 eventos e armazenado somente no navegador.
