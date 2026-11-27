ILS 7.0.1 — AJUSTE VISUAL DO GRÁFICO E CLAREZA DO WI-FI

Base: ILS 7.0.0 Android Intelligence Integrated.

CORREÇÕES
1. Gráfico Signal Intelligence redesenhado com margens calculadas responsivamente, escala Y alinhada, rótulos de eixo X reduzidos a até três marcações e título de eixo separado.
2. Canvas redesenha em mudança de tamanho/orientação, sem acumular escala DPR.
3. Ajuste de altura do gráfico para celular e desktop.
4. Busca Wi-Fi público agora oferece raios explícitos em metros: 250, 500, 750, 1.000, 1.500, 2.000, 3.000 e 5.000 m.
5. Status da busca informa quantidade de pontos mapeados e raio utilizado; resultados continuam ordenados por distância e exibidos em lista e mapa quando o mapa está disponível.
6. Aviso distingue registros públicos do OpenStreetMap de uma varredura de rádio real.
7. Cache PWA atualizado para 7.0.1.

LIMITAÇÃO IMPORTANTE
A PWA não enumera SSIDs nem detecta redes de rádio Wi-Fi ao vivo. O módulo consultado encontra pontos de acesso públicos etiquetados no OpenStreetMap; os registros podem estar desatualizados e não garantem que a rede esteja ativa, visível, gratuita ou aberta. Uma busca real de redes próximas requer APK/bridge Android nativo, permissões compatíveis e teste em aparelho.

VALIDAÇÃO
- ZIP íntegro.
- Sintaxe JavaScript e manifesto verificados.
- Verificações estáticas de IDs, referências locais e atualização de cache.
- Testes simulados de gráfico responsivo e consulta geográfica previstos no relatório.
- Não equivale a teste de campo nem comprova disponibilidade de redes no endereço do usuário.
