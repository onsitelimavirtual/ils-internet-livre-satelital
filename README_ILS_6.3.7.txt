ILS 6.3.7 — CAPABILITY INTELLIGENCE

BASE
Derivada da ILS 6.3.6 Connectivity & Satellite Intelligence. A versão anterior deve ser preservada.

NOVIDADE PRINCIPAL
Novo painel “ILS — Diagnóstico de capacidade”, dentro de Diagnóstico, que identifica:
- ambiente: navegador Android/iOS/desktop, PWA instalado, WebView ou aplicativo com ponte nativa ILS;
- presença da ponte window.IlsAndroid.getSnapshot();
- recursos web disponíveis: sondas HTTPS, armazenamento local, Service Worker e API de informações de rede;
- disponibilidade real de RSSI/dBm e dados Wi-Fi quando a ponte nativa fornece esses valores;
- dependências externas para SDR e controle de roteador/failover.

COMPORTAMENTO E LIMITES
- PWA instalado não é APK e não recebe automaticamente permissões Android.
- O painel não declara RSSI/dBm disponível só porque existe um botão de leitura; exige valor numérico não nulo vindo da ponte nativa.
- A API de informações de rede do navegador é opcional e limitada; downlink/RTT são estimativas, não medição certificada.
- SDR requer receptor físico e ponte local/backend compatível.
- Failover/controle de roteador requer gateway autorizado e integração própria.
- A identificação do ambiente é heurística baseada no user-agent, display-mode e presença da ponte. Não é atestado criptográfico do aplicativo.
- O painel não instala APK nem solicita permissões Android.

INSTALAÇÃO
1. Faça backup da versão publicada e preserve a pasta 6.3.6.
2. Substitua somente o HTML principal pelo arquivo ILS_6.3.7_Capability_Intelligence.html (renomeie para index.html se esse for o nome usado na publicação).
3. Mantenha manifest.webmanifest, sw.js, logos, ícones e demais recursos existentes na mesma pasta.
4. Abra o ILS e acesse Diagnóstico > ILS — Diagnóstico de capacidade.
5. Toque em “Verificar novamente”. Compare o resultado no navegador, no PWA instalado e no APK ILS Android Intelligence, se disponível.

VALIDAÇÃO
Validações executadas nesta entrega: sintaxe JavaScript aprovada; 288 IDs HTML verificados sem duplicidade; integridade do ZIP aprovada. Testes reais em Android e desktop são necessários para confirmar a classificação em cada dispositivo.
Nenhuma publicação GitHub foi realizada nesta entrega.
