ILS 6.3.7 — CAPABILITY INTELLIGENCE | PACOTE AUDITADO

CONTEÚDO
- index.html: aplicação principal, baseada na versão 6.3.6 e acrescida do diagnóstico de capacidade.
- manifest.webmanifest, sw.js e ícones: recursos para instalação PWA e cache básico.
- NOTAS_TECNICAS.md: escopo, limitações e resultados da auditoria.

INSTALAÇÃO / PUBLICAÇÃO
1. Faça backup integral da versão atualmente publicada. Não apague a pasta/ZIP 6.3.6.
2. Extraia TODO o conteúdo deste ZIP mantendo os arquivos na mesma pasta.
3. Publique os arquivos juntos na raiz do site (index.html, manifest.webmanifest, sw.js e três ícones).
4. Em hospedagem HTTPS, abra o site, atualize/recarregue e use “Instalar aplicativo”/“Adicionar à tela inicial” para instalar o PWA.
5. No ILS, abra Diagnóstico > ILS — Diagnóstico de capacidade > Verificar novamente.
6. Para substituir uma publicação existente, faça isso somente após testar a cópia em endereço de homologação.

IMPORTANTE
- O PWA não é APK e não recebe automaticamente permissões Android para RSSI/dBm, SSID ou frequência.
- A ponte nativa ILS Android Intelligence só é reconhecida quando o HTML roda no aplicativo nativo que a expõe.
- O diagnóstico do ambiente é heurístico, não atestado de segurança.
- Mapas usam Leaflet via CDN unpkg; essa parte exige Internet. As funções locais principais podem abrir sem rede se o app já estiver em cache.
- Não foram executados testes físicos em Android/desktop nem publicação GitHub nesta entrega.

ROLLBACK
Restaure a cópia integral anterior (HTML, manifest, service worker e ícones) se houver incompatibilidade. Preserve os dados locais/exporte backups antes de limpar armazenamento ou desinstalar o PWA.
