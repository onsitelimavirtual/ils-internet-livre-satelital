# ILS 4.1 — Inteligência de Conectividade e Inclusão Digital

**Copyright © 2026 Nailson Lima.**  
**Contato:** onsite.limavirtual@gmail.com

## Posicionamento
O ILS é uma plataforma híbrida de informação e planejamento para localizar pontos Wi-Fi públicos mapeados, consultar oportunidades institucionais e organizar diagnósticos preliminares de conectividade.

O ILS **não gera Internet**, não desbloqueia sinais de satélite e não substitui operadoras ou provedores autorizados.

## Módulos
- Visão geral e transparência operacional.
- Catálogo orbital com dados TLE consultados online.
- Estimativa geométrica de visibilidade, quando há TLE válido e biblioteca orbital disponível.
- Mapa orbital e mapa de pontos Wi-Fi mapeados.
- Frequências e sinais como conteúdo educativo; não há varredura RF pelo navegador.
- Integração SDR apenas como planejamento; requer equipamento e ponte local.
- Catálogo de programas e fontes públicas.
- Localizador de pontos Wi-Fi com dados colaborativos do OpenStreetMap/Overpass.
- Inteligência de conectividade: cadastro de necessidade, triagem preliminar, pendências, recomendações, armazenamento local, exportação JSON e impressão/PDF.
- Avaliação de viabilidade e plano de implantação.
- Relatórios, backup e restauração locais.
- PWA com cache básico da estrutura local.

## Instalação e publicação
### GitHub Pages
1. Extraia o ZIP.
2. Envie **todos os arquivos** para a raiz do branch `main` do repositório.
3. Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
4. Aguarde a publicação e teste a URL HTTPS em celular e computador.

### Android / Pydroid 3
1. Extraia o pacote mantendo `index.html`, `servidor_ils.py` e os demais arquivos na mesma pasta.
2. Abra `servidor_ils.py` no Pydroid 3 e execute pelo editor Python.
3. O iniciador tenta as portas 8000, 8001 e 8080 e informa a URL local.
4. Mantenha o servidor aberto enquanto utiliza a aplicação.

## Privacidade e dados
- Os registros de casos e avaliações são armazenados no `localStorage` do navegador.
- Não há autenticação, sincronização em nuvem, banco multiusuário ou envio automático de relatórios.
- Evite inserir dados pessoais sensíveis. Faça exportação de backup antes de limpar os dados do navegador.
- Geolocalização exige permissão do usuário e contexto seguro (HTTPS ou localhost).

## Dependências externas
- Leaflet e mapas OpenStreetMap.
- Overpass API para registros colaborativos de pontos Wi-Fi.
- CelesTrak para elementos orbitais TLE.
- satellite.js para cálculos orbitais.
- Google Fonts para tipografia.
Esses serviços podem falhar, limitar consultas, mudar condições ou ficar indisponíveis. A aplicação local pode abrir mesmo quando os serviços externos não respondem, mas os recursos que dependem deles não funcionarão.

## Limitações essenciais
- Pontos Wi-Fi do OpenStreetMap são dados colaborativos e não confirmam que a rede esteja ativa, gratuita, aberta ou acessível.
- O catálogo de programas apresenta referências e orientações; elegibilidade e disponibilidade devem ser confirmadas com o órgão responsável.
- A análise de conectividade é uma triagem baseada nos dados informados, não laudo técnico, confirmação de cobertura, aprovação de programa ou orçamento.
- Não há conexão direta a satélite, integração real com modem/terminal, SDR, teste de RF, consulta de cobertura de operadora ou integração oficial automática com bases governamentais.
- O modo offline cobre a estrutura local e dados já salvos; mapas, dados orbitais, fontes oficiais e buscas externas exigem Internet.
- Antes do uso comercial/institucional, recomenda-se auditoria de acessibilidade, segurança, privacidade, licenças de dados e validação das fontes.

## Validação desta entrega
- HTML parse: verificado por parser.
- JavaScript: verificado com `node --check`.
- Estrutura dos arquivos: verificada.
- Integridade do ZIP: verificada.
- Navegação interna: verificação estática de IDs e seções.
- Teste real em Android, browsers variados, serviços externos e GitHub Pages: pendente de execução no ambiente de publicação.

## Arquivos principais
- `index.html` — aplicação.
- `app.js` — cópia modular da lógica para manutenção.
- `styles.css` — estilos.
- `manifest.webmanifest` — manifesto PWA.
- `sw.js` — service worker.
- `ils-logo.png`, `icon-192.png`, `icon-512.png` — identidade visual e ícones.
- `servidor_ils.py` — servidor local opcional para Android/Pydroid 3.
