# ILS 6.2.1 — validação da integração Termux

## Implementado
- Painel ILS Edge Monitor dentro de SD-WAN Intelligence.
- Importação de JSONL/JSON produzido pelo ILS Termux Edge Agent.
- Validação de esquema `ils.edge.termux.telemetry.v1`.
- Indicadores de último estado, horário/interface, latência média das sondas positivas, proporção de sondas positivas e histórico recente.
- Persistência local no navegador em `ils62-termux-telemetry-v1`, separada dos registros manuais SD-WAN.
- Limpeza dos dados importados sem apagar o arquivo original do Termux.
- Exportação SD-WAN passa a incluir os registros Termux importados.
- Agente Termux e documentação incluídos no pacote integrado.

## Verificações executadas
- Sintaxe JavaScript dos blocos inline: `node --check` aprovado.
- O agente produz registros JSONL com o esquema esperado (checagem do código e amostra do pacote).
- Importador exige esquema correto e ignora/recusa arquivo sem registros compatíveis.

## Não homologado / limitações
- Não foi executado no aparelho Android do usuário por controle remoto; a importação real precisa ser confirmada no aparelho.
- Não há transferência automática entre Termux e navegador; o usuário seleciona o arquivo.
- Não há Supabase, API, autenticação de agente ou sincronização entre dispositivos.
- O Android mede a rota de dados ativa, não duas WANs simultâneas.
- Não há failover, alteração de rotas, controle de gateway ou SLA.
- O armazenamento do painel usa `localStorage`; exporte e preserve o JSONL para backup.
