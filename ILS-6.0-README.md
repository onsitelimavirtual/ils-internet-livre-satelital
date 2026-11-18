# ILS 6.0 — Plataforma Nacional de Inteligência de Conectividade

## Objetivo
Evoluir o ILS e o No Network Cause para um fluxo de observação técnica e territorial com evidências rastreáveis, sem declarar cobertura ou causa-raiz que os dados não sustentem.

## Componentes nesta etapa
- Observatório 6.0: filtros por origem, tipo, resultado e período; indicadores derivados dos eventos recebidos; gráficos por dia e resultado; exportação CSV.
- Supabase: reutiliza `public.connectivity_observatory_events`, que já possui RLS e política de leitura pública para dados sanitizados.
- No Network Cause: branch de integração opcional permite ao usuário informar cidade e UF e autorizar explicitamente o compartilhamento desses dois campos.
- ILS orbital: preserva consulta TLE, validação de época e cache offline; as consultas à CelesTrak respeitam janela local de cache de duas horas.
- ILS RF: preserva a ponte local RTL-SDR e o endpoint de leitura, sujeito a instalação e teste com hardware real.

## Privacidade
- A integração territorial não envia latitude, longitude, operadora ou payload bruto ao Observatório.
- Cidade e UF são informadas pelo usuário e só são enviadas se a opção de consentimento estiver marcada.
- A opção de compartilhamento começa desmarcada.
- A tabela compartilhada não deve ser alimentada com coordenadas precisas.
- A leitura pública deve continuar restrita a campos sanitizados e políticas RLS.

## Estado observado no banco durante a implementação
Consulta de verificação retornou 280 eventos, 203 com latência e 246 eventos de diagnóstico/monitoramento. Nenhum dos 280 registros consultados tinha cidade ou UF. Esses números são uma fotografia do banco durante a implementação, não indicadores permanentes.

## Limites conhecidos
- O mapa nacional não é habilitado nesta etapa: os registros atuais não têm cobertura territorial.
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
