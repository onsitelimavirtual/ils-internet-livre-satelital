# ILS 6.1.2 — Matriz de validação

| Item | Resultado | Evidência / limite |
|---|---|---|
| Localizador único | Corrigido estruturalmente | Uma view `view-locator`; código legado com IDs inexistentes removido |
| Overpass | Implementado | Fallback sequencial em três endpoints; rede real não acessível nesta validação |
| Consulta OSM | Implementada | Nós, vias e relações com `internet_access` ou `wifi` |
| Classificação de acesso | Corrigida | `internet_access:fee`, com fallback legado; separa free/paid/restricted/yes/unknown |
| GPS | Corrigido no código | Após autorização, preenche coordenadas e inicia busca; teste físico pendente |
| Cache local | Implementado | TTL de 5 minutos por coordenada/raio |
| Mapa e filtros | Verificação estática | Leaflet; renderização real pendente de navegador/rede |
| PWA | Validado estaticamente | Manifesto e namespace de cache 6.1.2 |
| JavaScript | Validado estaticamente | `node --check` em scripts inline e externos |
| Navegação e IDs | Validado estaticamente | Contagem e duplicidade verificadas |
| OMM/SGP4 | Parcial | Código integrado; download CelesTrak e propagação real pendentes |
| Android/desktop | Pendente | Não foi possível executar Chrome real nesta sessão |
| Supabase/SDR | Pendente | Exige credenciais/projeto e hardware |

**Conclusão:** pacote de correção estrutural 6.1.2. Não declarar homologação integral antes dos testes de rede, navegador, GPS, PWA e campo.
