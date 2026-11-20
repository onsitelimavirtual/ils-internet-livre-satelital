# ILS 6.2 — Connectivity Intelligence

Pacote incremental baseado no código-fonte recuperado da ILS 6.1.2.

## Conteúdo
- `index.html`: aplicação original com novo módulo ILS SD-WAN Intelligence.
- `sw.js`: cache versionado independente.
- `manifest.webmanifest`: identificação 6.2.
- `ils-logo.png`, ícones e `observatory.js`: recursos originais quando disponíveis.
- `ARQUITETURA_E_PLANO_PDI.md`: arquitetura, P&D e estratégia de participação.
- `VALIDACAO_ILS_6.2.md`: testes e limitações.

## Módulo implementado
Cadastro manual de links, métricas opcionais, pontuação heurística por perfil, comparação, edição, exclusão individual e exportação JSON. Os registros são persistidos em `localStorage` sob a chave `ils62-sdwan-links-v1`.

## Limitações
Não há monitoramento ativo de links, agente Linux, telemetria SNMP/API, Supabase, controle de gateway, failover automático ou Edge AI. O painel não altera roteadores. O controle real requer agente autenticado, gateway compatível, dois links e testes em laboratório.

## Executar
Servir a pasta por HTTP/HTTPS (não abrir por `file://` ou `content://`). Exemplo: `python -m http.server 8000`, depois abrir `http://localhost:8000`.

A base anterior foi preservada no diretório de origem e não foi modificada por este pacote.

Documentos de P&D: `PROJETO_PDI_ILS_6.2.pdf` e `PROJETO_PDI_ILS_6.2.docx`.

## Agente Linux — dois links
A pasta `linux-agent/` contém o agente de telemetria dual-WAN, configuração de exemplo, serviço systemd e instalador para Debian/Ubuntu. Consulte `linux-agent/README.md`. O agente é somente leitura e grava dados localmente; não faz failover nem altera rotas.

## ILS Edge Monitor — integração Termux
A edição integrada inclui `termux-agent/` e um importador local no módulo **ILS SD-WAN Intelligence**. No Android, execute o agente Termux e importe `data/telemetry.jsonl` pelo seletor de arquivos do painel. A integração é manual por arquivo, sem API/Supabase e sem envio automático. Consulte `termux-agent/INTEGRACAO_COM_ILS_6.2.md`.
