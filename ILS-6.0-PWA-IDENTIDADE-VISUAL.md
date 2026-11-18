# ILS 6.0 — Identidade visual no PWA

## Aplicação da logomarca
- `ils-logo.png`: arte completa enviada para a identidade visual.
- `icon-192.png` e `icon-512.png`: ícones quadrados para instalação Android/PWA, com a arte inteira preservada em fundo azul-marinho.
- `favicon-64.png`: favicon do navegador.
- Manifesto: nome, descrição, cores e ícones `any`/`maskable` atualizados.
- HTML: ícones do navegador e Apple Touch Icon, metadados de compartilhamento e marca na navegação lateral.
- Service worker: cache versionado e pré-cache dos novos ativos visuais.

## Observações
O splash screen Android é gerado pelo navegador a partir do manifesto e dos metadados de instalação; sua aparência exata depende da versão do Chrome/Android. Após publicar a atualização, pode ser necessário atualizar/reinstalar o PWA para renovar o ícone e a tela inicial.
