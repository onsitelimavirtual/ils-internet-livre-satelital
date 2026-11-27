# ILS 7.0.1 — notas de correção

## Signal Intelligence chart
- Layout Canvas com gutter responsivo para rótulos numéricos.
- Eixo Y: cinco valores alinhados; unidade ms reposicionada para não colidir com o primeiro tick.
- Eixo X: no máximo três ticks numéricos (início, meio, fim), com título independente.
- Redesenho ao redimensionar/orientar; uso de setTransform evita escala DPR cumulativa.

## Wi-Fi público mapeado
- Raio selecionável em metros (250–5.000). A consulta Overpass usa o raio selecionado e resultados são calculados por distância.
- Status explicita quantidade, raio e origem dos dados.
- Mapa/lista representam pontos publicados no OSM, não SSIDs detectados em RF.
- Nenhum scanner Wi-Fi nativo está incluído nesta PWA. Para varredura ao vivo, requer código Android e permissões; não afirmar disponibilidade sem validação em aparelho.

## Teste e comercialização
Esta atualização é correção visual e esclarecimento funcional. Antes de comercializar como produto de coleta Wi-Fi ao vivo, é necessário integrar/testar APK nativo, permissões Android, varredura de SSIDs, atualização de localização, disponibilidade de dados OSM e funcionamento real do mapa em dispositivos.
