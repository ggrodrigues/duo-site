'use strict';
const panes={clients:'clients-page',assets:'assets-page',history:'history'};
const guidePrefs='duo-visita-company-v2';
const providerNames={hvac:'Aruanã Climatização',electric:'Tucumã Engenharia'};
let pane='clients',clientScope='',assetScope='',returnPane='clients';
function localPref(value){try{if(value!==undefined)localStorage.setItem(guidePrefs,value);return localStorage.getItem(guidePrefs)||localStorage.getItem('duo-visita-source-v1');}catch{return null;}}
function activeRows(){return demo?demoBanks[demo].records:typeof enrichVisit==='function'?records.map(enrichVisit):records;}
function assetKey(r){return r.assetId?'asset:'+r.assetId:JSON.stringify([r.cliente,r.local,r.equipamento||'']);}
function scopedRows(){return activeRows().filter(r=>r.cliente===clientScope&&assetKey(r)===assetScope);}
function setOptions(select,values){
 const old=select.value;
 select.replaceChildren();
 for(const v of values)select.add(new Option(v,v));
 if(values.includes(old))select.value=old;
}
function paintContext(){
 const clients=catalogRows().filter(r=>r.cliente===clientScope), asset=clients.find(r=>r._empty&&!r._clientOnly&&assetKey(r)===assetScope)??clients.find(r=>!r._clientOnly&&assetKey(r)===assetScope);
 if(!clients.length)clientScope='';
 if(!asset)assetScope='';
 paintCompany();
 $('company-scope').disabled=dbLoading||transferring;
 const path=$('active-path');
 path.hidden=pane==='clients'||!clientScope;path.replaceChildren();
 if(!path.hidden){
  path.append(pathButton('Clientes',()=>goScope('','clients')));
  if(pane==='assets')path.append(el('strong',clientScope));
  if(pane==='history'&&asset)path.append(pathButton(clientScope,()=>goScope(clientScope,'assets')),el('span',asset.local),el('strong',asset.equipamento||'Sem equipamento'));
 }
}
function initialDemo(){
 const saved=localPref();
 if(saved==='hvac'||saved==='electric')demo=saved;
 else if(saved==='demo'||(!saved&&!records.length))demo='hvac';
}
function setPane(next,focus=true,restore=null){
 if(next==='history'&&!assetScope)next='assets';
 if(next==='assets'&&!clientScope)next='clients';
 pane=next;
 for(const [key,id] of Object.entries(panes)){
  $(id).hidden=key!==next;
 }
 $('search').value=restore?.query??'';historyPage=restore?.page??0;renderHistory();window.scrollTo(0,restore?.top??0);
 if(focus)$(next==='history'?'history-title':next+'-title').focus({preventScroll:true});
}
function goScope(client, view, key=''){
 clientScope=client;assetScope=key;setPane(view);
}
const companyMarks={hvac:'AC',electric:'TE'};
function paintCompany(){
 const key=demo||'own',mark=$('company-mark');mark.dataset.company=key;mark.replaceChildren();
 const name=providerName();$('company-current').textContent=name+(demo?' (exemplo)':'');
 if(!demo&&directory.logo){const image=el('img');image.alt='';image.src=directory.logo.url;mark.append(image);}
 else mark.textContent=companyMarks[key]||name.split(/\s+/).slice(0,2).map(s=>s[0]).join('').toUpperCase();
}
function openCompany(){
 const holder=$('company-options');holder.replaceChildren();
 const selected=demo||'own';
 for(const key of ['hvac','electric','own']){
  const current=key===selected, name=providerNames[key]||directory.provider||'Minha empresa';
  const entry=action(undefined,()=>{$('company-dialog').close();if(!current)selectCompany(key);$('company-scope').focus();});
  entry.className='company-option';entry.setAttribute('aria-pressed',String(current));
  const icon=el('span',companyMarks[key]||name.split(/\s+/).slice(0,2).map(s=>s[0]).join('').toUpperCase(),'company-card-mark');
  icon.dataset.company=key;icon.setAttribute('aria-hidden','true');
  if(key==='own'&&directory.logo){const img=el('img');img.alt='';img.src=directory.logo.url;icon.replaceChildren(img);}
  const details=el('span',undefined,'company-card-body');details.append(el('strong',name),el('small',key==='own'?'Dados deste navegador':'Base de exemplo'));
  entry.append(icon,details);if(current)entry.append(el('span','Em uso','company-selected'));
  holder.append(entry);
 }
 $('company-dialog').showModal();
}
function selectCompany(value){
 if(value!=='own'&&!Object.hasOwn(demoBanks,value))return;
 demo=value==='own'?false:value;localPref(value);clientScope='';assetScope='';histNote('');setPane('clients',false);
}
function groupBy(rows,key){
 const result=new Map();
 for(const r of rows){const k=key(r);if(!result.has(k))result.set(k,[]);result.get(k).push(r);}
 for(const set of result.values())set.sort((a,b)=>b.data.localeCompare(a.data)||(b.updated||0)-(a.updated||0));
 return result;
}
const demoAsset=(r,what)=>{
 if(!r.sample)return '';
 const illustration=what==='cliente'?r.demoClientThumb:r.demoEquipThumb;
 return 'assets/thumbs/'+(illustration||((r.id.includes('-hvac-')?'hvac':'electric')+'-'+what+'.webp'));
};
function thumb(r,what){
 const src=demoAsset(r,what);
 if(src){const image=el('img',undefined,'catalog-thumb');image.src=src;image.alt='';image.width=72;image.height=64;return image;}
 const name=what==='cliente'?r.cliente:r.equipamento;
 return el('span',(name||'?').split(/\s+/).slice(0,2).map(s=>s[0]).join('').toUpperCase(),'catalog-thumb initials');
}
function action(name,fn,primary=false){
 const b=el('button',name,primary?'primary':undefined);b.type='button';b.onclick=fn;return b;
}
function pathButton(title,fn){const b=action(title,fn);b.className='path-button';return b;}
function catalogItem(r,what,title,items,buttons,enter){
 const item=el('article',undefined,'catalog-item catalog-hit'),info=el('div',undefined,'catalog-info'),actions=el('div',undefined,'catalog-actions');
 const heading=el('h3');const entry=action(title,enter);entry.className='catalog-entry';heading.append(entry);info.append(heading);for(const text of items)if(text)info.append(el('p',text,'small'));
 actions.append(...buttons);item.append(thumb(r,what),info,actions);return item;
}
function clientAssets(client){
 return groupBy(catalogRows().filter(r=>r.cliente===client&&!r._clientOnly),assetKey);
}
function renderCatalogs(){
 const all=catalogRows(), clients=$('clients-list'), assets=$('assets-list');
 clients.replaceChildren();assets.replaceChildren();
 if(pane==='clients'){
  for(const [name,group] of groupBy(all,r=>r.cliente)){
   const nEquip=new Set(group.filter(x=>x.equipamento).map(assetKey)).size, visits=group.filter(x=>!x._empty);
   const buttons=[action('Relatório de equipamentos',()=>openInventory(name))];
   const client=resolveClient(group[0]);if(catalogWriteable()&&client)buttons.push(action('Editar cliente',()=>editCatalog('client',client.id)));
   clients.append(catalogItem(group[0],'cliente',name,[`${nEquip} equipamento(s) · ${visits.length} visita(s)`,visits.length?`Última visita: ${brdate(visits[0].data)}`:'Ainda sem visitas'],buttons,()=>goScope(name,'assets')));
  }
  if(!clients.children.length)clients.append(el('p',dbLoading?'Abrindo a base…':!db?'Armazenamento local indisponível. Selecione uma empresa de exemplo para testar.':'Adicione um cliente ou importe sua base em Gerenciar dados.','catalog-empty'));
 }
 if(pane==='assets'){
  for(const [key,group] of clientAssets(clientScope)){
   const visits=group.filter(x=>!x._empty),latest=visits[0],r=group.find(x=>x._empty)??group[0];
   const pend=latest?.pendencias?'Observação da última visita: '+latest.pendencias:'';
   const buttons=[action('Relatório mensal',()=>openMonth(key))];buttons[0].disabled=!visits.length;
   if(catalogWriteable()&&r.assetId)buttons.push(action('Editar equipamento',()=>editCatalog('asset',r.assetId)));
   assets.append(catalogItem(r,'equipamento',r.equipamento||'Visitas sem equipamento',[r.local,visits.length?`${visits.length} visita(s) · Última em ${brdate(latest.data)}`:'Ainda sem visitas',pend],buttons,()=>goScope(r.cliente,'history',key)));

  }
  if(!assets.children.length)assets.append(el('p','Nenhum equipamento registrado para este cliente.','catalog-empty'));
 }
}
function equipmentInventory(client){
 return [...clientAssets(client).values()].filter(g=>g[0].equipamento).map(g=>{
  const a=g.find(r=>r._empty)??g[0], visits=g.filter(r=>!r._empty), latest=visits[0];
  return {name:a.equipamento,local:a.local,date:latest?.data||'',count:visits.length,pending:latest?.pendencias};
 }).sort((a,b)=>a.local.localeCompare(b.local,'pt-BR')||a.name.localeCompare(b.name,'pt-BR'));

}
let inventoryClient='';
function openInventory(client){
 inventoryClient=client;const entries=equipmentInventory(client), list=$('inventory-results');
 $('inventory-context').textContent=client+' · '+entries.length+' equipamento(s)';
 $('inventory-status').textContent=entries.length?'':'Nenhum equipamento identificado. Visitas sem equipamento não entram neste relatório.';
 $('inventory-export').disabled=!entries.length;list.replaceChildren();
 for(const a of entries){const line=el('div',undefined,'month-row');line.append(el('strong',a.name),el('p',a.local+' · '+(a.count?a.count+' visita(s) · Última: '+brdate(a.date):'Sem visitas'),'small'));list.append(line);}
 $('inventory-dialog').showModal();
}
function pdfMeasure(){
 const ctx=document.createElement('canvas').getContext('2d');
 return (s,sz,b)=>{ctx.font=(b?'bold ':'')+sz+'px Arial';return ctx.measureText(s).width*1.045;};
}
function saveInventory(){
 const inventory=equipmentInventory(inventoryClient);if(!inventory.length)return;
 try{const pdf=makePdf({...reportBrand(),inventory, sample:!!demo, cliente:inventoryClient},pdfMeasure());
 fileOut((demo?'AMOSTRA-':'')+'Equipamentos-'+today()+'.pdf',pdf,'application/pdf');
 $('inventory-status').textContent='PDF de equipamentos gerado.';}catch(e){$('inventory-status').textContent='Não foi possível gerar o PDF.';console.error(e);}
}
const checkFields={
 hvac:['Filtro inspecionado','Dreno verificado','Temperaturas registradas','Foto do equipamento'],
 electric:['Identificação conferida','Gabinete inspecionado externamente','Resultado registrado','Foto do painel']
};
const checkStates=['OK','Pendência','Não se aplica'];
function showChecklist(kind='',values={}){
 $('check-kind').value=kind;$('check-items').replaceChildren();
 for(const [i,title] of (checkFields[kind]||[]).entries()){
  const l=el('label',title),s=el('select');s.dataset.check=String(i);
  s.add(new Option('Não conferido',''));for(const state of checkStates)s.add(new Option(state,state));
  s.value=values[i]||'';l.append(s);$('check-items').append(l);
 }
}
function readChecklist(){
 const kind=$('check-kind').value, values={};
 for(const s of $('check-items').querySelectorAll('select'))if(s.value)values[s.dataset.check]=s.value;
 return {kind,values};
}
function cleanChecklist(x){
 const kind=x?.kind||'';
 if(kind&&!Object.hasOwn(checkFields,kind))throw Error('Tipo de checklist inválido.');
 const values={};
 for(const [k,v] of Object.entries(x?.values||{})){
  if(!/^\d$/.test(k)||!checkFields[kind]?.[k]||!checkStates.includes(v))throw Error('Item de checklist inválido.');
  values[k]=v;
 }
 return {kind,values};
}
function checklistLines(c){
 return (checkFields[c?.kind]||[]).map((v,k)=>v+': '+(c.values?.[k]||'Não conferido'));
}
let monthAsset='';
function closureRows(){
 return activeRows().filter(r=>assetKey(r)===monthAsset&&r.data.slice(0,7)===$('month-date').value).sort((a,b)=>a.data.localeCompare(b.data));
}
function pdfPart(value,fallback){
 const text=String(value??'').normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,44).replace(/-+$/g,'');
 return text||fallback;
}
function monthlyFilename({cliente,local,equipamento,month,sample}){
 return (sample?'AMOSTRA-':'')+'Mensal-'+[pdfPart(cliente,'Cliente'),pdfPart(equipamento,'Sem-equipamento'),pdfPart(local,'Local'),month].join('-')+'.pdf';
}
function warnings(r){
 const list=[];
 if(photoChecklistMismatch(r))list.push('Foto marcada como OK, mas não anexada');
 else if(!r.pics?.length)list.push('Evidência ausente: foto');
 if(!r.readings?.length)list.push('Evidência ausente: medição');
 if(r.pendencias)list.push('Acompanhamento: há próximos passos anotados');
 if(Object.values(r.checklist?.values||{}).includes('Pendência'))list.push('Acompanhamento: pendência no checklist');
 if(r.checklist?.kind&&checklistLines(r.checklist).some(s=>s.endsWith('Não conferido')))list.push('Checklist incompleto');
 return list;
}
function refreshMonth(){
 const rows=closureRows(), target=$('month-results');target.replaceChildren();
 $('month-summary').textContent=`${rows.length} visita(s) · ${rows.reduce((n,r)=>n+(r.pics?.length||0),0)} foto(s). Confira os avisos antes de exportar.`;
 $('month-export').disabled=!rows.length;
 for(const r of rows){
  const entry=el('div',undefined,'month-row');
  const details=el('div');details.append(el('strong',`${brdate(r.data)} · ${r.os||'Sem OS'}`),el('p',warnings(r).join(' · ')||'Sem avisos de preenchimento','small'));
  const open=action('Ver visita',()=>{openRecord(r);$('month-dialog').close();$('review-title').focus();});open.setAttribute('aria-label','Ver visita '+(r.os||brdate(r.data)));
  entry.classList.add('draft-row');entry.append(details,open);target.append(entry);
 }
}
function openMonth(key,period=''){
 const rows=activeRows().filter(r=>assetKey(r)===key);if(!rows.length)return;
 monthAsset=key;
 const currentAsset=catalogRows().find(r=>r._empty&&!r._clientOnly&&assetKey(r)===key)??rows[0];
 const {cliente,local,equipamento}=currentAsset;
 $('month-context').textContent=[cliente,local,equipamento||'Sem equipamento'].join(' · ');
 const date=$('month-date');date.replaceChildren();
 setOptions(date,[...new Set(rows.map(r=>r.data.slice(0,7)))].sort().reverse());
 if(period&&[...date.options].some(o=>o.value===period))date.value=period;
 for(const o of date.options)o.textContent=o.value.split('-').reverse().join('/');
 refreshMonth();$('month-dialog').showModal();
}
function reopenMonth({asset,period}){openMonth(asset,period);}
function saveMonth(){
 const rows=closureRows();if(!rows.length)return;
 try{
  const visits=rows.map(r=>({...r,checkLines:checklistLines(r.checklist)}));
  const summary=rows.map(r=>`${brdate(r.data)} · ${r.os||'Sem OS'}${warnings(r).length?' | '+warnings(r).join(', '):''}`);
  const month=$('month-date').value,{cliente,local,equipamento}=catalogRows().find(r=>r._empty&&!r._clientOnly&&assetKey(r)===monthAsset)??rows[0];
  const pdf=makePdf({...reportBrand(),monthly:true,sample:!!demo,visits,summary,cliente,local,equipamento:equipamento||'Sem equipamento',period:month.split('-').reverse().join('/')},pdfMeasure());
  fileOut(monthlyFilename({cliente,local,equipamento,month,sample:!!demo}),pdf,'application/pdf');
  $('month-summary').textContent='PDF mensal gerado.';
 }catch(e){$('month-summary').textContent='Não foi possível gerar o PDF.';console.error(e);}
}
const tours={
 clients:[['#company-bar','Escolha a empresa que usa o sistema','Teste como uma prestadora fictícia ou selecione Minha empresa. As bases ficam separadas.'],['#clients-list .catalog-item','Abra um cliente','Toque no cartão do cliente para abrir os equipamentos dele. Relatório de equipamentos gera a lista em PDF.'],['#new-first-visit','Cadastre o cliente','Adicione o cliente antes de incluir os equipamentos e registrar visitas.'],['#manage-data','Gerencie a base local','Importe Excel ou faça um backup completo com fotos.']],
 assets:[['#active-path','Confira o cliente','A lista abaixo contém apenas equipamentos e locais deste cliente.'],['#assets-list .catalog-item','Escolha o equipamento','Em Relatório mensal, reúna as visitas daquele equipamento no mês escolhido. Toque no cartão do equipamento para abrir as visitas.']],
 history:[['#active-path','Confira o equipamento','O histórico é limitado a este cliente, local e equipamento.'],['#search','Localize uma visita','Busque por sintoma, serviço, pendência, data, técnico ou número da OS.'],['.register-frame','Abra uma visita','Cada registro tem medições, fotos e um PDF individual.'],['#blank','Registre outro atendimento','A identificação do equipamento já vem preenchida.']],
 visit:[['#visit-stage','Etapa da visita','Preencha, revise e conclua. O PDF fica disponível no relatório concluído.'],['#checklist-block','Checklist e nota interna','Selecione o tipo de serviço e marque cada item. A nota é só para sua equipe.'],['#paper','Confira o PDF','O relatório reúne serviços, medições e fotos da visita.'],['#save-draft','Interrompa sem perder dados','Salve um rascunho e retome pelo menu Rascunhos neste navegador.']]
};
let tour=null;
function spotlight(){
 if(!tour)return;
 const [selector,title,text]=tour.steps[tour.index], target=document.querySelector(selector);
 const box=$('tour-box'),spot=$('tour-spot'),r=target.getBoundingClientRect(), W=innerWidth,H=innerHeight;
 const x=Math.max(3,r.left-3),y=Math.max(3,r.top-3),right=Math.min(W-3,r.right+3),bottom=Math.min(H-3,r.bottom+3);
 Object.assign(spot.style,{left:x+'px',top:y+'px',width:Math.max(0,right-x)+'px',height:Math.max(0,bottom-y)+'px'});
 const bh=box.offsetHeight,bw=box.offsetWidth;
 const by=bottom+bh+10<=H?bottom+7:y>=bh+10?y-bh-7:Math.max(8,H-bh-8);
 box.style.top=by+'px';box.style.left=Math.max(8,Math.min(x,W-bw-8))+'px';
}
function tourStep(){
 const [selector,title,text]=tour.steps[tour.index], target=document.querySelector(selector);
 target.scrollIntoView({block:'center',inline:'nearest'});$('tour-title').textContent=title;$('tour-text').textContent=text;
 $('tour-progress').textContent=`${tour.index+1} de ${tour.steps.length}`;
 $('tour-prev').disabled=!tour.index;$('tour-next').textContent=tour.index===tour.steps.length-1?'Concluir':'Próximo';
 spotlight();$('tour-next').focus({preventScroll:true});
}
function startTour(key,from){
 if(typeof isGuidedVisitActive==='function'&&isGuidedVisitActive()){$('guided-skip').focus({preventScroll:true});return;}
 const steps=tours[key].filter(([sel])=>document.querySelector(sel)?.getClientRects().length);
 if(!steps.length)return;
 tour={steps,index:0,from,scroll:scrollY};$('tour-layer').hidden=false;
 document.querySelector('main').inert=true;document.querySelector('header').inert=true;tourStep();
}
function endTour(){
 if(!tour)return;const {from,scroll}=tour;tour=null;$('tour-layer').hidden=true;
 document.querySelector('main').inert=false;document.querySelector('header').inert=false;
 window.scrollTo(0,scroll);from.focus({preventScroll:true});
}
function setupPortal(){
 $('company-scope').onclick=openCompany;
 $('company-close').onclick=()=>$('company-dialog').close();
 $('portal-guide').onclick=e=>startTour(pane,e.currentTarget);
 $('visit-guide').onclick=e=>startTour('visit',e.currentTarget);
 $('tour-skip').onclick=endTour;
 $('tour-prev').onclick=()=>{if(tour.index>0){tour.index--;tourStep();}};
 $('tour-next').onclick=()=>{if(tour.index+1>=tour.steps.length)endTour();else{tour.index++;tourStep();}};
 $('tour-layer').onkeydown=e=>{
  if(e.key==='Escape'){e.preventDefault();endTour();}
  if(e.key==='Tab'){const bs=[...$('tour-layer').querySelectorAll('button:not(:disabled)')];if((e.shiftKey&&document.activeElement===bs[0])||(!e.shiftKey&&document.activeElement===bs.at(-1))){e.preventDefault();(e.shiftKey?bs.at(-1):bs[0]).focus();}}
 };
 addEventListener('resize',spotlight);addEventListener('scroll',spotlight,{passive:true});
 $('check-kind').onchange=e=>{showChecklist(e.target.value);markEdited();};
 $('history-month').onclick=()=>openMonth(assetScope);
 $('month-close').onclick=()=>$('month-dialog').close();
 $('month-date').onchange=refreshMonth;
 $('month-export').onclick=saveMonth;
 $('inventory-close').onclick=()=>$('inventory-dialog').close();
 $('inventory-export').onclick=saveInventory;
}
setupPortal();
