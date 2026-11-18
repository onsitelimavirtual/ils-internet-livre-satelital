# ILS 5.9 — Ponte local RTL-SDR (somente recepção)

Este serviço é um componente opcional para um computador que tenha um receptor RTL-SDR compatível e o utilitário `rtl_power` instalado. Ele não faz parte do site estático e não transforma o celular em receptor SDR.

## Requisitos
- Python 3.10 ou superior.
- RTL-SDR compatível, driver correto e `rtl_power` instalado.
- Uso somente em frequências e condições autorizadas.

## Instalação
1. Instale os drivers/utilitários do projeto RTL-SDR para seu sistema operacional.
2. Entre nesta pasta.
3. Crie um ambiente virtual e instale dependências:

```bash
python -m venv .venv
# Windows:
.venv\\Scripts\\activate
# Linux/macOS:
source .venv/bin/activate
pip install -r requirements.txt
```

4. Inicie a ponte, vinculada somente ao loopback:

```bash
uvicorn main:app --host 127.0.0.1 --port 8765
```

5. No ILS, mantenha a URL `http://127.0.0.1:8765`, teste a ponte e solicite uma análise de espectro.

## Contrato da API
- `GET /health` informa se `rtl_power` está disponível.
- `GET /spectrum?start_mhz=88&stop_mhz=108&step_khz=50&gain=auto` executa uma leitura única e retorna amostras reais em dBFS.
- Faixa limitada a 24–1766 MHz, largura máxima de 100 MHz, passos 25/50/100/250 kHz e ganhos predefinidos.
- Apenas uma leitura simultânea. O endpoint não transmite.

## Segurança e limitações
- O servidor escuta apenas em `127.0.0.1`; não o exponha à rede pública nem faça port-forward.
- CORS é limitado por padrão aos domínios GitHub Pages indicados. Para outro domínio, defina `ILS_ALLOWED_ORIGINS` com a origem exata, separada por vírgulas.
- O navegador pode bloquear a consulta por políticas de rede local, conteúdo misto ou CORS. Nesse caso, use um ambiente de navegador compatível e confira a origem permitida.
- O serviço não autentica usuários locais: mantenha-o no computador confiável e não o vincule a `0.0.0.0`.
- O gráfico representa potência relativa informada pelo `rtl_power`; não é medição calibrada em dBm, não identifica conteúdo de comunicações e não comprova conectividade satelital.
- Sem hardware e utilitário instalados, o endpoint retorna erro; o ILS não simula amostras.

Consulte a regulamentação da Anatel e os manuais do fabricante do receptor antes de qualquer operação.
