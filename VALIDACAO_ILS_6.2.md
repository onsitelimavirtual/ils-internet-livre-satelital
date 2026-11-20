# Validação técnica — ILS 6.2 Connectivity Intelligence

## Aplicação web
- 22 itens de navegação e 22 views correspondentes na estrutura estática.
- Sintaxe JavaScript inline validada anteriormente com Node.js.
- Manifest JSON válido; ZIP validado anteriormente.
- Módulo SD-WAN web: cadastro manual, comparação heurística, edição, exclusão individual e exportação JSON.

## Agente Linux Dual-WAN — incremento
- `ils_agent.py`: compilação Python validada (`py_compile`).
- Configuração de exemplo: validação estrutural e dependência `ping` verificadas.
- Teste simulado com executável `ping` controlado: dois links processados; estado, perda e latência interpretados.
- Serviço systemd e instalador Debian/Ubuntu incluídos.
- Segurança: modo somente leitura; sem alteração de rota/firewall, sem failover e sem envio remoto.

## Não validado em ambiente real
- Não foi executado em um host Linux com duas conexões WAN físicas/reais.
- Não foi validada a associação efetiva de cada interface ao respectivo provedor/rota.
- Não há integração com a interface web, Supabase, API ou gateway.
- Não há failover, balanceamento, QoS, controle de roteador ou Edge AI.

**Conclusão:** pacote de desenvolvimento para ensaio controlado. Teste simulado não equivale a homologação de campo.
