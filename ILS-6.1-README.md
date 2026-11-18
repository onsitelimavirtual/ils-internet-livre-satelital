# ILS 6.1


## Correção 6.1.1 — diagnóstico orbital explícito

- O diagnóstico agora apresenta separadamente biblioteca, dados orbitais, época/atualização, conversão SGP4 e formato da fonte.
- Identifica explicitamente que a integração atual consulta CelesTrak GP em OMM JSON, e não TLE clássico de duas linhas.
- Mostra quantidade de registros convertidos, grupo consultado e época orbital mais recente.
- Não marca dados como verificados apenas porque a biblioteca JavaScript está carregada.
- A ausência de registros OMM/TLE permanece como pendência, com instrução para carregar o catálogo orbital.
