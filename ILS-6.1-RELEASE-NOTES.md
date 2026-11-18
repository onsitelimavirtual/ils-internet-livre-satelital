# ILS 6.1 — Release candidate

## Objetivo
Consolidar a identidade PWA, a integração orbital OMM e diagnóstico explícito de falhas de ambiente/rede.

## Alterações
- Identidade do produto e manifesto atualizados para ILS 6.1.
- Cache do Service Worker isolado em `ils-v6.1.0-release-candidate`.
- Carregador orbital tenta provedores ESM em sequência e valida os exports obrigatórios.
- Diagnóstico diferencia página aberta por `file://`/`content://` de falha de rede/CORS em HTTPS.
- Erros deixam de ser reduzidos a uma mensagem genérica; detalhes ficam no console e no painel da tela orbital.

## Limitações e homologação necessária
- O catálogo depende de conexão com CelesTrak e de permissões CORS do ambiente.
- Abrir o HTML diretamente como `content://` pode bloquear módulos ESM externos. Para teste real, servir por HTTPS (GitHub Pages) ou localhost.
- A execução local desta entrega não tem acesso externo à rede, portanto não foi possível comprovar download de satellite.js ou resposta de CelesTrak.
- SDR físico, sincronização Supabase/RLS, navegadores reais, instalação PWA e testes de campo precisam de homologação específica.
- Não declarar esta RC como produção homologada até concluir a matriz de testes.

## Critério de aceite orbital
1. `window.ILS_ORBITAL_DIAGNOSTIC.status === "ready"`.
2. `json2satrec`, `propagate` e `eciToGeodetic` existem.
3. CelesTrak responde HTTP 200 com array OMM válido.
4. Pelo menos um registro converte para SatRec sem erro.
5. Propagação retorna posição/velocidade e coordenadas geodésicas finitas.
6. A interface mostra quantidade, origem e época dos dados.
