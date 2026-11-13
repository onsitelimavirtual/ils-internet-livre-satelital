# ILS 5.0 — Inteligência de Conectividade

**© 2026 Nailson Lima. Todos os direitos reservados.**  
Contato: onsite.limavirtual@gmail.com

## Posicionamento
Plataforma de inteligência territorial e conectividade. O ILS fornece mapas de registros públicos, diagnósticos preliminares, ferramentas de análise e organização de informações. Não fornece acesso à Internet, não gera sinal satelital e não garante disponibilidade de pontos Wi-Fi.

## Novidades desta edição
- Identidade ILS 5.0 e posicionamento institucional.
- Área Negócios e Licenças com cadastro demonstrativo local de licenças de uso.
- Resumo de registros, validade por data, valor nominal e exportação JSON.
- Termos de uso e política de privacidade atualizados para licenciamento de uso.
- Identificação inicial da operação por pessoa física e contato oficial.
- Preservação dos módulos existentes de dados orbitais, localizador, diagnóstico, viabilidade, relatórios e backup.

## Aviso crítico sobre o painel de licenças
O registro de licenças desta versão é **local e demonstrativo**. Não autentica administradores, não valida pagamentos, não impede acesso ao código ou às funcionalidades, não sincroniza entre dispositivos e não constitui sistema de cobrança. Para comercialização real, implementar backend autenticado, banco central, autorização server-side, trilha de auditoria, integração de pagamentos e rotinas de cancelamento/renovação. Não inserir dados sensíveis ou dados reais de clientes neste protótipo.

## Operação inicial
- Modelo pretendido: licença de uso, sem transferência da propriedade intelectual.
- Titular indicado dos direitos autorais: Nailson Lima.
- Operação inicial: pessoa física, sujeita à validação jurídica e tributária.
- E-mail: onsite.limavirtual@gmail.com.
- Os valores dos planos são hipóteses para validação comercial, não oferta final nem cobrança integrada.

## Instalação — GitHub Pages
1. Extraia o ZIP.
2. Envie o conteúdo da pasta para a raiz do repositório.
3. Configure Pages para publicar a branch e pasta corretas.
4. Aguarde HTTPS e teste em celular e computador.

## Android / Pydroid 3
1. Extraia todos os arquivos na mesma pasta.
2. Execute `servidor_ils.py` no Pydroid 3.
3. Abra o endereço local indicado pelo servidor.

## Limitações técnicas e validação
- Mantém dependências externas existentes (Leaflet, OpenStreetMap/Overpass, CelesTrak e satellite.js, conforme módulo).
- Os pontos Wi-Fi são registros colaborativos, não prova de disponibilidade.
- A leitura RSSI depende da Android Bridge nativa; navegador comum não fornece essa informação.
- Não há integração real com terminal/modem satelital, SDR físico ou bases oficiais autenticadas.
- Os dados de projetos e licenças demonstrativas ficam no armazenamento local do navegador.
- Testes estáticos de sintaxe, estrutura e ZIP podem ser executados nesta entrega; testes reais em Android, iOS, GitHub Pages, serviços externos, segurança e acessibilidade permanecem pendentes.

## Documentos legais
A seção Termos e Privacidade é uma minuta inicial. Antes de comercializar, preencher dados de identificação fiscal e endereço, mapear fornecedores e tratamentos reais, definir retenção e obter revisão jurídica. A operação remunerada por pessoa física deve ser analisada também sob os aspectos funcionais e tributários aplicáveis.
