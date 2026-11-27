# ILS 7.0.0 — Auditoria de release e prontidão comercial

Data da auditoria: 26/11/2026
Base examinada: ILS 6.3.11 Signal Intelligence, pacote HTML/PWA

## Resultado executivo

**Status: aprovado para teste controlado / beta técnica; NÃO liberado como produto comercial final.** A coleta integrada foi implementada e passou por teste automatizado com dados simulados. A auditoria estática não substitui validação do APK nativo, redes reais, revisão jurídica/LGPD ou teste de carga.

## Alterações implementadas em 7.0.0

- Unificado o fluxo de coleta em um botão: permissões Android quando a ponte oferece esse método, leitura de snapshot nativo e três sondas HTTPS sequenciais.
- Estado Android e resultados das sondas são salvos em um único registro local quando a ponte está disponível.
- Navegador sem ponte funciona em modo degradado: executa sondas, registra limitações e não inventa RSSI/SSID.
- Removido o texto de aviso sobre “substituição do Termux”.
- Mantidos exportação CSV, importação de histórico e armazenamento local.
- Atualizados metadados PWA e cache para 7.0.0.
- Corrigida atribuição do mapa orbital para “OpenStreetMap contributors” com link de licença; ambos os mapas usam o endpoint oficial `tile.openstreetmap.org`.

## Testes realizados

| Teste | Resultado |
|---|---|
| Integridade do ZIP | PASS |
| JavaScript inline — Node `--check` | PASS |
| HTML parse | PASS |
| IDs duplicados | 0 encontrados |
| Manifesto JSON | PASS |
| Referências locais | Nenhum arquivo local ausente; `mailto:` excluído da verificação |
| Fluxo de coleta em Chromium/Playwright, bridge simulada | PASS: 1 registro, 3 sondas, chamada de permissão simulada |
| Fluxo de coleta em Chromium/Playwright, sem bridge | PASS: 1 registro, 3 sondas, modo browser claramente indicado |
| Erros externos no teste | Os módulos satelitais ESM/CDN foram bloqueados pelo ambiente de teste; não foi possível validar a importação externa em rede real |
| Teste em aparelho Android físico/APK | NÃO EXECUTADO |
| Teste de rede real, GPS, Wi-Fi, 4G/5G ou satélite | NÃO EXECUTADO |

## Bloqueadores antes de vender

1. **Mapa base:** o pacote usa `tile.openstreetmap.org`. A política oficial do OSM informa que seus servidores de tiles são financiados por doações, têm disponibilidade best-effort e podem ser bloqueados; serviços comerciais devem considerar provedor de tiles comercial ou hospedagem própria. Não prometa SLA com o servidor público.
2. **APK/bridge:** este ZIP é a aplicação web/PWA; não inclui APK nem fonte Java do bridge. Testar solicitação real de permissões, RSSI, SSID, frequência e retorno de estado no APK final.
3. **CelesTrak:** obedecer à política de uso: consultar somente o necessário, evitar repetição, respeitar intervalo mínimo recomendado de 2 horas para GP e parar consultas durante indisponibilidade.
4. **Dependências externas:** Leaflet, satellite.js, fontes e dados remotos são carregados de CDNs/serviços. O modo offline não garante mapas, dados orbitais ou importação de módulos sem rede. Considerar empacotamento local com avisos de licença e plano de atualização.
5. **LGPD e documentos comerciais:** revisar/fechar Política de Privacidade, Termos de Uso, base legal e finalidade dos dados, consentimento de localização, retenção, exclusão/exportação, suporte e canal de contato.
6. **Segurança operacional:** revisar CSP/SRI quando aplicável, dependências, endpoints, tratamento de erros, validação de dados externos e proteção do bridge local; realizar teste de segurança independente.
7. **Validação de campo:** testar em Android de diferentes versões e fabricantes, Wi-Fi e dados móveis, permissões negadas, sem conexão, timeout, CDN indisponível e recuperação após reiniciar.

## Precisão e limites da coleta

- `fetch` com `no-cors` produz resposta opaca: o navegador não valida código HTTP nem conteúdo.
- Latência é tempo de requisição browser/DNS/TLS/servidor, não ping ICMP.
- Falhas de sondas não são perda de pacotes IP.
- `navigator.onLine` é indicativo, não prova conectividade Internet.
- RSSI e dados de rádio só podem ser afirmados quando recebidos do bridge Android autorizado.
- A análise orbital é estimativa computacional baseada em elementos orbitais e época; não é garantia de visibilidade, conexão, cobertura ou serviço satelital.

## Referências de compliance consultadas

- OSM Tile Usage Policy: https://operations.osmfoundation.org/policies/tiles/
- OSM Copyright/ODbL: https://www.openstreetmap.org/copyright
- Leaflet commercial-use FAQ: https://github.com/Leaflet/Leaflet/blob/main/FAQ.md
- satellite.js license: https://github.com/shashwatak/satellite-js/blob/develop/LICENSE.md
- CelesTrak Usage Policy: https://celestrak.org/usage-policy.php

## Decisão

A versão 7.0.0 melhora a experiência de coleta e é adequada para demonstração, piloto e homologação técnica. A comercialização ampla deve aguardar os bloqueadores acima, especialmente a escolha do provedor de mapas, testes no APK e revisão jurídica/LGPD.
