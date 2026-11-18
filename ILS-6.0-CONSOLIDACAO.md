# ILS 6.0 — Consolidação (RC1)

**Branch:** `ils-6.0-consolidation`  
**Base de integração:** `ils-6.0-development`  
**Linha comercial de referência:** `v6.0-commercial`  
**Publicação:** não realizada. A branch publicada `portfoliolimavirtual` não foi alterada.

## Escopo integrado nesta RC1

- Mantidos os módulos e recursos da linha de desenvolvimento 6.0, incluindo Observatório Inteligente, consulta à camada geográfica agregada e integração documental da ponte SDR.
- Incorporados ao menu e à aplicação os módulos **ILS Remote** e **ILS Impact**, selecionados da linha comercial.
- Mantidos os avisos de que Remote e Impact usam armazenamento local do navegador e não sincronizam com Supabase nesta etapa.
- Mantidos os limites: Remote gera triagem preliminar, não projeto executivo; Impact distingue dados informados de registros verificados em campo.
- Atualizados título, nome do aplicativo e manifesto PWA para identificar a consolidação.
- Criado namespace de cache independente: `ils-v6.0.0-consolidation-rc1`.

## Política de versões e compatibilidade

As referências antigas encontradas nos arquivos não foram substituídas em massa:

- **Versão do produto:** ILS 6.0.0 — Consolidação RC1 (identificação da linha em homologação).
- **Versão do backup:** o campo `backupVersion` identifica o formato de backup e deve permanecer compatível com o importador correspondente.
- **Versão do payload/relatório:** valores históricos como `4.2` podem identificar o contrato de exportação ou estrutura legada, não necessariamente a versão visual do aplicativo.
- **Versões em nomes de arquivo:** nomes legados de exportação foram preservados para não alterar silenciosamente integrações e rotinas existentes.

Antes de uma versão estável, revisar explicitamente os formatos de backup, relatórios e exportações, criando migração versionada e testes de importação. Não alterar esses identificadores por substituição textual global.

## Verificações estáticas realizadas nesta etapa

- Os 21 itens de navegação possuem seção correspondente.
- Todas as 21 seções têm item de navegação.
- Não foram encontrados IDs HTML duplicados.
- Os formulários `remoteForm` e `impactForm` e seus respectivos contêineres estão presentes.
- A referência ao script `observatory.js` foi preservada.
- O manifesto PWA está alinhado ao nome da consolidação.
- O service worker usa namespace de cache exclusivo para evitar colisão com as linhas anteriores.

## Testes ainda necessários antes de homologar

1. Executar a aplicação em navegador real (desktop e Android) e verificar todos os menus, formulários, mapas e gráficos.
2. Validar criação, leitura, exportação e recuperação dos dados locais Remote/Impact após recarga e atualização do PWA.
3. Testar o Observatório com Supabase, RLS, função geográfica agregada e cenários sem amostra suficiente.
4. Testar consentimentos e fluxo de localização com usuário autenticado; confirmar que coordenadas exatas não aparecem em consultas públicas.
5. Testar atualização e limpeza de cache do service worker em instalações existentes.
6. Testar backup/importação e compatibilidade com dados das versões anteriores.
7. Instalar e testar a ponte RTL-SDR com hardware real e registrar limitações.
8. Executar revisão de segurança, acessibilidade, LGPD, fontes externas e licenças de terceiros.

## Estado

**RC1 integrada em branch de homologação, ainda não homologada.**  
Não publicar, não mesclar com `portfoliolimavirtual` e não anunciar como produto comercial pronto até que os testes pendentes sejam executados e aprovados.


## Revisão visual complementar

A revisão local subsequente e suas verificações estão registradas em `ILS-6.0-REVISAO-VISUAL.md`. Ela integra a seção de conectividade legítima à tela do Localizador Wi-Fi, adiciona o elemento de status ausente e reduz a área vazia inicial do mapa. As validações de navegador e hardware permanecem pendentes.


## Atualização do módulo orbital — OMM JSON (RC2)

- Substituída a consulta CelesTrak em TLE por OMM JSON (`FORMAT=JSON`) nos grupos Estações, Ativos e Meteorológicos.
- Atualizada a dependência `satellite.js` de 5.0.0 para 7.2.0 e utilizada `json2satrec` para converter registros OMM em elementos SGP4.
- Catálogo, estimativa de visibilidade e mapa orbital passam a utilizar identificadores NORAD como texto, sem truncar a cinco dígitos.
- Cache local separado (`ils-omm-v720:*`), com validade de duas horas e fallback offline. O cache TLE antigo não é migrado para evitar misturar formatos.
- Diagnóstico e textos de interface atualizados para informar OMM, origem e época dos dados.
- Service worker atualizado para `ils-v6.0.0-consolidation-rc2-omm`, evitando servir o HTML orbital anterior do cache.

**Limitações e validação:** a sintaxe JavaScript e a estrutura do pacote foram verificadas localmente. A consulta ao vivo ao CelesTrak e o carregamento do CDN não puderam ser executados neste ambiente. O primeiro teste em navegador com rede deve confirmar `satellite.json2satrec`, CORS/HTTPS, resposta OMM e propagação. Os dados orbitais não comprovam cobertura de Internet, recepção RF ou disponibilidade de serviço.
