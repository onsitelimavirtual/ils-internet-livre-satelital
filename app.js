
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={satellites:[],source:null,lastUpdate:null,opportunities:[],map:null,mapLayer:null,mapTimer:null};
const groups={
 stations:"https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle",
 active:"https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle",
 weather:"https://celestrak.org/NORAD/elements/gp.php?GROUP=weather&FORMAT=tle"
};

function parseLocaleNumber(value){
 const normalized=String(value??"").trim().replace(/\s/g,"").replace(",",".");
 if(!normalized)return NaN;
 return Number(normalized);
}
function haversineMeters(lat1,lon1,lat2,lon2){
 const rad=d=>d*Math.PI/180,R=6371008.8;
 const dLat=rad(lat2-lat1),dLon=rad(lon2-lon1);
 const a=Math.sin(dLat/2)**2+Math.cos(rad(lat1))*Math.cos(rad(lat2))*Math.sin(dLon/2)**2;
 return 2*R*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
function formatDistance(m){
 return m<1000?`${Math.round(m)} m`:`${(m/1000).toFixed(2).replace(".",",")} km`;
}

function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)}
function setView(name){
 const target=$("#view-"+name);
 if(!target){toast("Esta seção não está disponível.");return;}
 $$(".view").forEach(v=>v.classList.toggle("active",v===target));
 $$(".nav-item").forEach(b=>{const active=b.dataset.view===name;b.classList.toggle("active",active);if(active)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");});
 const labels={overview:"Visão geral",satellites:"Catálogo orbital",visibility:"Visibilidade",map:"Mapa orbital",signals:"Frequências e sinais",sdr:"Integração SDR",access:"Acesso gratuito",opportunities:"Oportunidades reais",locator:"Localizador Wi-Fi",intelligence:"Inteligência de conectividade",diagnostics:"Diagnóstico",about:"Sobre e fontes",legal:"Termos e privacidade",feasibility:"Viabilidade",roadmap:"Plano de implantação",report:"Relatórios",data:"Dados e backup",business:"Negócios e licenças"};
 $("#page-title").textContent=labels[name]||name;
 $("#sidebar").classList.remove("open");
 $("#menuBtn").setAttribute("aria-expanded","false");
 requestAnimationFrame(()=>{target.scrollIntoView({behavior:"smooth",block:"start"});window.scrollBy({top:-12,behavior:"smooth"});});
 if(name==="data")refreshDataSummary();
 if(name==="business")renderIlsLicenses();
 if(name==="opportunities")renderOpportunityCatalog();
 if(name==="locator")setTimeout(()=>{if(initLocatorMap()&&state.locMap)state.locMap.invalidateSize();},180);
 if(name==="intelligence")renderCases();
 if(name==="map")setTimeout(()=>{if(initOrbitMap()){state.map.invalidateSize();if(state.satellites.length)updateOrbitMap();}},180);
}
document.addEventListener("click",event=>{
 const nav=event.target.closest(".nav-item[data-view]");
 if(nav){event.preventDefault();setView(nav.dataset.view);return;}
 const goto=event.target.closest("[data-goto]");
 if(goto){event.preventDefault();setView(goto.dataset.goto);}
});
$("#menuBtn").addEventListener("click",()=>{const open=!$("#sidebar").classList.contains("open");$("#sidebar").classList.toggle("open",open);$("#menuBtn").setAttribute("aria-expanded",String(open));});
document.addEventListener("keydown",event=>{if(event.key==="Escape"){$("#sidebar").classList.remove("open");$("#menuBtn").setAttribute("aria-expanded","false");}});
function updateNetwork(){const on=navigator.onLine;$("#network-label").textContent=on?"Conectado à rede":"Modo offline";$("#network-label").previousElementSibling.style.background=on?"#35c58b":"#d49a38"}
window.addEventListener("online",updateNetwork);window.addEventListener("offline",updateNetwork);updateNetwork();

function readNativeWifi(){
 const box=$("#wifiSignalResult");
 try{
  if(!window.IlsAndroid||typeof window.IlsAndroid.getWifiInfo!=="function"){
   box.innerHTML="<strong>Ponte Android não detectada.</strong><br>Abra o ILS pelo aplicativo Android Bridge instalado para obter RSSI real. No navegador comum, a leitura de dBm não está disponível.";
   return;
  }
  const raw=window.IlsAndroid.getWifiInfo(),data=JSON.parse(raw);
  if(!data.available){if(data.code==="permission_required"&&typeof window.IlsAndroid.requestWifiPermission==="function"){window.IlsAndroid.requestWifiPermission();}box.textContent=data.message||"Leitura Wi-Fi indisponível. Verifique permissões e conexão Wi-Fi.";return;}
  const rssi=Number(data.rssiDbm),quality=Number.isFinite(rssi)?(rssi>=-50?"Muito forte":rssi>=-60?"Forte":rssi>=-67?"Boa":rssi>=-75?"Regular":"Fraca"):"Não informado";
  box.innerHTML=`<strong>Leitura do Android · ${new Date().toLocaleString("pt-BR")}</strong><div class="analysis-grid"><div class="analysis-chip">RSSI<strong>${Number.isFinite(rssi)?rssi+" dBm":"Indisponível"}</strong></div><div class="analysis-chip">Qualidade indicativa<strong>${quality}</strong></div><div class="analysis-chip">Frequência<strong>${data.frequencyMhz?data.frequencyMhz+" MHz":"Indisponível"}</strong></div><div class="analysis-chip">Link speed<strong>${data.linkSpeedMbps?data.linkSpeedMbps+" Mbps":"Indisponível"}</strong></div></div><p><strong>SSID:</strong> ${esc(data.ssid||"Oculto pelo Android")} · <strong>BSSID:</strong> ${esc(data.bssid||"Oculto")}</p><p class="micro">RSSI é a intensidade recebida pela interface Wi-Fi do dispositivo. Não representa velocidade da Internet nem qualidade garantida do serviço.</p>`;
 }catch(e){box.textContent="Falha ao consultar a ponte Android: "+(e.message||e);}
}
async function testBasicLatency(){
 const box=$("#wifiSignalResult");box.textContent="Testando resposta HTTPS…";
 const targets=["https://www.google.com/generate_204","https://www.cloudflare.com/cdn-cgi/trace"];
 let elapsed=null,last="";
 for(const url of targets){try{const t0=performance.now();await fetch(url,{mode:"no-cors",cache:"no-store",signal:AbortSignal.timeout(7000)});elapsed=Math.round(performance.now()-t0);break;}catch(e){last=e.message||"Falha";}}
 if(elapsed===null){box.innerHTML=`<strong>Teste inconclusivo.</strong><br>${esc(last)}<p class="micro">Bloqueio CORS, indisponibilidade do destino ou conexão podem impedir a medição. Isso não comprova ausência de Internet.</p>`;return;}
 box.innerHTML=`<strong>Tempo de resposta HTTPS aproximado: ${elapsed} ms</strong><p class="micro">Medição de ida até o destino de teste a partir do navegador; não é ping ICMP, não mede a rota completa e pode variar por DNS, TLS e rede.</p>`;
}
$("#readWifiSignal")?.addEventListener("click",readNativeWifi);
$("#testNetworkQuality")?.addEventListener("click",testBasicLatency);

function tick(){const d=new Date();$("#clock").textContent=d.toLocaleTimeString("pt-BR");}tick();setInterval(tick,1000);
function parseTLE(txt){const lines=txt.trim().split(/\r?\n/);const out=[];for(let i=0;i<lines.length;){if(lines[i].startsWith("1 ")&&lines[i+1]?.startsWith("2 ")){out.push({name:"Objeto "+(out.length+1),l1:lines[i],l2:lines[i+1]});i+=2;continue;}if(i+2<lines.length&&lines[i+1].startsWith("1 ")&&lines[i+2].startsWith("2 ")){out.push({name:lines[i].trim(),l1:lines[i+1],l2:lines[i+2]});i+=3;continue;}i++;}return out;}
async function loadSatellites(){const group=$("#satGroup")?.value||"stations";const btn=$("#loadSatBtn");if(btn){btn.disabled=true;btn.textContent="Consultando…"}try{const r=await fetch(groups[group],{cache:"no-store"});if(!r.ok)throw Error("HTTP "+r.status);const txt=await r.text();const parsed=parseTLE(txt);if(!parsed.length)throw Error("Resposta sem elementos TLE reconhecíveis");state.satellites=parsed;state.source=group;state.lastUpdate=new Date();renderSatellites();$("#metric-count").textContent=parsed.length.toLocaleString("pt-BR");$("#metric-source").textContent="CelesTrak · "+group;$("#last-updated").textContent="Atualizado em "+state.lastUpdate.toLocaleString("pt-BR");$("#status-orbit").textContent="Dados carregados";$("#status-orbit").className="ok";$("#metric-visible").textContent="Calcular";renderFeatured();toast(parsed.length+" registros carregados.");}catch(e){toast("Não foi possível consultar os dados: "+e.message);$("#status-orbit").textContent="Falha na consulta";$("#status-orbit").className="pending";}finally{if(btn){btn.disabled=false;btn.textContent="Carregar satélites"}}}
function renderSatellites(){populateMapSelect();const q=($("#satSearch")?.value||"").toLowerCase();const filtered=state.satellites.filter(s=>s.name.toLowerCase().includes(q));$("#sat-count").textContent=filtered.length+" de "+state.satellites.length+" registros";$("#sat-table").innerHTML=filtered.slice(0,500).map(s=>`<tr><td>${esc(s.name)}</td><td>${esc(s.l1.slice(2,7).trim())}</td><td>Órbita não classificada</td><td><span class="tag tag-green">TLE recebido</span></td></tr>`).join("")||'<tr><td colspan="4" class="empty">Nenhum resultado.</td></tr>';}
function renderFeatured(){$("#featured-list").innerHTML=state.satellites.slice(0,5).map(s=>`<div class="simple-row"><span>${esc(s.name)}</span><small>NORAD ${esc(s.l1.slice(2,7).trim())}</small></div>`).join("")||'<div class="empty">Nenhum dado disponível.</div>'}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
$("#loadSatBtn").addEventListener("click",loadSatellites);$("#refreshBtn").addEventListener("click",()=>{if($("#view-satellites").classList.contains("active"))loadSatellites();else toast("Abra o catálogo orbital para atualizar os dados.")});$("#satSearch").addEventListener("input",renderSatellites);$("#satGroup").addEventListener("change",loadSatellites);
$("#useExample").addEventListener("click",()=>{$("#lat").value="-15.7939";$("#lon").value="-47.8828";$("#alt").value="1172";toast("Coordenadas de exemplo preenchidas.");});
async function calculateVisibility(){
 const lat=parseLocaleNumber($("#lat").value),lon=parseLocaleNumber($("#lon").value),alt=parseLocaleNumber($("#alt").value),min=parseLocaleNumber($("#minElev").value);
 if(!Number.isFinite(lat)||Math.abs(lat)>90||!Number.isFinite(lon)||Math.abs(lon)>180||!Number.isFinite(alt)){toast("Informe latitude, longitude e altitude válidas. Use ponto ou vírgula decimal.");return;}
 if(!state.satellites.length){$("#visibility-result").textContent="Carregando dados orbitais automaticamente…";await loadSatellites();if(!state.satellites.length){$("#visibility-result").textContent="Não foi possível carregar TLE. Verifique a conexão e tente novamente no Catálogo orbital.";return;}}
 if(!window.satellite){$("#visibility-result").textContent="Biblioteca orbital não carregada. Verifique a conexão e recarregue a página.";return;}
 const now=new Date(),obs={longitude:satellite.degreesToRadians(lon),latitude:satellite.degreesToRadians(lat),height:alt/1000},visible=[];
 for(const s of state.satellites){try{
  const rec=satellite.twoline2satrec(s.l1,s.l2),pv=satellite.propagate(rec,now);if(!pv.position)continue;
  const ecf=satellite.eciToEcf(pv.position,satellite.gstime(now)),look=satellite.ecfToLookAngles(obs,ecf);
  const elevation=satellite.radiansToDegrees(look.elevation);
  if(Number.isFinite(elevation)&&elevation>=min)visible.push({name:s.name,norad:s.l1.slice(2,7).trim(),elevation,azimuth:(satellite.radiansToDegrees(look.azimuth)+360)%360,range:look.range});
 }catch(e){}}
 visible.sort((a,b)=>b.elevation-a.elevation);$("#metric-visible").textContent=visible.length;
 $("#visibility-result").innerHTML=`<strong>${visible.length} objeto(s) acima de ${min}°</strong><br><span>Local: ${lat.toFixed(4)}°, ${lon.toFixed(4)}° · ${now.toLocaleString("pt-BR")}</span><br><br>`+
 (visible.slice(0,20).map(v=>`<div class="simple-row"><span>${esc(v.name)} <small>NORAD ${esc(v.norad)}</small></span><small>Elevação ${v.elevation.toFixed(1)}° · Azimute ${v.azimuth.toFixed(1)}° · Distância oblíqua ${v.range.toFixed(0)} km</small></div>`).join("")||"Nenhum objeto da amostra atende ao limite informado.")+
 `<p class="micro">Estimativa geométrica calculada com TLE recebido. Distância oblíqua entre observador e satélite; não é distância ao ponto subsatélite. Não confirma cobertura, sinal RF ou acesso à Internet.</p>`;
}
$("#calcVisibility").addEventListener("click",calculateVisibility);
$("#useExample").addEventListener("click",()=>{$("#lat").value="-15,7939";$("#lon").value="-47,8828";$("#alt").value="1172";toast("Coordenadas de exemplo de Brasília preenchidas.");});


function initOrbitMap(){
 if(state.map || !window.L)return !!state.map;
 const el=$("#orbit-map");if(!el)return false;
 state.map=L.map(el,{worldCopyJump:true}).setView([0,0],2);
 L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:8,attribution:'&copy; OpenStreetMap'}).addTo(state.map);
 state.mapLayer=L.layerGroup().addTo(state.map);setTimeout(()=>state.map.invalidateSize(),120);return true;
}
function populateMapSelect(){
 const sel=$("#mapSatSelect");if(!sel)return;const prior=sel.value;
 sel.innerHTML='<option value="">Todos os objetos carregados</option>'+state.satellites.map((s,i)=>`<option value="${i}">${esc(s.name)}</option>`).join("");
 if(prior&&Number(prior)<state.satellites.length)sel.value=prior;
}
function updateOrbitMap(){
 if(!state.satellites.length){toast("Carregue dados TLE primeiro.");return;}
 if(!window.satellite){toast("Biblioteca orbital indisponível.");return;}
 if(!initOrbitMap()){toast("Biblioteca de mapas indisponível.");return;}
 const selected=$("#mapSatSelect").value,chosen=selected===""?state.satellites:[state.satellites[Number(selected)]].filter(Boolean),now=new Date(),points=[];
 state.mapLayer.clearLayers();
 chosen.forEach(s=>{try{const rec=satellite.twoline2satrec(s.l1,s.l2),pv=satellite.propagate(rec,now);if(!pv.position)return;const gd=satellite.eciToGeodetic(pv.position,satellite.gstime(now)),lat=satellite.degreesLat(gd.latitude),lon=satellite.degreesLong(gd.longitude),alt=gd.height;if(!Number.isFinite(lat)||!Number.isFinite(lon))return;points.push({lat,lon});L.circleMarker([lat,lon],{radius:5,color:"#1e72d8",weight:2,fillColor:"#58a9ff",fillOpacity:.85}).bindPopup(`<strong>${esc(s.name)}</strong><br>Latitude: ${lat.toFixed(2)}°<br>Longitude: ${lon.toFixed(2)}°<br>Altitude estimada: ${alt.toFixed(1)} km<br><small>Ponto subsatélite calculado</small>`).addTo(state.mapLayer);}catch(e){}});
 if(points.length&&selected!=="")state.map.setView([points[0].lat,points[0].lon],3);
 $("#mapTimestamp").textContent=`${points.length} posição(ões) calculada(s) · ${now.toLocaleString("pt-BR")}`;
}
$("#refreshMap")?.addEventListener("click",updateOrbitMap);
$("#mapSatSelect")?.addEventListener("change",updateOrbitMap);
$("#mapRate")?.addEventListener("change",e=>{if(state.mapTimer)clearInterval(state.mapTimer);state.mapTimer=null;const n=Number(e.target.value);if(n>0)state.mapTimer=setInterval(updateOrbitMap,n*1000);});
$("#testSdr")?.addEventListener("click",async()=>{
 const base=$("#sdrUrl").value.trim().replace(/\/+$/,""),path=$("#sdrHealthPath").value.trim();
 if(!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/i.test(base)){toast("Por segurança, use localhost ou 127.0.0.1.");return;}
 if(!path.startsWith("/")||path.startsWith("//")){toast("Endpoint inválido.");return;}
 const out=$("#sdr-result");out.textContent="Consultando ponte local…";
 try{const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),3500),r=await fetch(base+path,{method:"GET",headers:{Accept:"application/json"},cache:"no-store",signal:ctl.signal});clearTimeout(timer);if(!r.ok)throw Error("HTTP "+r.status);const data=await r.json();out.textContent="Resposta recebida: "+JSON.stringify(data,null,2);toast("Ponte respondeu; recepção RF não comprovada.");}
 catch(e){out.textContent="Falha na consulta: "+e.message+". Verifique serviço, CORS e políticas do navegador.";toast("Ponte SDR não encontrada ou bloqueada.");}
});
$("#clearSdr")?.addEventListener("click",()=>$("#sdr-result").textContent="Nenhuma consulta realizada.");


