# ILS 6.1.1 — Relatório de empacotamento e validação

## Arte e PWA
- Logomarca principal atualizada para a versão 6.1.1, preservando a arte completa.
- Ícones quadrados 64, 192 e 512 px gerados por ajuste proporcional sobre fundo azul-marinho.
- Manifesto atualizado para ILS 6.1.1.
- Service worker recebeu namespace de cache exclusivo `ils-v6.1.1-logo-refresh`.

## Verificações estáticas executadas
- HTML: 21 itens de navegação e 21 telas correspondentes.
- IDs HTML: nenhuma duplicidade encontrada.
- JavaScript inline: `node --check` aprovado.
- `observatory.js`: `node --check` aprovado.
- Manifesto: JSON válido; referências aos ícones conferidas.
- Arquivos locais e documentos incluídos no ZIP.

## Persistência — interpretação
- O código contém gravações e leituras em `localStorage`; esses dados permanecem no mesmo perfil/origem do navegador após recarga, mas não são sincronizados entre dispositivos nem protegidos como banco central.
- O Observatório mantém cache local do último conjunto consultado. A sincronização depende da API Supabase e da conectividade.
- O conteúdo de `ILS Remote` e `ILS Impact` é descrito na documentação como armazenamento local do navegador, sem sincronização Supabase nesta etapa.
- Limpar dados do site, desinstalar o navegador ou usar outro perfil/dispositivo pode apagar ou não apresentar esses registros. Exportar backup antes de limpeza/atualização é recomendado.
- A inspeção estática não comprova persistência após reinício, migração entre versões ou recuperação em dispositivo real.

## Não homologado nesta entrega
- Não foram executados testes reais de rede CelesTrak/CDN, Overpass/OSM ou Supabase.
- Não foram testados Google Auth, Hotmart, webhook, SDR físico ou hardware Android Bridge.
- A validação em Chrome Android, instalação PWA, modo offline e persistência após reinício em dispositivo real continua pendente.
- A logomarca foi atualizada na interface lateral, mas o pacote ainda depende de revisão visual em aparelhos e telas diferentes.

## Conclusão
Pacote independente do GitHub, com atualização visual e verificações estáticas aprovadas. Não declarar como homologação integral ou produção comercial: testes externos, de dispositivo, segurança e persistência operacional permanecem necessários.


## Resultado automatizado adicional do pacote final
- Sintaxe Node.js (HTML inline, observatory.js, sw.js): APROVADA.
- Navegação HTML: 21 itens / 21 seções; correspondência: APROVADA.
- IDs duplicados: 0.
- Referências locais ausentes no HTML: 0.
- Teste de navegador Playwright: não executado porque o ambiente não possui o binário Chromium instalado. Portanto, cliques reais e persistência após recarga não foram homologados por navegador nesta execução.
