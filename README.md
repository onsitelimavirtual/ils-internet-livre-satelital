# ILS 6.1.2 — Internet Livre Satelital

Pacote independente do GitHub, preparado a partir dos arquivos fornecidos nesta conversa.

## Conteúdo
- `index.html` — aplicação principal.
- `ils-logo.png` — logomarca completa ILS 6.1.2.
- `icon-192.png`, `icon-512.png`, `favicon-64.png` — ícones PWA e favicon.
- `manifest.webmanifest` — identidade de instalação.
- `sw.js` — service worker com cache versionado.
- `observatory.js` — módulo Observatório.
- `documentacao/` — documentação técnica e notas das linhas 6.0/6.1.
- `VALIDACAO-6.1.2.md` — escopo dos testes e limitações.

## Executar localmente
Não abra o HTML diretamente pelo gerenciador de arquivos (`file://` ou `content://`), pois módulos externos e recursos PWA podem ser bloqueados. Sirva a pasta por HTTPS ou por um servidor local HTTP e abra `index.html`.

Exemplo Python:
```bash
python -m http.server 8000
```
Depois acesse `http://localhost:8000`.

## Persistência e backup
Parte dos registros usa `localStorage` no navegador e o Observatório mantém cache local. Isso não equivale a sincronização central nem backup em nuvem. Antes de limpar dados do site, trocar de navegador ou reinstalar, exporte os dados disponíveis pelo módulo de backup. A sincronização do Observatório depende da API Supabase configurada no módulo.

## Limites de homologação
Consulte `VALIDACAO-6.1.2.md`. Os testes estáticos de sintaxe e estrutura foram executados; serviços externos, autenticação, SDR físico, Android real, offline e persistência após reinício ainda exigem validação em ambiente real.

© 2026 Nailson Lima. Todos os direitos reservados.


Correção 6.1.2: recuperação do localizador Wi-Fi com fallback sequencial Overpass, classificação correta de gratuidade/restrição e busca automática após GPS. Consulte `documentacao/ILS-6.1.2-RECUPERACAO-LOCALIZADOR.md` e `VALIDACAO-6.1.2.md`.