const PROJECT_KEY="ils-v2-project";
function readProject(){try{return JSON.parse(localStorage.getItem(PROJECT_KEY)||"null")}catch{return null}}
function getProjectForm(){
 return {model:$("#f-model").value,source:$("#f-source").value,terminal:$("#f-terminal").value,power:$("#f-power").value,permission:$("#f-permission").value,users:Math.max(1,Number($("#f-users").value)||1),location:$("#f-location").value.trim(),equipment:$("#f-equipment").value.trim(),evidence:$("#f-evidence").value.trim(),updatedAt:new Date().toISOString()};
}
function evaluateProject(p){
 const checks=[
  {key:"source",label:"Fonte de conectividade",ok:["free-authorized","paid-authorized"].includes(p.source),block:p.source==="none",detail:p.source==="free-authorized"?"Serviço gratuito autorizado informado":p.source==="paid-authorized"?"Serviço pago autorizado informado":"Identificar uma fonte bidirecional de Internet"},
  {key:"permission",label:"Autorização / elegibilidade",ok:p.permission==="yes",block:p.permission==="no",detail:p.permission==="yes"?"Confirmação informada":p.permission==="no"?"Acesso não autorizado ou não elegível":"Obter confirmação formal do provedor ou programa"},
  {key:"terminal",label:"Terminal compatível",ok:p.terminal==="yes",block:p.terminal==="no",detail:p.terminal==="yes"?"Compatibilidade informada":"Confirmar terminal homologado e compatível"},
  {key:"power",label:"Energia",ok:p.power==="yes",block:p.power==="no",detail:p.power==="yes"?"Energia informada como disponível":"Confirmar alimentação elétrica e autonomia"}
 ];
 const blocked=checks.some(c=>c.block),ready=checks.every(c=>c.ok);
 const status=blocked?"Não viável nas condições informadas":ready?"Preparada para piloto técnico":"Viabilidade condicional — pendências abertas";
 return {checks,status,ready,blocked,pending:checks.filter(c=>!c.ok),p};
}
function renderFeasibility(result){
 const color=result.ready?"ok":"warn";
 $("#feasibility-result").innerHTML=`<strong>${esc(result.status)}</strong><div class="feasibility-summary"><div class="feasibility-chip">Requisitos confirmados<strong>${result.checks.filter(c=>c.ok).length} / 4</strong></div><div class="feasibility-chip">Pendências<strong>${result.pending.length}</strong></div><div class="feasibility-chip">Usuários estimados<strong>${result.p.users}</strong></div></div><div class="status-list">${result.checks.map(c=>`<div><span>${esc(c.label)}</span><b class="${c.ok?"ok":"pending"}">${c.ok?"Informado como confirmado":c.block?"Bloqueio":"Pendente"}</b></div>`).join("")}</div><p class="micro">Local: ${esc(result.p.location||"Não informado")} · Modelo: ${esc(result.p.model)}. A classificação depende exclusivamente das respostas fornecidas e não constitui confirmação externa.</p>`;
}
function saveProject(){
 const p=getProjectForm(),r=evaluateProject(p);
 localStorage.setItem(PROJECT_KEY,JSON.stringify({project:p,evaluation:r}));
 renderFeasibility(r);renderRoadmap();toast("Avaliação salva neste dispositivo.");
}
$("#runFeasibility")?.addEventListener("click",()=>renderFeasibility(evaluateProject(getProjectForm())));
$("#saveProject")?.addEventListener("click",saveProject);
function renderRoadmap(){
 const saved=readProject(),box=$("#roadmap-content");if(!saved){box.innerHTML='<div class="empty">Nenhuma avaliação salva. Vá em Viabilidade e salve uma análise.</div>';return;}
 const r=evaluateProject(saved.project),steps=[
  ["Documentar necessidade e local","Confirmar localidade, quantidade de usuários, uso pretendido e responsável pelo ponto."],
  ["Identificar fonte autorizada","Consultar programa público ou provedor e obter confirmação de cobertura, elegibilidade, custo e condições."],
  ["Validar equipamento","Confirmar modelo do terminal, homologação aplicável, compatibilidade de rede e requisitos de instalação."],
  ["Validar infraestrutura","Verificar energia, fixação, visada desobstruída, aterramento e proteção contra intempéries com profissional habilitado."],
  ["Executar piloto controlado","Com autorização e equipamento correto, testar navegação, DNS, latência, estabilidade e envio/recebimento de dados."],
  ["Planejar compartilhamento","Se permitido pelo contrato, dimensionar Wi-Fi, segurança, capacidade, suporte e política de uso."]
 ];
 box.innerHTML=steps.map((s,i)=>`<article class="roadmap-step"><div class="roadmap-number">${i+1}</div><div><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p></div></article>`).join("")+`<div class="notice"><strong>Estado atual</strong><span>${esc(r.status)}. Pendências abertas: ${r.pending.map(x=>esc(x.label)).join(", ")||"nenhuma na triagem informada"}. A execução física continua sujeita a confirmação documental e teste de campo.</span></div>`;
}
$("#refreshRoadmap")?.addEventListener("click",renderRoadmap);
function downloadFile(name,content,type){
 const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
$("#exportJson")?.addEventListener("click",()=>{
 const saved=readProject(),payload={product:"ILS",version:"4.2",generatedAt:new Date().toISOString(),savedProject:saved,localOpportunities:state.opportunities,limitations:["Relatório não comprova cobertura nem acesso gratuito","Dados fornecidos pelo usuário não foram verificados externamente","Nenhum teste físico satelital é executado pelo relatório"]};
 downloadFile("ils-relatorio-v4.json",JSON.stringify(payload,null,2),"application/json");
});
$("#exportCsv")?.addEventListener("click",()=>{
 const saved=readProject();if(!saved){toast("Salve primeiro uma avaliação de viabilidade.");return;}
 const r=evaluateProject(saved.project),rows=[["Requisito","Situação","Detalhe"],...r.checks.map(c=>[c.label,c.ok?"Confirmado":c.block?"Bloqueio":"Pendente",c.detail])];
 const csv=rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(";")).join("\r\n");
 downloadFile("ils-checklist-v4.csv","\uFEFF"+csv,"text/csv;charset=utf-8");
});
$("#showValidation")?.addEventListener("click",()=>{
 $("#validation-report").innerHTML=`<h3>Quadro de validação ILS 5.1</h3><table class="report-table"><tbody>
 <tr><td>Interface PWA e navegação</td><td>Implementada; validar em hospedagem</td></tr>
 <tr><td>Catálogo TLE CelesTrak</td><td>Consulta externa; teste ao vivo pendente</td></tr>
 <tr><td>Mapa e propagação orbital</td><td>Estimativa implementada; comparação independente pendente</td></tr>
 <tr><td>Motor de triagem de viabilidade</td><td>Executável localmente com dados informados</td></tr>
 <tr><td>Plano de implantação</td><td>Gerado a partir das pendências</td></tr>
 <tr><td>Exportação JSON / CSV</td><td>Implementada; teste em dispositivo pendente</td></tr>
 <tr><td>Recepção RF / SDR real</td><td>Não implementada; ponte experimental apenas</td></tr>
 <tr><td>Internet gratuita por satélite</td><td>Não comprovada; depende de rede e autorização externas</td></tr>
 </tbody></table>`;
});
const priorProject=readProject();
if(priorProject?.project){
 const p=priorProject.project;
 for(const [id,val] of Object.entries({"#f-model":p.model,"#f-source":p.source,"#f-terminal":p.terminal,"#f-power":p.power,"#f-permission":p.permission,"#f-users":p.users,"#f-location":p.location,"#f-equipment":p.equipment,"#f-evidence":p.evidence})){const el=$(id);if(el)el.value=val;}
 renderFeasibility(evaluateProject(p));
}


