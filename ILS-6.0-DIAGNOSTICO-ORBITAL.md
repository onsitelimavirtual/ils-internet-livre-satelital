# ILS 6.0 — Diagnóstico e atualização orbital RC2

## Problema observado
A tela de diagnóstico mostrava “Biblioteca orbital: Verificado” e “Dados TLE: Pendente”. Isso indicava apenas que a biblioteca JavaScript estava disponível; não significava que os elementos orbitais haviam sido obtidos.

## Alterações
1. Fonte alterada para CelesTrak GP em OMM JSON (`FORMAT=JSON`).
2. Grupos preservados: `stations`, `active` e `weather`.
3. Dependência alterada para `satellite.js` 7.2.0.
4. Conversão OMM via `json2satrec`, propagação SGP4 e uso do NORAD ID completo.
5. Cache OMM local independente, com TTL de duas horas e fallback offline.
6. Mensagens e diagnóstico atualizados para distinguir biblioteca disponível de dados OMM efetivamente carregados.

## Política de consulta
A documentação do CelesTrak informa que GP deve ser consultado no máximo uma vez por ciclo de atualização (aproximadamente duas horas). A aplicação respeita essa janela no cache local e não implementa repetição automática em caso de HTTP 403.

## Verificações realizadas
- Sintaxe dos scripts inline: aprovada por `node --check`.
- Estrutura HTML: scripts e funções de catálogo, visibilidade e mapa atualizados.
- Cache antigo TLE: não reutilizado.
- Pacote completo: inclui manifest, service worker, observatório e ponte SDR.

## Testes ainda necessários
- Abrir a aplicação publicada por HTTPS e confirmar carregamento do CDN `satellite.js@7.2.0`.
- Confirmar consulta real CelesTrak, resposta JSON e conversão de pelo menos um objeto.
- Confirmar propagação, mapa e cálculo de visibilidade no Chrome Android e desktop.
- Testar comportamento com rede indisponível e cache OMM existente.

**Importante:** elementos orbitais são dados de posição/órbita. Não demonstram que um satélite oferece Internet, que há cobertura sobre uma região, nem que existe sinal RF acessível. O receptor SDR e o terminal satelital continuam dependentes de hardware, serviço e autorização próprios.

## Fontes técnicas consultadas
- CelesTrak — GP Data Formats: https://celestrak.org/NORAD/documentation/gp-data-formats.php
- CelesTrak — Current GP Element Sets: https://celestrak.org/NORAD/elements/
- satellite.js — npm: https://www.npmjs.com/package/satellite.js


## Correção RC2.1 — carregamento da biblioteca

A captura de homologação mostrou a mensagem `satellite.js 7.2.0 ou json2satrec indisponível`.
A integração foi alterada para importar a distribuição ESM fixa `satellite.js@7.2.0/+esm`,
atribuir o namespace a `window.satellite` e aguardar a Promise antes de processar os registros OMM.

Validação local: inspeção estrutural do HTML e verificação de sintaxe do JavaScript inline.
Pendente: confirmar no Chrome Android a resolução do CDN, a presença de `json2satrec`,
o retorno HTTP do CelesTrak e a conversão real de registros OMM.


## Correção 6.1.1 — visibilidade no diagnóstico geral

O diagnóstico geral agora separa disponibilidade da biblioteca, existência de elementos orbitais OMM, época dos dados, conversão SGP4 e formato consultado. A aplicação usa GP OMM JSON do CelesTrak; não deve chamar esses registros de TLE clássico. A ausência de dados é exibida explicitamente como pendência.
