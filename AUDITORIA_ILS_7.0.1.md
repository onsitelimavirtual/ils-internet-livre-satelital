# Auditoria de correção — ILS 7.0.1

## Defeitos observados nas capturas
- Unidade “ms” colidia com tick superior do eixo Y.
- Rótulos extremos do eixo X colidiam com o título “Sonda” e se sobrepunham em viewport estreita.
- A área do gráfico e os rótulos não adaptavam adequadamente a largura do dispositivo.

## Correções aplicadas
- Margens responsivas e escala de desenho baseada no tamanho CSS real.
- Rótulos X limitados a 3 e título separado.
- Unidade Y reposicionada; ticks alinhados à direita.
- Redesenho em resize/orientação e reset de transformação do canvas.
- Opções de raio Wi-Fi explicitamente em metros; status inclui raio e total.
- Aviso explícito de que a busca é por pontos OSM, não redes de rádio detectadas.

## Validação executada
- Sintaxe JavaScript, manifesto, integridade do ZIP e verificações estáticas.
- O gráfico foi revisado para evitar colisão de texto em viewport estreita e desktop.
- A busca de Wi-Fi foi auditada no código: a consulta usa Overpass/OSM, filtra e ordena pontos por distância, renderiza lista e marcadores Leaflet quando a biblioteca/mapa estão disponíveis.

## Limitações não resolvidas
- O ILS 7.0.1 PWA não realiza varredura Wi-Fi RF nem detecta SSIDs em tempo real. Não existe API de scan nativo implementada no HTML/bridge desta versão.
- Dados OSM são colaborativos, não garantem atualidade ou disponibilidade física.
- Não foi possível afirmar redes específicas visíveis no local do usuário; a localização precisa não foi fornecida e a consulta é apenas de registros públicos.
- Não é homologação de produto comercial completo; falta APK/bridge Android real, testes em dispositivos, rede e permissões, além de revisão operacional/legal.
