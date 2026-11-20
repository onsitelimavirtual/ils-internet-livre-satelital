# ILS 6.2 — Arquitetura e Plano de P&D
## Plataforma Inteligente de Conectividade, Infraestrutura e Inclusão Digital

**Proponente:** Nailson Lima  
**Território inicial proposto:** Distrito Federal  
**Horizonte de P&D:** 12 meses  
**Estado:** proposta estruturada; implementação inicial do módulo SD-WAN local incluída no pacote.

## 1. Objetivo
Integrar inteligência territorial, diagnóstico multimodal de redes, SD-WAN híbrido e Edge Intelligence para investigar limitações de conectividade, recomendar alternativas tecnológicas e apoiar a continuidade do acesso à Internet.

## 2. Arquitetura
- ILS Core: identidade, organizações, APIs, auditoria, relatórios e dados compartilhados.
- GeoConnect: pontos de acesso e oportunidades territoriais.
- Signal Intelligence: métricas, disponibilidade e eventos de rede.
- Orbital Intelligence: catálogo e análise orbital, com origem e época dos dados.
- ILS Remote: comparação preliminar de tecnologias e viabilidade territorial.
- ILS Impact: indicadores de acesso e impacto, separando potencial de atendimento efetivo.
- ILS SD-WAN Intelligence: monitoramento multi-WAN, pontuação explicável, recomendação e futuro controle autorizado.
- Edge Intelligence: agente local autenticado, fila offline, regras e sincronização.

## 3. SD-WAN híbrido
### Nível 1 — Monitoramento
Coleta de latência, jitter, perda, disponibilidade, utilização e estado dos links, com timestamp, origem e método.

### Nível 2 — Recomendação
Motor determinístico e explicável que compara caminhos por perfil de uso, custo e qualidade. Deve usar limites configuráveis, histerese e tempo mínimo entre mudanças.

### Nível 3 — Controle autorizado
Adaptadores para gateways compatíveis, primeiro em modo somente leitura. Failover, QoS e seleção de rotas somente após laboratório, autorização explícita, política de rollback e auditoria.

## 4. Plano de P&D — 12 meses
- Meses 1–3: auditoria, modelo de dados, API, segurança e telemetria somente leitura.
- Meses 4–6: monitoramento de pelo menos dois links, motor de recomendação e simulação de falhas.
- Meses 7–9: integração territorial, agente offline e pesquisa experimental Edge AI.
- Meses 10–12: piloto, comparação de políticas, avaliação, documentação e preparação de PI.

## 5. Critérios de validação
- Dois ou mais links monitorados em laboratório.
- Métricas com timestamp, origem e método.
- Persistência e sincronização sem duplicação.
- Failover demonstrado em ambiente controlado.
- Retorno ao link principal somente após estabilidade.
- Registro de recomendações e ações.
- Testes de segurança e rollback.
- Edge AI avaliada contra método de referência; sem meta de precisão até existir base rotulada.

## 6. Estratégia de participação
### Incubação e aceleração
Priorizar programas sem cessão de participação societária quando houver alternativa equivalente; buscar mentoria, laboratórios, validação e parceiros.

### Fomento e P&D
Buscar chamadas compatíveis de FINEP, EMBRAPII/Sebrae, BNDES Garagem e programas regionais, verificando elegibilidade, CNPJ, contrapartida e regras de PI.

### Parcerias
ICT/universidade para metodologia; laboratório de redes para testes; parceiro de infraestrutura para equipamentos; instituição territorial para piloto.

## 7. Propriedade intelectual
Inventariar código e versões preexistentes, registrar autoria e histórico, mapear licenças de terceiros e negociar por escrito titularidade de melhorias, uso de resultados, dados, publicações e confidencialidade.

## 8. Orçamento preliminar de referência
Cenário inicial de planejamento: R$ 180.000, sujeito a cotações e regras do edital:
- Software e agente: R$ 54.000
- Pesquisa e bolsas: R$ 42.000
- Laboratório/equipamentos: R$ 30.000
- Infraestrutura/dados: R$ 18.000
- Piloto/validação: R$ 18.000
- Segurança/PI: R$ 9.000
- Gestão/contingência: R$ 9.000

Não é orçamento aprovado nem cotação de mercado.

## 9. Riscos e limites
- Equipamentos e APIs variam; integração depende de compatibilidade.
- Métricas de navegador não substituem telemetria de gateway.
- Failover exige dois links independentes e equipamento de controle.
- Recomendações não garantem desempenho ou cobertura.
- Edge AI depende de dados rotulados e avaliação independente.
- A situação funcional do proponente no serviço público deve ser analisada juridicamente antes de empresa, remuneração, administração ou contrato.

## 10. Estado real desta entrega
O módulo SD-WAN web registra links informados manualmente, calcula pontuação heurística explicável, compara perfis e exporta JSON. Dados são locais ao navegador. Não há medição ativa, agente Linux, Supabase, integração com gateway, failover, QoS ou IA nesta entrega.

## 11. Incremento técnico — Agente Linux Dual-WAN (prévia)
Foi adicionada a pasta `linux-agent/`, com agente Python 3 para sondagem ICMP por interface, suporte a dois ou mais links, registro JSONL local e serviço systemd opcional para Debian/Ubuntu. O agente permanece em modo somente leitura. Não altera rotas, firewall, QoS ou gateway e não realiza failover. A sincronização autenticada com a plataforma permanece pendente.
