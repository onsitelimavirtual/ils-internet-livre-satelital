# ILS 6.0 — Revisão estrutural e visual (RC1 revisada)

Data da revisão: 18/11/2026

## Correções aplicadas ao pacote local

1. A seção `lawful-connectivity`, que estava depois do rodapé e fora da navegação principal, foi incorporada à tela `view-locator`.
2. O conteúdo do Localizador Wi-Fi passou a existir em um único ponto da interface, com filtros por tipo de local, condição de acesso e ordenação.
3. Foi criado o elemento `publicWifiStatus`, que era esperado pelo JavaScript, mas não existia no HTML. Sem ele, ações de busca e geolocalização poderiam falhar ao tentar atualizar o status.
4. O mapa do Localizador agora apresenta uma mensagem inicial em vez de uma área vazia.
5. A altura visual do mapa Wi-Fi foi reduzida para ocupar menos espaço sem remover sua funcionalidade.
6. Ao abrir a tela do Localizador, o mapa integrado recebe `invalidateSize()` após a exibição.

7. A marca lateral foi reconstruída com elementos HTML/CSS, eliminando a dependência de uma imagem externa/local que aparecia quebrada ao abrir o HTML pelo gerenciador de arquivos do Android.
8. O menu móvel recebeu largura limitada a 84vw (máximo de 310px), sobreposição real com backdrop, rolagem própria, bloqueio da rolagem do conteúdo de fundo e suporte a fechamento por toque fora, seleção de tela e tecla Escape.
9. O estado acessível do botão e do backdrop agora acompanha a abertura e o fechamento do menu.

## Verificações estáticas realizadas

- 21 itens de navegação correspondem a 21 telas.
- Nenhuma tela ficou sem item de navegação.
- Nenhum item de navegação aponta para uma tela inexistente.
- Nenhum ID HTML duplicado.
- Nenhuma seção de conteúdo ficou solta diretamente no `main` fora da estrutura `.view`.
- JavaScript inline passou na verificação sintática `node --check`.
- Os módulos e arquivos funcionais do pacote foram preservados; a imagem de marca deixou de ser requisito para renderizar o cabeçalho.

## Pendências que ainda exigem teste real

- Confirmar visualmente em aparelho Android real a largura do menu, sobreposição, gesto/toque fora, rolagem interna e cabeçalho; o ambiente de edição não executa Chrome Android.
- Testar busca Wi-Fi com localização permitida e negada, resultados vazios, filtros e indisponibilidade dos serviços Overpass.
- Validar mapas Leaflet após troca de telas, rotação e redimensionamento.
- Validar catálogo TLE, cálculos orbitais e gráficos com dados reais.
- Testar ponte SDR com receptor físico compatível.
- Testar Remote e Impact: salvar, recarregar, exportar, dados inválidos e armazenamento cheio.
- Testar Supabase, RLS, camada geográfica agregada e funcionamento offline do Observatório.
- Testar instalação/atualização do PWA e compatibilidade dos backups antigos.
- Executar revisão de acessibilidade, segurança, LGPD e licenças de dependências.

## Estado

Esta revisão melhora a organização do HTML e elimina a seção órfã e o ponto de falha no status do Localizador Wi-Fi. É uma revisão estrutural local da RC1; não equivale a homologação funcional, publicação ou aprovação comercial. A branch publicada não foi alterada.


## Atualização orbital RC2

O catálogo orbital foi migrado de TLE para OMM JSON da CelesTrak e `satellite.js` 7.2.0. O cálculo SGP4 agora converte cada registro com `json2satrec`; mapa e visibilidade usam o registro convertido e o identificador NORAD completo. O cache é exclusivo para OMM e respeita janela de duas horas. A execução online real permanece pendente, pois o ambiente de construção não teve acesso à rede para testar o CDN ou a API.