const ILS_BACKUP_VERSION=1;
function localBackupPayload(){
 return {format:"ils-local-backup",backupVersion:ILS_BACKUP_VERSION,applicationVersion:"4.1",createdAt:new Date().toISOString(),
  project:readProject(),opportunities:Array.isArray(state.opportunities)?state.opportunities:[]};
}
function refreshDataSummary(){
 const p=readProject(),o=(()=>{try{const x=JSON.parse(localStorage.getItem("ils-opportunities")||"[]");return Array.isArray(x)?x:[]}catch{return []}})();
 const bytes=new Blob([JSON.stringify({p,o})]).size;
 const el=$("#localDataSummary");if(el)el.textContent=`Avaliação: ${p?"salva":"não salva"} · Oportunidades: ${o.length} · Tamanho aproximado: ${(bytes/1024).toFixed(1)} KB`;
}
$("#backupExport")?.addEventListener("click",()=>{
 try{const data=localBackupPayload();downloadFile(`ils-backup-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(data,null,2),"application/json");toast("Backup preparado para download.");}
 catch(e){toast("Não foi possível gerar o backup: "+e.message);}
});
$("#backupImport")?.addEventListener("click",()=>$("#backupFile")?.click());
$("#backupFile")?.addEventListener("change",async e=>{
 const file=e.target.files?.[0];if(!file)return;
 try{
  if(file.size>2*1024*1024)throw Error("Arquivo maior que 2 MB.");
  const data=JSON.parse(await file.text());
  if(data.format!=="ils-local-backup"||data.backupVersion!==ILS_BACKUP_VERSION)throw Error("Formato ou versão de backup não reconhecido.");
  if(data.project!==null&&data.project!==undefined&&typeof data.project!=="object")throw Error("Campo de avaliação inválido.");
  if(!Array.isArray(data.opportunities)||data.opportunities.length>1000)throw Error("Lista de oportunidades inválida.");
  const safeOpps=data.opportunities.map(o=>{
   if(!o||typeof o.name!=="string"||o.name.length>300||typeof (o.url||"")!=="string"||typeof (o.notes||"")!=="string")throw Error("Registro de oportunidade inválido.");
   return {name:o.name.slice(0,300),url:(o.url||"").slice(0,2000),notes:(o.notes||"").slice(0,5000),date:typeof o.date==="string"?o.date:""};
  });
  if(!confirm("Restaurar este backup? A avaliação e as oportunidades atuais serão substituídas."))return;
  if(data.project===null)localStorage.removeItem(PROJECT_KEY);else localStorage.setItem(PROJECT_KEY,JSON.stringify(data.project));
  localStorage.setItem("ils-opportunities",JSON.stringify(safeOpps));
  state.opportunities=safeOpps;renderOpps();refreshDataSummary();renderRoadmap();
  toast("Backup restaurado neste dispositivo.");
 }catch(err){alert("Não foi possível restaurar o backup: "+err.message);}
 finally{e.target.value="";}
});
$("#refreshDataSummary")?.addEventListener("click",refreshDataSummary);
$("#clearLocalData")?.addEventListener("click",()=>{
 if(!confirm("Tem certeza? A avaliação e as oportunidades locais serão apagadas. Faça backup antes, se necessário."))return;
 localStorage.removeItem(PROJECT_KEY);localStorage.removeItem("ils-opportunities");state.opportunities=[];
 renderOpps();refreshDataSummary();renderRoadmap();toast("Dados locais do ILS apagados.");
});


const OFFICIAL_OPPORTUNITIES=[
 {id:"gesac-livre",name:"Wi-Fi Brasil Livre (GESAC Livre)",type:["public","satellite"],access:"Acesso público gratuito",technology:"Conectividade satelital no programa; Wi-Fi no ponto público",who:"População em geral, quando existe ponto público instalado e em operação.",how:"Localizar um ponto participante, confirmar endereço, funcionamento e regras locais. Não é uma ligação residencial individual.",status:"Programa oficial; disponibilidade depende do ponto instalado.",url:"https://www.gov.br/pt-br/servicos/obter-conexao-de-internet-programa-wi-fi-brasil",source:"Ministério das Comunicações — serviço GESAC / Wi-Fi Brasil"},
 {id:"gesac-ponto",name:"Wi-Fi Brasil GESAC — Ponto de Internet",type:["institutional","satellite"],access:"Atendimento institucional / comunitário",technology:"Banda larga satelital em pontos elegíveis",who:"Instituições públicas, escolas, bibliotecas, telecentros, unidades de saúde e comunidades elegíveis, conforme critérios do programa.",how:"A entidade responsável deve verificar elegibilidade e encaminhar a solicitação pelo serviço oficial.",status:"Não é cadastro individual para instalar Internet em residência.",url:"https://www.gov.br/pt-br/servicos/obter-conexao-de-internet-programa-wi-fi-brasil",source:"Ministério das Comunicações — serviço GESAC / Wi-Fi Brasil"},
 {id:"internet-brasil",name:"Programa Internet Brasil",type:["individual"],access:"Benefício individual condicionado",technology:"Banda larga móvel por chip / eSIM; não é Internet via satélite",who:"Estudantes da educação básica pública de famílias inscritas no CadÚnico, em escolas e localidades contempladas e conforme seleção do programa.",how:"Consultar a escola participante e os canais oficiais do programa para confirmar critérios e disponibilidade.",status:"Não é benefício universal para qualquer pessoa; a abrangência depende da implementação e seleção.",url:"https://rnp.br/programas-e-projetos/internet-brasil/",source:"RNP — Programa Internet Brasil"},
 {id:"enec",name:"Estratégia Nacional de Escolas Conectadas",type:["institutional"],access:"Conectividade institucional escolar",technology:"Soluções terrestres e satelitais conforme necessidade e contratação",who:"Escolas públicas de educação básica e suas redes de ensino.",how:"A direção escolar ou secretaria de educação deve consultar a situação da escola e os canais da política pública.",status:"Conectividade para uso pedagógico e administrativo; não equivale a Wi-Fi público residencial.",url:"https://www.gov.br/mec/pt-br/escolas-conectadas",source:"Ministério da Educação — Escolas Conectadas"},
 {id:"comunidades-conectadas",name:"Comunidades Conectadas",type:["institutional","satellite"],access:"Projeto público para localidades desatendidas",technology:"Solução transportável com backhaul satelital e acesso LTE 4G",who:"Localidades sem cobertura móvel, mediante implantação e seleção institucional.",how:"A articulação deve ocorrer por órgãos públicos e responsáveis locais; não é contratação individual automática.",status:"Projeto de implantação pública; verificar editais, localidades contempladas e fase vigente.",url:"https://www.gov.br/mcom/pt-br/assuntos",source:"Ministério das Comunicações — cartilha de programas"},
 {id:"anatel-satelite",name:"Consulta de satélites e serviços autorizados",type:["satellite"],access:"Ferramenta de verificação regulatória",technology:"Informação regulatória sobre satélites e estações terrenas",who:"Usuários, instituições e responsáveis técnicos que precisam validar a operação de serviços satelitais.",how:"Consultar satélites autorizados e requisitos de licenciamento antes de adquirir ou operar equipamentos.",status:"Não fornece Internet gratuita; ajuda a verificar a legalidade e a autorização do serviço.",url:"https://www.gov.br/anatel/pt-br/regulado/satelite",source:"Anatel — Satélite"}
];
function renderOpportunityCatalog(){
 const q=($("#oppSearch")?.value||"").trim().toLocaleLowerCase("pt-BR"),filter=$("#oppFilter")?.value||"all",box=$("#opportunity-results");
 if(!box)return;
 const rows=OFFICIAL_OPPORTUNITIES.filter(o=>(filter==="all"||o.type.includes(filter))&&(!q||[o.name,o.access,o.technology,o.who,o.how,o.status,o.source].join(" ").toLocaleLowerCase("pt-BR").includes(q)));
 box.innerHTML=rows.length?rows.map(o=>`<article class="opportunity-card"><div class="opp-meta">${o.type.map(t=>`<span class="opp-tag">${({public:"Público",individual:"Individual elegível",institutional:"Institucional",satellite:"Satélite"})[t]}</span>`).join("")}</div><h3>${esc(o.name)}</h3><p><strong>Modalidade:</strong> ${esc(o.access)}</p><p><strong>Tecnologia:</strong> ${esc(o.technology)}</p><p><strong>Quem pode utilizar:</strong> ${esc(o.who)}</p><p><strong>Como avançar:</strong> ${esc(o.how)}</p><p><strong>Limite / situação:</strong> ${esc(o.status)}</p><p class="micro">${esc(o.source)}</p><div class="opp-action"><a href="${o.url}" target="_blank" rel="noopener noreferrer">Consultar fonte oficial ↗</a></div></article>`).join(""):'<div class="empty">Nenhuma oportunidade corresponde aos filtros. Tente outro termo ou selecione “Todas as oportunidades”.</div>';
}
$("#filterOpps")?.addEventListener("click",renderOpportunityCatalog);
$("#clearOppFilters")?.addEventListener("click",()=>{$("#oppSearch").value="";$("#oppFilter").value="all";$("#oppLocation").value="";renderOpportunityCatalog();});
$("#oppSearch")?.addEventListener("keydown",e=>{if(e.key==="Enter")renderOpportunityCatalog();});

function loadOpps(){try{state.opportunities=JSON.parse(localStorage.getItem("ils-opportunities")||"[]")}catch{state.opportunities=[]}renderOpps()}
function renderOpps(){$("#saved-opps").innerHTML=state.opportunities.map(o=>`<div class="saved-item"><strong>${esc(o.name)}</strong> — ${esc(o.notes||"Sem observações")} ${o.url?`<a href="${esc(o.url)}" target="_blank" rel="noopener">Abrir ↗</a>`:""}</div>`).join("")}
$("#saveOpp").addEventListener("click",()=>{const name=$("#oppName").value.trim(),url=$("#oppUrl").value.trim(),notes=$("#oppNotes").value.trim();if(!name){toast("Informe o nome da oportunidade.");return;}if(url&&!/^https?:\/\//i.test(url)){toast("Informe uma URL iniciada por https:// ou http://");return;}state.opportunities.push({name,url,notes,date:new Date().toISOString()});localStorage.setItem("ils-opportunities",JSON.stringify(state.opportunities));$("#oppName").value=$("#oppUrl").value=$("#oppNotes").value="";renderOpps();toast("Oportunidade salva neste dispositivo.");});
$("#checkAccess").addEventListener("click",()=>{toast("Consulte as fontes oficiais e confirme critérios, localidade e disponibilidade com o órgão responsável.")});
$("#runDiag").addEventListener("click",async()=>{const box=$("#diag-results");box.innerHTML='<div class="empty">Executando verificações…</div>';const items=[["Aplicação carregada","ok","Interface executada neste navegador"],["Armazenamento local",(()=>{try{localStorage.setItem("ils-test","1");localStorage.removeItem("ils-test");return"ok"}catch{return"warn"}})(),"Armazenamento do navegador"],["Conexão de rede",navigator.onLine?"ok":"warn",navigator.onLine?"Navegador informa conexão disponível":"Navegador informa modo offline"],["Biblioteca orbital",window.satellite?"ok":"warn",window.satellite?"satellite.js disponível":"satellite.js indisponível; cálculos orbitais desativados"],["Dados TLE",state.satellites.length?"ok":"warn",state.satellites.length?state.satellites.length+" registros carregados":"Nenhum TLE carregado"],["Receptor SDR","warn","Nenhum receptor físico integrado"],["Internet via satélite","warn","Não testada; requer terminal e serviço autorizados"]];let reach="warn",detail="Não testado";try{const c=new AbortController(),t=setTimeout(()=>c.abort(),5000);const r=await fetch("https://www.google.com/generate_204",{mode:"no-cors",signal:c.signal,cache:"no-store"});clearTimeout(t);reach="ok";detail="Requisição de teste iniciada; resposta opaca do navegador";}catch{detail="Destino de teste inacessível ou bloqueado; isso não prova ausência total de Internet";}items.splice(2,0,["Acesso a destino HTTPS",reach,detail]);box.innerHTML=items.map(([n,s,d])=>`<div class="diag-item"><span><strong>${esc(n)}</strong><br><small class="muted">${esc(d)}</small></span><b class="${s==="warn"?"warn":""}">${s==="ok"?"Verificado":"Pendente"}</b></div>`).join("");});
loadOpps();if("serviceWorker"in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});

document.addEventListener("click",e=>{
 const target=e.target.closest("[data-goto]");
 if(target){e.preventDefault();setView(target.dataset.goto);}
});


// ILS 5.1 — localizador de pontos de Wi-Fi mapeados no OpenStreetMap.
state.locMap=null;state.locMarkers=null;state.locUserMarker=null;
function initLocatorMap(){
 if(state.locMap)return true;
 const el=document.getElementById("locator-map");
 if(!el||!window.L){const s=document.getElementById("locStatus");if(s)s.textContent="Biblioteca de mapas indisponível. Verifique a conexão e recarregue a página.";return false;}
 state.locMap=L.map(el,{scrollWheelZoom:false}).setView([-14.2,-51.9],4);
 L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'}).addTo(state.locMap);
 state.locMarkers=L.layerGroup().addTo(state.locMap);
 setTimeout(()=>state.locMap.invalidateSize(),150);return true;
}
function validLocatorCoords(lat,lon){return Number.isFinite(lat)&&lat>=-90&&lat<=90&&Number.isFinite(lon)&&lon>=-180&&lon<=180;}
function setLocatorCoords(lat,lon,origin){document.getElementById("locLat").value=Number(lat).toFixed(6);document.getElementById("locLon").value=Number(lon).toFixed(6);document.getElementById("locOrigin").value=origin||"manual";}
function useDeviceLocation(){const status=document.getElementById("locStatus");if(!navigator.geolocation){status.textContent="Este navegador não disponibiliza geolocalização.";return;}status.textContent="Solicitando permissão de localização ao dispositivo…";navigator.geolocation.getCurrentPosition(pos=>{setLocatorCoords(pos.coords.latitude,pos.coords.longitude,"device");status.textContent=`Localização recebida (precisão informada pelo dispositivo: ${Math.round(pos.coords.accuracy)} m). Toque em Pesquisar pontos próximos para consultar o mapa.`;if(initLocatorMap()){state.locMap.setView([pos.coords.latitude,pos.coords.longitude],14);}},err=>{const msg={1:"Permissão de localização negada. Você pode informar coordenadas manualmente.",2:"Não foi possível determinar a localização. Tente novamente ou informe coordenadas.",3:"A solicitação de localização expirou. Tente novamente."};status.textContent=msg[err.code]||"Falha ao obter localização.";},{enableHighAccuracy:false,timeout:12000,maximumAge:60000});}
function renderLocatorResults(elements,lat,lon){
 const box=document.getElementById("locResults");
 if(!elements.length){box.innerHTML='<div class="empty">Nenhum ponto com Wi-Fi explicitamente mapeado foi encontrado neste raio. Isso não significa que não existam pontos; tente ampliar o raio ou consultar fontes locais.</div>';return;}
 const ranked=elements.map(el=>{
  const t=el.tags||{},la=el.lat??el.center?.lat,lo=el.lon??el.center?.lon;
  return {...el,_distance:haversineMeters(lat,lon,la,lo)};
 }).sort((a,b)=>a._distance-b._distance);
 box.innerHTML=ranked.map(el=>{
  const t=el.tags||{},name=t.name||t.operator||"Ponto de Wi-Fi sem nome informado",kind=t.amenity||t.shop||t.tourism||t.leisure||"Local de acesso",access=t.internet_access||"wifi (tag mapeada)",la=el.lat??el.center?.lat,lo=el.lon??el.center?.lon,addr=[t["addr:street"],t["addr:housenumber"],t["addr:suburb"],t["addr:city"]].filter(Boolean).join(", "),maps=`https://www.openstreetmap.org/?mlat=${la}&mlon=${lo}#map=18/${la}/${lo}`,route=`https://www.google.com/maps/dir/?api=1&destination=${la},${lo}`;
  return `<article class="locator-result"><span class="tag tag-green">Wi-Fi mapeado · não verificado em campo</span><h3>${esc(name)}</h3><p><strong>Distância em linha reta:</strong> ${formatDistance(el._distance)}</p><p><strong>Tipo:</strong> ${esc(kind)} · <strong>Tag:</strong> ${esc(access)}</p><p>${esc(addr||"Endereço não informado no mapa")}</p><p class="micro">Registro OpenStreetMap #${esc(el.id)} · Coordenadas ${Number(la).toFixed(5)}, ${Number(lo).toFixed(5)}</p><a href="${maps}" target="_blank" rel="noopener noreferrer">Ver no OpenStreetMap ↗</a> · <a href="${route}" target="_blank" rel="noopener noreferrer">Rotas ↗</a></article>`;
 }).join("");
}
async function searchNearbyWifi(){
 const lat=parseLocaleNumber(document.getElementById("locLat").value),lon=parseLocaleNumber(document.getElementById("locLon").value),radius=Number(document.getElementById("locRadius").value),status=document.getElementById("locStatus"),btn=document.getElementById("locSearch");
 if(!validLocatorCoords(lat,lon)){status.textContent="Informe latitude entre -90 e 90 e longitude entre -180 e 180, ou use a localização do dispositivo.";return;}
 if(!navigator.onLine){status.textContent="Pesquisa online indisponível no modo offline. As coordenadas permanecem no formulário; conecte-se à Internet para consultar o mapa.";return;}
 if(!initLocatorMap())return;
 btn.disabled=true;btn.textContent="Pesquisando…";status.textContent="Consultando registros públicos do OpenStreetMap. Aguarde…";
 const query=`[out:json][timeout:25];(node(around:${radius},${lat},${lon})["internet_access"~"^(wlan|wifi|yes)$",i];way(around:${radius},${lat},${lon})["internet_access"~"^(wlan|wifi|yes)$",i];relation(around:${radius},${lat},${lon})["internet_access"~"^(wlan|wifi|yes)$",i];);out center tags;`;
 const endpoints=["https://overpass-api.de/api/interpreter","https://overpass.kumi.systems/api/interpreter"];
 let data=null,lastError="Serviço de mapas indisponível.";
 try{for(const endpoint of endpoints){try{const response=await fetch(endpoint+"?data="+encodeURIComponent(query),{signal:AbortSignal.timeout(30000),headers:{Accept:"application/json"}});if(!response.ok)throw new Error("HTTP "+response.status);data=await response.json();break;}catch(e){lastError=e.message||lastError;}}if(!data)throw new Error(lastError);
 const elements=(data.elements||[]).filter(el=>Number.isFinite(el.lat??el.center?.lat)&&Number.isFinite(el.lon??el.center?.lon));
 state.locMarkers.clearLayers();if(state.locUserMarker)state.locMap.removeLayer(state.locUserMarker);state.locUserMarker=L.marker([lat,lon]).addTo(state.locMap).bindPopup("Local de pesquisa");
 elements.forEach(el=>{const la=el.lat??el.center.lat,lo=el.lon??el.center.lon,t=el.tags||{},title=t.name||t.operator||"Wi-Fi mapeado";L.marker([la,lo]).addTo(state.locMarkers).bindPopup(`<strong>${esc(title)}</strong><br>Wi-Fi registrado no OpenStreetMap<br><small>Confirme funcionamento no local.</small>`);});
 state.locMap.setView([lat,lon],Math.max(10,Math.min(15,Math.round(15-Math.log2(radius/1000)))));if(elements.length){const group=L.featureGroup([state.locUserMarker,...state.locMarkers.getLayers()]);state.locMap.fitBounds(group.getBounds().pad(.18),{maxZoom:15});}
 document.getElementById("locCount").textContent=elements.length+" registro(s)";document.getElementById("locResultTitle").textContent="Pontos encontrados no raio de "+(radius/1000)+" km";renderLocatorResults(elements,lat,lon);
 status.textContent=elements.length?"Pesquisa concluída. Os registros são colaborativos e precisam de confirmação local.":"Consulta concluída sem registros de Wi-Fi explícitos neste raio.";
 }catch(e){status.textContent="Não foi possível concluir a consulta: "+(e.message||"erro de rede")+". Tente novamente mais tarde ou use o OpenStreetMap diretamente.";document.getElementById("locResults").innerHTML='<div class="empty">Falha na consulta online. Nenhum resultado foi inventado ou presumido.</div>';}
 finally{btn.disabled=false;btn.textContent="Pesquisar pontos próximos";}
}
document.getElementById("locUseGps")?.addEventListener("click",useDeviceLocation);
document.getElementById("locSearch")?.addEventListener("click",searchNearbyWifi);
document.getElementById("locBrasilia")?.addEventListener("click",()=>{setLocatorCoords(-15.7939,-47.8828,"example");if(initLocatorMap())state.locMap.setView([-15.7939,-47.8828],12);document.getElementById("locStatus").textContent="Coordenadas de exemplo de Brasília preenchidas; não representam sua localização atual.";});


// ILS 5.1 — registros locais de necessidades de conectividade.
const CASE_KEY="ils-v4-connectivity-cases";
let currentCaseAnalysis=null;
function readCases(){try{const v=JSON.parse(localStorage.getItem(CASE_KEY)||"[]");return Array.isArray(v)?v:[]}catch{return[]}}
function saveCases(items){try{localStorage.setItem(CASE_KEY,JSON.stringify(items));return true;}catch(err){console.error("ILS: falha ao salvar registros locais",err);return false;}}
function getCaseForm(){
 const val=id=>(document.getElementById(id)?.value||"").trim();
 return {name:val("caseName"),type:val("caseType"),city:val("caseCity"),uf:val("caseUF"),users:Number(val("caseUsers")||0),current:val("caseCurrent"),power:val("casePower"),sky:val("caseSky"),need:val("caseNeed"),evidence:val("caseEvidence"),owner:val("caseOwner"),contact:val("caseContact"),createdAt:new Date().toISOString()};
}
function analyzeCase(c){
 const pending=[];
 if(!c.city||!c.uf)pending.push("Município e UF precisam ser informados.");
 if(!c.users||c.users<1)pending.push("Quantidade estimada de pessoas precisa ser informada.");
 if(c.current==="Não avaliado")pending.push("A condição atual da conectividade precisa ser verificada.");
 if(c.power==="Não verificado")pending.push("Disponibilidade de energia precisa ser verificada.");
 if(c.sky==="Não verificado"||c.sky==="Não se aplica / desconhecido")pending.push("Condições físicas do local precisam ser avaliadas por responsável técnico.");
 if(!c.need)pending.push("Descreva a necessidade e o uso pretendido.");
 const blocked=[];
 if(c.power==="Não")blocked.push("Não há energia elétrica confirmada; avaliar solução de energia antes de selecionar equipamento.");
 if(c.sky==="Obstruída")blocked.push("A visada informada está obstruída; requer avaliação técnica e possível alternativa de instalação.");
 const noAccess=c.current==="Sem acesso à Internet";
 const status=blocked.length?"Há impedimentos técnicos informados":pending.length?"Levantamento incompleto — requer validação":"Cadastro preliminar completo — requer confirmação externa";
 const recommendations=[];
 if(noAccess)recommendations.push("Investigar pontos públicos existentes e programas de inclusão digital na localidade.");
 if(c.type==="Escola pública"||c.type==="Unidade de saúde"||c.type==="Biblioteca / telecentro"||c.type==="Órgão público")recommendations.push("Consultar a secretaria ou órgão gestor e verificar elegibilidade em programas institucionais de conectividade.");
 recommendations.push("Comparar alternativas terrestres, móveis e satelitais autorizadas, considerando cobertura, custo total, capacidade e suporte.");
 recommendations.push("Solicitar confirmação escrita de disponibilidade, elegibilidade, condições comerciais e eventuais custos de instalação.");
 recommendations.push("Se houver instalação, realizar piloto autorizado e medir velocidade, latência, estabilidade e capacidade com usuários representativos.");
 return {status,pending,blocked,recommendations,disclaimer:"Esta análise organiza dados informados e não comprova cobertura, gratuidade, elegibilidade, aprovação ou viabilidade de instalação."};
}
function renderCaseAnalysis(c,a){
 const box=document.getElementById("caseAnalysis");
 box.innerHTML=`<strong>${esc(a.status)}</strong><div class="analysis-grid"><div class="analysis-chip">Público estimado<strong>${c.users||"Não informado"}</strong></div><div class="analysis-chip">Pendências<strong>${a.pending.length}</strong></div><div class="analysis-chip">Impedimentos informados<strong>${a.blocked.length}</strong></div></div>${a.blocked.length?`<p><strong>Impedimentos</strong><br>${a.blocked.map(esc).join("<br>")}</p>`:""}${a.pending.length?`<p><strong>Pendências para validação</strong><br>${a.pending.map(esc).join("<br>")}</p>`:""}<p><strong>Próximas ações recomendadas</strong><br>${a.recommendations.map((x,i)=>(i+1)+". "+esc(x)).join("<br>")}</p><p class="micro">${esc(a.disclaimer)}</p>`;
}
function renderCases(){
 const items=readCases(),box=document.getElementById("caseList"),count=document.getElementById("caseCount");
 if(count)count.textContent=items.length+" registro(s)";
 if(!box)return;
 if(!items.length){box.innerHTML='<div class="empty">Nenhum caso registrado neste dispositivo.</div>';return;}
 box.innerHTML=items.slice().reverse().map(c=>`<article class="case-card"><div class="case-meta"><span>${esc(c.type)}</span><span>${esc([c.city,c.uf].filter(Boolean).join(" / ")||"Local não informado")}</span><span>${new Date(c.createdAt).toLocaleDateString("pt-BR")}</span></div><h3>${esc(c.name||"Necessidade sem título")}</h3><p><strong>Condição:</strong> ${esc(c.current)} · <strong>Público:</strong> ${c.users||"Não informado"}</p><p>${esc(c.need||"Sem descrição")}</p><div class="case-actions"><button type="button" data-case-open="${esc(c.id)}">Ver relatório</button><button type="button" data-case-delete="${esc(c.id)}">Excluir registro</button></div></article>`).join("");
}
document.getElementById("caseGenerate")?.addEventListener("click",()=>{
 const c=getCaseForm();
 if(!c.name||!c.city||!c.uf||!c.need){document.getElementById("caseAnalysis").textContent="Preencha pelo menos o nome do local, município, UF e necessidade principal.";return;}
 if(c.users<0||c.users>1000000){document.getElementById("caseAnalysis").textContent="Informe uma quantidade válida de pessoas.";return;}
 const a=analyzeCase(c);currentCaseAnalysis={case:c,analysis:a};
 const items=readCases();c.id="case-"+Date.now();items.push(c);if(!saveCases(items)){document.getElementById("caseAnalysis").textContent="Não foi possível salvar neste navegador. Verifique o espaço disponível e as permissões de armazenamento. A análise foi calculada, mas não foi persistida.";renderCaseAnalysis(c,a);return;}renderCaseAnalysis(c,a);renderCases();
 toast("Análise preliminar registrada apenas neste dispositivo.");
});
document.getElementById("caseClear")?.addEventListener("click",()=>{
 ["caseName","caseCity","caseUsers","caseNeed","caseEvidence","caseOwner","caseContact"].forEach(id=>{const e=document.getElementById(id);if(e)e.value=""});
 ["caseType","caseCurrent","casePower","caseSky","caseUF"].forEach(id=>{const e=document.getElementById(id);if(e)e.selectedIndex=0});
 document.getElementById("caseAnalysis").textContent="Formulário limpo. Nenhum registro salvo foi apagado.";
});
document.getElementById("caseRefresh")?.addEventListener("click",renderCases);
document.getElementById("caseExport")?.addEventListener("click",()=>{
 const items=readCases();if(!items.length){toast("Não há registros para exportar.");return;}
 downloadFile("ils-4.2-relatorios-conectividade.json",JSON.stringify({application:"ILS",version:"4.2",exportedAt:new Date().toISOString(),records:items.map(c=>({case:c,analysis:analyzeCase(c)})),limitations:["Informações declaradas pelo usuário não foram verificadas","Não há confirmação automática de cobertura ou elegibilidade","Relatório é triagem preliminar e não substitui avaliação técnica"]},null,2),"application/json");
});
document.getElementById("casePrint")?.addEventListener("click",()=>{
 const items=readCases();if(!items.length){toast("Não há registros para imprimir.");return;}
 const box=document.getElementById("caseList");
 const old=box.innerHTML;
 box.innerHTML=items.slice().reverse().map(c=>{const a=analyzeCase(c);return `<article class="case-card"><h3>${esc(c.name)}</h3><p><strong>Local:</strong> ${esc(c.city)} / ${esc(c.uf)} · <strong>Tipo:</strong> ${esc(c.type)}</p><p><strong>Público estimado:</strong> ${c.users||"Não informado"} · <strong>Condição:</strong> ${esc(c.current)}</p><p><strong>Necessidade:</strong> ${esc(c.need)}</p><p><strong>Energia:</strong> ${esc(c.power)} · <strong>Visada:</strong> ${esc(c.sky)}</p><p><strong>Análise:</strong> ${esc(a.status)}</p><p><strong>Pendências:</strong> ${a.pending.map(esc).join("; ")||"Nenhuma pendência cadastral"}</p><p><strong>Próximas ações:</strong> ${a.recommendations.map(esc).join("; ")}</p><p><strong>Observações:</strong> ${esc(c.evidence||"Não informadas")}</p><p class="micro">${esc(a.disclaimer)}</p></article>`}).join("");
 window.print();box.innerHTML=old;renderCases();
});
document.getElementById("caseList")?.addEventListener("click",e=>{
 const open=e.target.closest("[data-case-open]"),del=e.target.closest("[data-case-delete]");
 if(open){const c=readCases().find(x=>x.id===open.dataset.caseOpen);if(c){const a=analyzeCase(c);currentCaseAnalysis={case:c,analysis:a};renderCaseAnalysis(c,a);document.getElementById("caseAnalysis").scrollIntoView({behavior:"smooth",block:"center"});}}
 if(del){const c=readCases().find(x=>x.id===del.dataset.caseDelete);if(c&&confirm("Excluir este registro local?")){saveCases(readCases().filter(x=>x.id!==c.id));renderCases();toast("Registro excluído.");}}
});


/* ILS 5.1 — lawful public Wi-Fi discovery.
   Queries only mapped public/community hotspot records. It does not scan RF,
   connect to networks, collect credentials, or bypass captive portals. */
async function queryOverpassResilient(query, statusEl){
 const endpoints=[
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter'
 ];
 let lastError='Servidores públicos temporariamente indisponíveis.';
 for(let i=0;i<endpoints.length;i++){
  statusEl.textContent=`Consultando fonte pública ${i+1} de ${endpoints.length}…`;
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),11000);
  try{
   const response=await fetch(endpoints[i],{
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8','Accept':'application/json'},
    body:'data='+encodeURIComponent(query),
    signal:controller.signal,
    cache:'no-store'
   });
   if(!response.ok)throw new Error(`HTTP ${response.status}`);
   const text=await response.text();
   let data;
   try{data=JSON.parse(text)}catch{throw new Error('Resposta inválida do serviço de mapas')}
   if(!data||!Array.isArray(data.elements))throw new Error('Formato de resposta não reconhecido');
   return {data,source:endpoints[i]};
  }catch(err){
   lastError=err.name==='AbortError'?'Tempo limite de 11 segundos excedido':(err.message||'Falha de conexão');
  }finally{clearTimeout(timer)}
 }
 throw new Error(lastError);
}
function buildPublicWifiQuery(lat,lon,radius){
 // Inclui qualquer valor registrado em internet_access e evita presumir que seja gratuito.
 return `[out:json][timeout:10];(node(around:${radius},${lat},${lon})["internet_access"];way(around:${radius},${lat},${lon})["internet_access"];relation(around:${radius},${lat},${lon})["internet_access"];);out center tags;`;
}
async function searchLawfulPublicWifi(){
 const status=document.getElementById('publicWifiStatus'),results=document.getElementById('publicWifiResults'),btn=document.getElementById('searchPublicWifi');
 const lat=parseLocaleNumber(document.getElementById('publicWifiLat').value);
 const lon=parseLocaleNumber(document.getElementById('publicWifiLon').value);
 const radius=Number(document.getElementById('publicWifiRadius').value);
 if(!validLocatorCoords(lat,lon)){status.textContent='Informe coordenadas válidas (latitude entre -90 e 90; longitude entre -180 e 180).';return;}
 if(!navigator.onLine){status.textContent='Você está offline. Conecte-se à Internet para consultar os registros públicos.';return;}
 if(!Number.isFinite(radius)||radius<100||radius>50000){status.textContent='Selecione um raio de pesquisa válido.';return;}
 const oldLabel=btn?.textContent||'Buscar Wi-Fi público mapeado';
 if(btn){btn.disabled=true;btn.textContent='Pesquisando…'}
 status.textContent='Iniciando consulta ao OpenStreetMap…';
 results.innerHTML='<div class="result-box">A consulta pode levar alguns segundos. Se uma fonte estiver indisponível, o ILS tentará outra automaticamente.</div>';
 try{
  const query=buildPublicWifiQuery(lat,lon,radius);
  const {data,source}=await queryOverpassResilient(query,status);
  const entries=(data.elements||[]).map(el=>{
   const tags=el.tags||{},la=el.lat??el.center?.lat,lo=el.lon??el.center?.lon;
   if(!Number.isFinite(la)||!Number.isFinite(lo))return null;
   return {...el,_lat:la,_lon:lo,_distance:haversineMeters(lat,lon,la,lo)};
  }).filter(Boolean).sort((a,b)=>a._distance-b._distance);
  if(!entries.length){
   status.textContent='Consulta concluída: nenhum registro com a etiqueta internet_access foi encontrado neste raio. Isso não comprova ausência de Wi-Fi público.';
   results.innerHTML='<div class="empty">Nenhum ponto mapeado encontrado. Experimente ampliar o raio ou consultar bibliotecas, órgãos públicos, universidades e estabelecimentos locais.</div>';
   return;
  }
  status.textContent=`${entries.length} registro(s) encontrado(s), ordenados por proximidade. Fonte: OpenStreetMap/Overpass. Disponibilidade não verificada.`;
  results.innerHTML=entries.map(el=>{
   const t=el.tags||{},name=t.name||t.operator||'Ponto de acesso sem nome informado';
   const kind=t.amenity||t.shop||t.tourism||t.leisure||t.office||'Local cadastrado';
   const access=t.internet_access||'não informado',fee=t.internet_access_fee||'não informado';
   const addr=[t['addr:street'],t['addr:housenumber'],t['addr:suburb'],t['addr:city']].filter(Boolean).join(', ');
   const map=`https://www.openstreetmap.org/?mlat=${el._lat}&mlon=${el._lon}#map=18/${el._lat}/${el._lon}`;
   const directions=`https://www.google.com/maps/dir/?api=1&destination=${el._lat},${el._lon}`;
   return `<article class="locator-result"><span class="tag tag-green">Registro público · não verificado em campo</span><h3>${esc(name)}</h3><p><strong>Distância em linha reta:</strong> ${formatDistance(el._distance)}</p><p><strong>Tipo:</strong> ${esc(kind)} · <strong>Acesso indicado:</strong> ${esc(access)} · <strong>Custo:</strong> ${esc(fee)}</p><p>${esc(addr||'Endereço não informado')}</p><p class="micro">Registro OpenStreetMap #${esc(el.id)}. Confirme com o responsável se a rede está ativa, se o acesso é público e se há cobrança.</p><a href="${map}" target="_blank" rel="noopener noreferrer">Ver no mapa ↗</a> · <a href="${directions}" target="_blank" rel="noopener noreferrer">Como chegar ↗</a></article>`;
  }).join('');
 }catch(err){
  const detail=err.message||'Falha de comunicação';
  status.textContent=`Não foi possível concluir a busca. ${detail}. Tente novamente ou aumente o intervalo antes de uma nova consulta.`;
  results.innerHTML='<div class="empty">Os servidores de dados geográficos não responderam dentro do limite. Nenhum resultado foi inventado. Tente novamente mais tarde.</div>';
 }finally{if(btn){btn.disabled=false;btn.textContent=oldLabel}}
}
document.getElementById("searchPublicWifi")?.addEventListener("click",searchLawfulPublicWifi);
document.getElementById("usePublicWifiLocation")?.addEventListener("click",()=>{
 const status=document.getElementById("publicWifiStatus");
 if(!navigator.geolocation){status.textContent="Geolocalização não suportada neste navegador.";return;}
 status.textContent="Solicitando localização…";
 navigator.geolocation.getCurrentPosition(pos=>{
  document.getElementById("publicWifiLat").value=pos.coords.latitude.toFixed(6);
  document.getElementById("publicWifiLon").value=pos.coords.longitude.toFixed(6);
  status.textContent=`Localização recebida. Precisão aproximada: ${Math.round(pos.coords.accuracy)} m. Toque em Buscar Wi-Fi público mapeado.`;
 },err=>{status.textContent="Não foi possível obter localização: "+err.message;},{enableHighAccuracy:true,timeout:15000,maximumAge:60000});
});


