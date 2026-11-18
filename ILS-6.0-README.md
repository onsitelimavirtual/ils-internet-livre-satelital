# ILS 6.0 — Plataforma Nacional de Inteligência de Conectividade

## Objetivo
Evoluir o ILS e o No Network Cause para um fluxo de observação técnica e territorial com evidências rastreáveis, sem declarar cobertura ou causa-raiz que os dados não sustentem.

## Componentes nesta etapa
- Observatório 6.0: filtros por origem, tipo, resultado e período; indicadores derivados dos eventos recebidos; gráficos por dia e resultado; exportação CSV.
- Supabase: reutiliza `public.connectivity_observatory_events`, com RLS habilitada, leitura sanitizada para `anon`/`authenticated` e inserção autenticada vinculada a `auth.uid()`. Durante a auditoria, foram aplicados os grants de schema/tabela necessários e conferidos por consulta SQL.
- No Network Cause: branch de integração permite consentimentos separados para cidade/UF e coordenadas; eventos de conectividade passam a carregar a referência geográfica local no momento da medição.
- ILS orbital: preserva consulta TLE, validação de época e cache offline; as consultas à CelesTrak respeitam janela local de cache de duas horas.
- ILS RF: preserva a ponte local RTL-SDR e o endpoint de leitura, sujeito a instalação e teste com hardware real.

## Privacidade
- Cidade/UF só são enviadas mediante consentimento próprio, desmarcado por padrão.
- Coordenadas exigem uma segunda autorização explícita, também desmarcada por padrão, e só são enviadas para eventos posteriores ao aceite.
- Coordenadas exatas ficam em `connectivity_observatory_geo_private`, com RLS e acesso restrito ao próprio usuário autenticado; a role `anon` não possui SELECT nessa tabela.
- O painel público consulta somente a função agregadora `get_connectivity_observatory_geo_aggregates()`, que arredonda a posição a duas casas decimais e só retorna células com pelo menos cinco participantes distintos.
- Desativar o consentimento impede novos envios; não elimina automaticamente registros que já foram compartilhados.

## Estado observado no banco durante a implementação
Consulta de verificação retornou 280 eventos, 203 com latência e 246 eventos de diagnóstico/monitoramento. Nenhum dos 280 registros consultados tinha cidade ou UF. Esses números são uma fotografia do banco durante a implementação, não indicadores permanentes.

## Limites conhecidos
- O mapa territorial foi implementado, mas só apresenta agrupamentos que atingem o limiar mínimo de privacidade. A ausência de pontos significa ausência de amostra suficiente, não ausência de conectividade.
- Percentuais de resposta representam apenas a amostra de testes HTTP recebida; não equivalem a SLA, ping ICMP, velocidade contratada ou garantia de disponibilidade.
- O Observatório não determina causa-raiz.
- A ponte SDR ainda depende de receptor compatível, drivers e utilitário rtl_power instalados. O código foi validado estaticamente, não por recepção física.
- TLE não comprova footprint de cobertura, recepção RF ou serviço de Internet.

## Verificações executadas
- JavaScript inline e observatory.js passaram pela análise sintática.
- Estrutura do painel e identificadores de filtros/gráficos conferidos.
- Service worker atualizado para cache 6.0.
- Esquema Supabase e política RLS da tabela de eventos inspecionados.
- Integração do No Network Cause preparada em branch separada, sem alterar a branch principal.

## Publicação
Desenvolvimento isolado na branch `ils-6.0-development`. Não publicar como versão estável até executar testes no navegador, sincronização com usuário autenticado, validação de consentimento, instalação da ponte SDR e testes de regressão em Android e desktop.


## Integração geográfica — complemento 6.0
A tabela privada de geolocalização armazena latitude, longitude, precisão aproximada e horário, vinculados ao evento sincronizado. A camada pública não lê essa tabela diretamente. A função agregadora retorna somente coordenadas aproximadas e contagens de células com pelo menos cinco contas distintas. Nenhuma localização individual deve ser exibida no painel, em CSV público ou nos registros de eventos públicos.
