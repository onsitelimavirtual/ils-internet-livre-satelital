# Auditoria técnica — ILS 6.3.7

## Escopo
Auditoria estática do HTML da versão 6.3.7, empacotamento dos recursos referenciados e verificações automatizadas. Base de produto: ILS 6.3.6 Connectivity & Satellite Intelligence.

## Recursos conferidos
- `index.html` referencia `favicon-64.png`, `icon-192.png` e `manifest.webmanifest`; os arquivos estão incluídos.
- Manifesto inclui ícones 192 e 512 px.
- Service Worker `sw.js` incluído e registrado pelo HTML em contexto HTTP(S).
- Biblioteca Leaflet permanece carregada por CDN externa (`unpkg.com`), portanto mapas dependem de conexão para carregar a biblioteca quando não estiver em cache.
- Painel de capacidade separa navegador/PWA/WebView/ponte nativa e não presume que PWA tenha acesso a RSSI.

## Verificações executadas
- Sintaxe JavaScript: aprovada via Node.js após extração do script inline.
- IDs HTML duplicados: nenhum.
- Elementos referenciados pelo painel de capacidade: presentes.
- JSON do manifesto: válido.
- Recursos locais referenciados: presentes no pacote.
- Integridade CRC do ZIP: aprovada.

## Limitações / testes ainda necessários
- A identificação PWA/WebView depende de sinais do navegador e user-agent; pode variar entre fabricantes.
- O retorno real da ponte Android, permissões e RSSI precisam ser testados no APK/dispositivo.
- Testes funcionais em Android, iOS e desktop não foram executados neste ambiente.
- Não foi feita publicação nem alteração do repositório GitHub.
- A presença de `navigator.onLine` não comprova Internet funcional; a API de rede do navegador é opcional e estimativa.