/* ILS 5.1 — local license register. Demonstration only; not a secure entitlement system. */
const ILS_LICENSE_KEY="ils50-local-license-register";
function readIlsLicenses(){try{const v=JSON.parse(localStorage.getItem(ILS_LICENSE_KEY)||"[]");return Array.isArray(v)?v:[]}catch{return[]}}
function saveIlsLicenses(rows){try{localStorage.setItem(ILS_LICENSE_KEY,JSON.stringify(rows));return true}catch(e){toast("Não foi possível salvar neste navegador.");return false}}
function licenseDateStatus(row){const today=new Date();today.setHours(0,0,0,0);const end=new Date(row.end+"T23:59:59");return end>=today?"Ativa por data":"Expirada por data"}
function moneyBR(v){return Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
function renderIlsLicenses(){const rows=readIlsLicenses(),active=rows.filter(x=>licenseDateStatus(x)==="Ativa por data");document.getElementById("bizTotal").textContent=rows.length;document.getElementById("bizActive").textContent=active.length;document.getElementById("bizPotential").textContent=moneyBR(rows.reduce((s,x)=>s+Number(x.value||0),0));const body=document.getElementById("licenseRows");if(!rows.length){body.innerHTML='<tr><td colspan="6" class="empty">Nenhuma licença cadastrada.</td></tr>';return;}body.innerHTML=rows.slice().reverse().map(x=>{const status=licenseDateStatus(x);return `<tr><td><strong>${esc(x.name)}</strong><br><small>${esc(x.email)}</small></td><td>${esc(x.plan)}</td><td>${esc(x.start)} até ${esc(x.end)}</td><td>${moneyBR(x.value)}</td><td><span class="license-status ${status.startsWith("Ativa")?"active":"expired"}">${status}</span></td><td><button class="btn btn-ghost" data-lic-delete="${esc(x.id)}">Excluir</button></td></tr>`}).join("")}
const licStart=document.getElementById("licStart"),licEnd=document.getElementById("licEnd");if(licStart&&!licStart.value){const d=new Date();licStart.value=d.toISOString().slice(0,10);const e=new Date(d);e.setDate(e.getDate()+30);licEnd.value=e.toISOString().slice(0,10)}
document.getElementById("licPlan")?.addEventListener("change",e=>{const v={Livre:0,Plus:9.9,Pro:49.9,Institucional:0};document.getElementById("licValue").value=v[e.target.value]??0});
document.getElementById("licenseForm")?.addEventListener("submit",e=>{e.preventDefault();const row={id:"lic-"+Date.now(),name:document.getElementById("licName").value.trim(),email:document.getElementById("licEmail").value.trim(),plan:document.getElementById("licPlan").value,value:Number(document.getElementById("licValue").value||0),start:licStart.value,end:licEnd.value,notes:document.getElementById("licNotes").value.trim(),createdAt:new Date().toISOString()};if(!row.name||!row.email||!row.start||!row.end||row.end<row.start){toast("Confira os dados e o período da licença.");return}const rows=readIlsLicenses();rows.push(row);if(saveIlsLicenses(rows)){e.target.reset();const d=new Date();licStart.value=d.toISOString().slice(0,10);d.setDate(d.getDate()+30);licEnd.value=d.toISOString().slice(0,10);document.getElementById("licValue").value="9.90";renderIlsLicenses();toast("Registro local criado. Pagamento não foi verificado.")}});
document.getElementById("licenseRows")?.addEventListener("click",e=>{const b=e.target.closest("[data-lic-delete]");if(!b)return;if(confirm("Excluir este registro local?")){saveIlsLicenses(readIlsLicenses().filter(x=>x.id!==b.dataset.licDelete));renderIlsLicenses()}});
document.getElementById("refreshLicenses")?.addEventListener("click",renderIlsLicenses);
document.getElementById("exportLicenses")?.addEventListener("click",()=>{const rows=readIlsLicenses();downloadFile("ils-5.0-registro-local-licencas.json",JSON.stringify({application:"ILS 5.1",exportedAt:new Date().toISOString(),mode:"local-demonstration-only",paymentVerified:false,licenses:rows},null,2),"application/json")});
document.getElementById("printLicenses")?.addEventListener("click",()=>{renderIlsLicenses();window.print()});



// ILS RF Spectrum Analyzer — backend local RTL-SDR, recepção passiva.
let rfScanController=null;
function rfBase(){return (document.getElementById('sdrUrl')?.value||'http://127.0.0.1:8765').trim().replace(/\/+$/,'');}
function rfLocalUrl(){const u=rfBase();return /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/i.test(u)?u:null;}
function drawRfSpectrum(rows){
 const canvas=document.getElementById('rfSpectrum');if(!canvas)return;
 const ctx=canvas.getContext('2d'),w=canvas.clientWidth||600,h=220,dpr=window.devicePixelRatio||1;
 canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.scale(dpr,dpr);ctx.clearRect(0,0,w,h);
 const vals=rows.map(x=>Number(x.power_dbfs)).filter(Number.isFinite);if(!vals.length){ctx.fillText('Sem dados de espectro',12,24);return;}
 const min=Math.min(-120,Math.floor(Math.min(...vals)/10)*10),max=Math.max(-20,Math.ceil(Math.max(...vals)/10)*10),left=42,right=10,top=12,bottom=28,pw=w-left-right,ph=h-top-bottom;
 ctx.font='11px sans-serif';ctx.strokeStyle='#9aa8b8';ctx.fillStyle='#718096';ctx.lineWidth=1;
 for(let i=0;i<=4;i++){const y=top+ph*i/4,v=max-(max-min)*i/4;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(w-right,y);ctx.stroke();ctx.fillText(v.toFixed(0),4,y+4);}
 ctx.beginPath();rows.forEach((r,i)=>{const x=left+pw*i/Math.max(1,rows.length-1),y=top+ph*(max-Number(r.power_dbfs))/(max-min);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.strokeStyle='#2676d9';ctx.lineWidth=2;ctx.stroke();
 ctx.fillStyle='#718096';ctx.fillText(Number(rows[0].frequency_mhz).toFixed(3)+' MHz',left,h-8);const last=rows[rows.length-1];const label=Number(last.frequency_mhz).toFixed(3)+' MHz';ctx.fillText(label,Math.max(left,w-right-ctx.measureText(label).width),h-8);
}
async function rfRequest(path,opts={}){const base=rfLocalUrl();if(!base)throw Error('Por segurança, a ponte deve estar em localhost ou 127.0.0.1.');const r=await fetch(base+path,{cache:'no-store',...opts});const data=await r.json();if(!r.ok)throw Error(data.error||('HTTP '+r.status));return data;}
async function checkRfBridge(){const out=document.getElementById('rfSummary'),status=document.getElementById('rfStatus');out.textContent='Verificando serviço e receptor…';try{const d=await rfRequest('/health');status.textContent=d.device_present?'RTL-SDR detectado':'Ponte ativa · SDR ausente';status.className=d.device_present?'tag tag-green':'tag tag-warn';out.innerHTML=`<strong>${d.device_present?'Receptor identificado':'Serviço local ativo, mas sem receptor detectado'}</strong><p>${esc(d.device||'RTL-SDR não identificado')}</p><p class="micro">Backend: ${esc(d.backend||'rtl_power')} · Modo: somente recepção · Ferramenta: ${esc(d.rtl_power||'não encontrada')}</p><p>${esc(d.message||'')}</p>`;}catch(e){status.textContent='Ponte indisponível';status.className='tag tag-warn';out.textContent='Não foi possível conectar à ponte: '+e.message+'. Inicie sdr_bridge.py no computador com rtl_power instalado e receptor compatível.';}}
async function runRfScan(){
 const out=document.getElementById('rfSummary');const start=Number(document.getElementById('rfStart').value),stop=Number(document.getElementById('rfStop').value),step=Number(document.getElementById('rfStep').value),gain=document.getElementById('rfGain').value;
 if(!(start>=24&&stop>start&&stop<=1766&&stop-start<=100)){out.textContent='Informe faixa válida entre 24 e 1766 MHz, com intervalo máximo de 100 MHz por varredura.';return;}
 out.textContent='Capturando amostras RF. Aguarde…';document.getElementById('rfScan').disabled=true;
 try{const q=new URLSearchParams({start_mhz:String(start),stop_mhz:String(stop),step_khz:String(step),gain});const d=await rfRequest('/scan?'+q.toString());drawRfSpectrum(d.samples||[]);document.getElementById('rfChartCaption').textContent=`${d.samples.length} amostras · ${d.start_mhz}–${d.stop_mhz} MHz · ${d.timestamp} · potência relativa dBFS`;
 const peak=(d.samples||[]).reduce((a,b)=>!a||b.power_dbfs>a.power_dbfs?b:a,null);out.innerHTML=`<strong>Varredura concluída</strong><div class="analysis-grid"><div class="analysis-chip">Amostras<strong>${d.samples.length}</strong></div><div class="analysis-chip">Pico relativo<strong>${peak?Number(peak.power_dbfs).toFixed(1)+' dBFS':'—'}</strong></div><div class="analysis-chip">Frequência do pico<strong>${peak?Number(peak.frequency_mhz).toFixed(3)+' MHz':'—'}</strong></div><div class="analysis-chip">Faixa<strong>${d.start_mhz}–${d.stop_mhz} MHz</strong></div></div><p class="micro">${esc(d.note||'Medição recebida do receptor RTL-SDR.')}</p>`;
 }catch(e){out.textContent='Falha na varredura: '+e.message;}finally{document.getElementById('rfScan').disabled=false;}
}
document.getElementById('rfCheck')?.addEventListener('click',checkRfBridge);
document.getElementById('rfScan')?.addEventListener('click',runRfScan);
document.getElementById('rfStopScan')?.addEventListener('click',()=>{const out=document.getElementById('rfSummary');out.textContent='A varredura atual é executada como uma operação única no serviço local. Aguarde o término ou encerre o processo sdr_bridge.py no computador.';});
