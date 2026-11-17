# Observatório Inteligente de Conectividade — API v1

## Arquitetura
- ILS 5.7.0: consulta pública somente de campos sanitizados e mantém o último resultado no localStorage para leitura offline.
- No Network Cause 5.0: mantém o IndexedDB como fonte local e publica resumos após cada novo evento quando há sessão Supabase autenticada.
- Supabase: tabela `public.connectivity_observatory_events`, com RLS e privilégios por coluna.

## Contrato de evento
POST `/rest/v1/connectivity_observatory_events`
Campos: `user_id`, `source_event_id`, `source_system`, `event_type`, `result`, `latency_ms`, `network_type`, `occurred_at`.
A autenticação usa o access token da sessão Google existente no No Network Cause. A política de INSERT exige que `auth.uid() = user_id`.
A chave única `(user_id, source_event_id)` impede duplicação durante as tentativas de reenvio.

## Privacidade
O painel público recebe apenas id, origem, tipo de evento, resultado, latência, perfil de rede, município/UF (quando futuramente informados) e datas. O privilégio de leitura não inclui user_id nem source_event_id. Não são enviados coordenadas, operador, e-mail, dados de autenticação ou payload bruto.

## Offline e reenvio
O No Network Cause mantém os eventos no IndexedDB. Ao abrir a aplicação, tenta sincronizar os 100 eventos locais mais recentes e repete a tentativa a cada cinco minutos. O ILS mantém cache local do último conjunto público consultado.

## Semântica dos indicadores
- reachable/unreachable descreve somente os destinos HTTP consultados.
- latency_ms é tempo de tentativa HTTP observado no navegador; não é ping ICMP.
- outage_start é uma transição observada pelo monitoramento; não comprova indisponibilidade da operadora.
- Dados orbitais, localização de satélites e pontos OpenStreetMap não confirmam cobertura ou acesso à Internet satelital.

## Validação operacional pendente
A sintaxe dos módulos foi validada e a tabela/RLS/grants foram confirmados no banco. O teste ponta a ponta de inserção com sessão Google real e a publicação final do GitHub Pages precisam ser confirmados no navegador após a propagação do deploy.
