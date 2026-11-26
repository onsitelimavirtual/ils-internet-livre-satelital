ILS 6.3.10 — FALHAS CORRIGIDAS

Base: ILS 6.3.8 fornecida na conversa. Esta versão preserva os módulos e recursos anteriores e corrige: 
1. Função validLocatorCoords ausente, agora centralizada e com mensagens específicas para latitude/longitude inválidas.
2. Listener duplicado do botão de teste SDR removido; permanece um único fluxo de teste com timeout e mensagens de indisponibilidade.
3. A ponte SDR é explicitamente opcional; sua ausência não impede os recursos web do ILS.
4. Registro local de até 40 erros JavaScript/promessas, sem transmissão externa. Para consultar no Console: ILS_getLocalErrorAudit(). Para limpar: ILS_clearLocalErrorAudit().
5. Atualização de metadados e cache PWA para 6.3.9.

PUBLICAÇÃO
Extraia todos os arquivos na mesma pasta/raiz HTTPS. Preserve a pasta/versão 6.3.8 para rollback. Após publicar, feche e reabra o PWA ou limpe os dados do site se o navegador mantiver cache antigo.

LIMITES DE VALIDAÇÃO
A validação automatizada cobre sintaxe, presença de funções, manifesto, referências locais e integridade do ZIP. Não substitui teste real em Chrome/Edge/Firefox, Android, nem teste com ponte SDR instalada. A ponte não é incluída neste pacote.


INTEGRAÇÃO DO OBSERVATÓRIO — V6.3.10
- O Observatório consulta o RPC público `get_connectivity_observatory_public_summary` do projeto Supabase Painel Lima Virtual.
- A consulta utiliza somente chave publicável (não é chave service_role) e retorna exclusivamente agregados.
- O painel não consulta a tabela bruta `connectivity_observatory_events`.
- O backend exige pelo menos cinco participantes distintos por grupo. Com a base atual, é esperado que a consulta retorne lista vazia até atingir esse limiar.
- Exportação CSV contém apenas os campos agregados recebidos.
- Não há autenticação de usuário nesta leitura pública, nem exposição de coordenadas, identificadores ou linhas individuais.
- A integração depende de conexão HTTPS e disponibilidade do projeto Supabase.
