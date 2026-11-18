# ILS 6.1 — Matriz de validação

| Camada | Teste | Situação desta entrega |
|---|---|---|
| Estrutura | 21 navegações e telas correspondentes | Validar automaticamente no pacote |
| HTML | IDs duplicados | Validar automaticamente no pacote |
| JavaScript | Sintaxe dos scripts inline | Validar automaticamente no pacote |
| PWA | Manifesto, ícones e cache versionado | Validar automaticamente no pacote |
| Orbital | Carregador ESM e mensagens diagnósticas | Implementado; rede real pendente |
| OMM | Download CelesTrak e normalização | Pendente em HTTPS |
| SGP4 | Propagação e geodésica | Pendente com dados reais |
| Android | Chrome, instalação e atualização do PWA | Pendente em aparelho |
| Supabase | Auth, RLS, leitura/gravação | Pendente com projeto e credenciais reais |
| SDR | Receptor físico e ponte local | Pendente com hardware |
| Offline | Cache e recuperação após desconexão | Pendente em navegador real |

## Regra de homologação
Não converter itens pendentes em aprovados por inspeção estática. A RC só poderá ser declarada funcional após evidências dos testes externos e de dispositivo.
