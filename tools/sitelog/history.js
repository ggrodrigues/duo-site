
'use strict';
const SHEETS=['Manutenções','Medições'];
const HEAD=['ID','Cliente','Local','Data','Técnico responsável','Equipamento','Ordem de serviço','Objetivo','Serviços executados','Pendências'];
const MEAS=['ID da manutenção','Item','Valor','Unidade'];
const limits=[120,120,10,100,120,50,220,2200,1500];
const schema='duo-tools-visitas-v2';
let db, records=[], demo=false, current=null, saving=false, transferring=false;
const pageSize=20;let historyPage=0,dbLoading=true,visitReturn=null,linkedContext=null;
const copy=v=>JSON.parse(JSON.stringify(v));
const validId=v=>typeof v==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(v);
const normal=v=>String(v??'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
function dateOK(v){const d=new Date(v+'T00:00:00Z');return /^\d{4}-\d{2}-\d{2}$/.test(v)&&v>='1900-01-01'&&Number.isFinite(+d)&&d.toISOString().slice(0,10)===v;}
function histNote(msg){for(const id of ['hist-notice','data-notice']){const box=$(id);box.textContent=msg;box.hidden=!msg;}}
function fileOut(file,data,type){const url=URL.createObjectURL(new Blob([data],{type}));const a=el('a');a.href=url;a.download=file;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
function openDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open('duo-visitas',1);req.onupgradeneeded=()=>req.result.createObjectStore('visitas',{keyPath:'id'});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);req.onblocked=()=>reject(Error('Banco ocupado em outra aba.'));});}
function readDB(){return new Promise((resolve,reject)=>{const req=db.transaction('visitas').objectStore('visitas').getAll();req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
function writeDB(rows){return new Promise((resolve,reject)=>{const tx=db.transaction('visitas','readwrite');tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error||Error('Gravação cancelada.'));const s=tx.objectStore('visitas');try{rows.forEach(r=>s.put(r));}catch(e){tx.abort();reject(e);}});}
function visitSearchText(r){
 return normal([r.cliente,r.equipamento,r.local,r.os,r.tecnico,r.objetivo,r.servicos,r.pendencias,...(r.readings||[]).flat(),r.data,brdate(r.data)].join(' '));
}
function renderHistory(){
 const canWrite=!!db&&!transferring&&!demo;
 for(const id of ['blank','new-first-visit','new-client-visit']){$(id).hidden=!!demo&&id!=='blank';$(id).disabled=!(id==='blank'?(canWrite||!!demo):catalogWriteable());}
 $('draft-open').hidden=!!demo||!workDB;$('draft-open').textContent=savedDrafts.length?'Rascunhos ('+savedDrafts.length+')':'Rascunhos';
 $('manage-data').hidden=!!demo;$('manage-data').disabled=transferring||dbLoading;
 ['import-xlsx','import-backup','export-xlsx'].forEach(id=>$(id).disabled=!canWrite);
 $('export-xlsx-label').textContent=records.length?'Exportar Excel':'Baixar modelo Excel';
 $('export-backup').disabled=!canWrite||!(records.length||directory.clients.length||savedDrafts.length||directory.provider);
 paintContext();renderCatalogs();
 $('history-month').disabled=!scopedRows().length;
 const holder=$('hist-rows');holder.replaceChildren();
 const query=normal($('search').value.trim()).split(/\s+/).filter(Boolean);
 const all=scopedRows();
 const visible=all.filter(r=>{if(!query.length)return true;const searchable=visitSearchText(r);return query.every(q=>searchable.includes(q));}).sort((a,b)=>b.data.localeCompare(a.data)||(b.updated||0)-(a.updated||0));
 const pages=Math.ceil(visible.length/pageSize);
 historyPage=Math.max(0,Math.min(historyPage,pages-1));
 $('register-count').textContent=dbLoading&&!demo?'Carregando…':!db&&!demo?'Indisponível':query.length?`${visible.length} de ${all.length}`:`${visible.length} ${visible.length===1?'registro':'registros'}`;
 $('register-pager').hidden=pages<=1;
 $('prev-page').disabled=historyPage===0;
 $('next-page').disabled=historyPage+1>=pages;
 $('page-info').textContent=`Página ${historyPage+1} de ${pages}`;
 if(!visible.length){
  const line=el('tr');const td=el('td',undefined,'register-empty');td.colSpan=6;
  td.append(el('strong',dbLoading&&!demo?'Carregando histórico…':!db&&!demo?'Histórico indisponível':all.length?'Nenhum registro encontrado':activeRows().length?'Nenhuma visita para esta seleção':'Nenhuma manutenção registrada'));
  if(!dbLoading&&(db||demo))td.append(el('p',all.length?'Tente outro termo de busca.':'Use Registrar visita para criar o primeiro registro.','small'));
  line.append(td);holder.append(line);return;
 }
 visible.slice(historyPage*pageSize,(historyPage+1)*pageSize).forEach(r=>{
  const line=el('tr',undefined,'hist-item');
  const date=el('td',undefined,'visit-date');const time=el('time',brdate(r.data));time.dateTime=r.data;date.append(time);
  const equip=el('td',undefined,'visit-details');
  const state=r.pendencias||Object.values(r.checklist?.values||{}).includes('Pendência')?'Com acompanhamento':'Registrada';
  const imgs=(r.pics?.length||0), reads=(r.readings?.length||0);
  const evidence=[imgs?imgs+(imgs===1?' foto':' fotos'):'',reads?reads+(reads===1?' medição':' medições'):''].filter(Boolean).join(' · ');
  equip.append(el('strong',r.objetivo||'Visita técnica'));
  equip.append(el('span',[r.os,imgs?imgs+(imgs===1?' foto':' fotos'):'',state].filter(Boolean).join(' · '),'mobile-meta small'));
  const os=el('td',r.os||'Sem OS','desktop-col'), status=el('td',state,'desktop-col'), photos=el('td',evidence||'Sem evidências','desktop-col photo-col');
  const cell=el('td',undefined,'record-action');const button=el('button','Abrir');button.type='button';button.dataset.record=r.id;
  button.setAttribute('aria-label','Abrir '+(r.equipamento||r.cliente)+' de '+brdate(r.data));button.onclick=()=>openRecord(r);cell.append(button);
  line.append(date,equip,os,status,photos,cell);holder.append(line);
 });
}
function openRecord(r,seed,draft=null){
 returnPane=pane;visitReturn={query:$('search').value,page:historyPage,top:window.scrollY,record:r?.id,month:$('month-dialog').open?{asset:monthAsset,period:$('month-date').value}:null};current=draft?draft.visitId:r?.id??null;draftKey=draft?.id??null;draftSavedAt=draft?.updated??0;linkedContext={clientId:(r??seed)?.clientId,assetId:(r??seed)?.assetId};sample=!!r?.sample||!!demo;
 for(const k of fields){
  const input=$(k),linked=['cliente','local','equipamento'].includes(k), parent=r??seed;
  input.value=r?.[k]??(k==='data'?today():linked?(seed?.[k]??''):'');
  input.readOnly=linked&&(k==='cliente'?!!linkedContext.clientId:!!linkedContext.assetId||(!r&&!!assetScope))&&typeof parent?.[k]==='string';
  input.setCustomValidity('');
 }
 const context=$('visit-context');context.replaceChildren(pathButton('Clientes',()=>leaveVisit('clients')));
 if(clientScope)context.append(pathButton(clientScope,()=>leaveVisit('assets')));
 if(assetScope&&(r||seed))context.append(pathButton((r??seed).equipamento||'Sem equipamento',()=>leaveVisit('history')));
 context.append(el('strong',r?.os||'Visita'));context.hidden=false;
 $('readings').replaceChildren();$('empty-readings').hidden=false;
 r?.readings.forEach(v=>reading(v));pics=copy(r?.pics??[]);renderPhotos();dirty=false;note('');$('sample-header').hidden=!sample;
 const ck=r?.checklist??{kind:seed?.sample?(seed.id.includes('-hvac-')?'hvac':'electric'):seed?.checklist?.kind??'',values:{}};
 showChecklist(ck.kind,ck.values);$('internal-note').value=r?.internalNote??'';
 $('portal').hidden=true;$('workspace').hidden=false;
 $('edit-title').textContent=draft?'Rascunho da visita':current?'Visita registrada':'Nova visita';
 show(r&&!draft?'final':'edit');window.scrollTo(0,0);

}
function goHistory(next=returnPane,restore=next===returnPane){
 const v=visitReturn;
 $('portal').hidden=false;$('workspace').hidden=true;$('sample-header').hidden=true;dirty=false;current=null;sample=false;draftKey=null;draftSavedAt=0;visitReturn=null;
 setPane(next,true,restore?v:null);
 if(restore&&v?.record)document.querySelector('[data-record="'+v.record+'"]')?.focus({preventScroll:true});
 if(restore&&v?.month)reopenMonth(v.month);
}
function leaveVisit(next){
 if(busy||saving)return;
 if(dirty&&!window.confirm('Voltar sem salvar as alterações desta visita?'))return;
 histNote('');
 if(next==='clients'){clientScope='';assetScope='';}
 if(next==='assets')assetScope='';
 goHistory(next??returnPane,!next||next==='history');
}
async function saveRecord(){
 if(saving||busy||visitMode!=='review')return;
 const d=collect();if(!validateRecord(d))return;
 if(sample){dirty=false;note('PDF de demonstração disponível. Esta visita não foi salva no histórico.');show('final');return;}
 if(!db)return;
 saving=true;$('save-record').disabled=true;$('back-history').disabled=true;
 try{
  const [row]=await setupDirectoryForRows([sanitized({...d,...linkedContext,id:current||crypto.randomUUID()},true)]);await writeDB([row]);records=await readDB();
  let draftWarning='';
  if(draftKey){try{await removeDraft(draftKey);draftKey=null;}catch{draftWarning=' Não consegui remover o rascunho anterior.';}}
  if(!current&&returnPane!=='history'){returnPane='history';clientScope=row.cliente;assetScope=assetKey(row);visitReturn=null;}
  current=row.id;dirty=false;draftSavedAt=0;$('edit-title').textContent='Visita registrada';
  note('Relatório registrado e salvo neste aparelho.'+draftWarning);show('final');
 }
 catch(e){note('Não consegui salvar. '+(e.name==='QuotaExceededError'?'O armazenamento está cheio. Guarde espaço antes de tentar de novo.':e.message));}
 finally{saving=false;$('save-record').disabled=false;$('back-history').disabled=false;}
}
function sanitized(r,withPhotos){
 const d={};
 fields.forEach((k,i)=>{const val=r[k]??'';if(typeof val!=='string'||val.length>limits[i])throw Error('Campo inválido: '+HEAD[i+1]+'.');d[k]=val.trim();});
 if(!d.cliente||!d.local||!dateOK(d.data)||!d.tecnico)throw Error('Preencha cliente, local, data e técnico em cada registro.');
 if(!validId(r.id))throw Error('ID inválido.');
 d.id=r.id;d.sample=false;d.updated=Date.now();
 if(validId(r.clientId))d.clientId=r.clientId;if(validId(r.assetId))d.assetId=r.assetId;
 if(!Array.isArray(r.readings)||r.readings.length>500)throw Error('Medições inválidas ou acima do limite de 500 por visita.');
 d.readings=r.readings.map(m=>{if(!Array.isArray(m)||m.length!==3||m.some((v,i)=>typeof v!=='string'||v.length>[90,32,18][i])||!m[0].trim()||!m[1].trim())throw Error('Confira o item e o valor de cada medição.');return m.map(v=>v.trim());});
 d.checklist=cleanChecklist(r.checklist);
 if(r.internalNote!=null&&(typeof r.internalNote!=='string'||r.internalNote.length>600))throw Error('Nota interna inválida.');
 d.internalNote=(r.internalNote||'').trim();
 d.pics=[];
 if(withPhotos)d.pics=cleanPhotos(r.pics);
 return d;
}
function cleanPhotos(items){
 if(!Array.isArray(items)||items.length>MAX_PHOTOS)throw Error('Lista de fotos inválida.');
 return items.map(p=>{if(!p||typeof p.url!=='string'||p.url.length>4e6||!/^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/]+={0,2}$/.test(p.url)||![p.w,p.h].every(x=>Number.isInteger(x)&&x>0&&x<=1440)||typeof p.caption!=='string'||p.caption.length>140)throw Error('O backup contém uma foto inválida.');return {url:p.url,w:p.w,h:p.h,caption:p.caption};});
}
function cleanDraft(item){
 if(!item||!validId(item.id)||!item.id.startsWith('draft-')||item.type!=='draft'||!item.data||!Number.isFinite(item.updated)||(item.visitId!=null&&!validId(item.visitId)))throw Error('Rascunho inválido.');
 const raw=item.data, data={};
 fields.forEach((k,i)=>{if(typeof raw[k]!=='string'||raw[k].length>limits[i])throw Error('Campo inválido no rascunho.');data[k]=raw[k];});
 if(!Array.isArray(raw.readings)||raw.readings.length>500||raw.readings.some(line=>!Array.isArray(line)||line.length!==3||line.some((v,i)=>typeof v!=='string'||v.length>[90,32,18][i])))throw Error('Medições inválidas no rascunho.');
 if(typeof raw.internalNote!=='string'||raw.internalNote.length>600)throw Error('Nota inválida no rascunho.');
 if(validId(raw.clientId))data.clientId=raw.clientId;if(validId(raw.assetId))data.assetId=raw.assetId;
 return {id:item.id,type:'draft',updated:item.updated,visitId:item.visitId??null,data:{...data,pics:cleanPhotos(raw.pics),readings:raw.readings,checklist:cleanChecklist(raw.checklist),internalNote:raw.internalNote}};
}

function exportXlsx(){
 const book=XLSX.utils.book_new();
 const visit=XLSX.utils.aoa_to_sheet([HEAD,...records.map(r=>[r.id,...fields.map(k=>r[k])])]);
 visit['!cols']=[{wch:38},{wch:32},{wch:26},{wch:12},{wch:25},{wch:26},{wch:17},{wch:35},{wch:48},{wch:48}];
 const meas=XLSX.utils.aoa_to_sheet([MEAS,...records.flatMap(r=>r.readings.map(m=>[r.id,...m]))]);meas['!cols']=[{wch:38},{wch:40},{wch:15},{wch:14}];
 [visit,meas].forEach((s,i)=>{s['!autofilter']={ref:s['!ref']};XLSX.utils.book_append_sheet(book,s,SHEETS[i]);});
 XLSX.utils.book_append_sheet(book,XLSX.utils.aoa_to_sheet([['Como preencher'],['Mantenha os cabeçalhos e os IDs dos registros existentes.'],['Use uma linha por manutenção e o mesmo ID na aba Medições. Para novos registros, use um ID único (letras, números, hífen ou sublinhado).'],['Data: AAAA-MM-DD ou célula de data do Excel.'],['O Excel não leva fotos. Ao importar, as fotos já guardadas para o mesmo ID são mantidas. Use o backup completo também.']]),'Instruções');
 const checks=XLSX.utils.aoa_to_sheet([[...CHECK_HEAD],...records.filter(r=>r.checklist?.kind||r.internalNote).map(r=>[r.id,r.checklist?.kind||'',JSON.stringify(r.checklist?.values||{}),r.internalNote||''])]);
 checks['!cols']=[{wch:38},{wch:18},{wch:32},{wch:64}];XLSX.utils.book_append_sheet(book,checks,'Checklist');
 fileOut('Historico-Duo-'+today()+'.xlsx',XLSX.write(book,{type:'array',bookType:'xlsx',compression:true}),'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}
function rowsOf(book,i,max){
 const sheet=book.Sheets[SHEETS[i]];
 if(!sheet?.['!ref'])throw Error('Aba obrigatória: '+SHEETS[i]+'.');
 const range=XLSX.utils.decode_range(sheet['!ref']);
 if(range.e.r>max||range.e.c>30)throw Error('A planilha ultrapassa o limite de linhas ou colunas.');
 const [hdr,...rows]=XLSX.utils.sheet_to_json(sheet,{header:1,defval:'',raw:true});
 const expected=i===0?HEAD:MEAS;
 if(!hdr||!expected.every((col,j)=>hdr[j]===col))throw Error('Cabeçalhos diferentes do modelo DUO na aba '+SHEETS[i]+'.');
 return rows;
}
function xDate(v){
 if(typeof v==='number'){const d=XLSX.SSF.parse_date_code(v);if(d)return [d.y,String(d.m).padStart(2,'0'),String(d.d).padStart(2,'0')].join('-');}
 const txt=String(v).trim();
 return /^\d{2}\/\d{2}\/\d{4}$/.test(txt)?txt.split('/').reverse().join('-'):txt;
}
const CHECK_HEAD=['ID da manutenção','Tipo','Respostas','Nota interna'];
function xlsxInput(buf){
 const wb=XLSX.read(buf,{type:'array',cellFormula:false,cellHTML:false});
 const base=new Map();
 rowsOf(wb,0,2000).forEach((a,i)=>{
  const id=String(a[0]??'').trim();
  if(!id||base.has(id))throw Error('ID ausente ou duplicado na linha '+(i+2)+' da aba Manutenções.');
  const r=Object.fromEntries(fields.map((k,i)=>[k,k==='data'?xDate(a[i+1]??''):String(a[i+1]??'')]));
  base.set(id,{...r,id,readings:[]});
 });
 rowsOf(wb,1,20000).forEach(a=>{
  const r=base.get(String(a[0]??'').trim());
  if(!r)throw Error('Há uma medição com ID que não existe na aba Manutenções.');
  r.readings.push(a.slice(1,4).map(v=>String(v??'')));
 });
 const extra=wb.Sheets.Checklist;
 if(extra?.['!ref']){
  const range=XLSX.utils.decode_range(extra['!ref']);if(range.e.r>2000||range.e.c>8)throw Error('A aba Checklist excede o limite.');
  const [head,...lines]=XLSX.utils.sheet_to_json(extra,{header:1,defval:'',raw:true,blankrows:false});
  if(!CHECK_HEAD.every((v,i)=>head?.[i]===v))throw Error('Cabeçalhos diferentes do modelo DUO na aba Checklist.');
  const seen=new Set();
  for(const [id,kind,value,note] of lines){const key=String(id).trim(),r=base.get(key);if(!r||seen.has(key))throw Error('ID inválido ou repetido na aba Checklist.');
   seen.add(key);r.checklist={kind:String(kind||''),values:JSON.parse(String(value||'{}'))};r.internalNote=String(note||'');
  }
 }
 return [...base.values()].map(r=>({...sanitized(r,false),keepPreviousChecklist:!extra}));
}
async function verifyImages(incoming){
 for(const r of incoming)for(const p of r.pics){
  const im=new Image();im.src=p.url;
  try{await im.decode();}catch{throw Error('O backup contém uma imagem que não abre.');}
  if(im.naturalWidth!==p.w||im.naturalHeight!==p.h)throw Error('As dimensões de uma foto não conferem.');
 }
}
async function importFile(input,backup){
 const f=input.files[0];input.value='';if(!f||transferring||!db||demo)return;transferring=true;renderHistory();histNote('Conferindo arquivo…');
 try{
  if(f.size>(backup?100:10)*1024*1024)throw Error('Arquivo muito grande para esta versão.');
  let incoming, restoredDirectory=null, restoredDrafts=[];
  if(backup){
   const b=JSON.parse(await f.text());
   if(b?.schema!==schema||!Array.isArray(b.records)||b.records.length>2000)throw Error('Selecione um backup completo exportado pelo Duo Tools.');
   if((b.directory||b.drafts?.length)&&!workDB)throw Error('O navegador não abriu o armazenamento de cadastros e rascunhos.');
   if(b.directory){
    const saved=prepareDirectory(b.directory);if(saved.logo)await verifyImages([{pics:[saved.logo]}]);
    const merge=(a,c)=>[...new Map([...a,...c].map(x=>[x.id,x])).values()];
    restoredDirectory=prepareDirectory({...saved,provider:saved.provider||directory.provider,logo:saved.provider?saved.logo:directory.logo,clients:merge(directory.clients,saved.clients),assets:merge(directory.assets,saved.assets)});
   }
   if(b.drafts!==undefined){if(!Array.isArray(b.drafts)||b.drafts.length>1000)throw Error('Lista de rascunhos inválida.');restoredDrafts=b.drafts.map(cleanDraft);}
   incoming=b.records.map(r=>sanitized(r,true));await verifyImages([...incoming,...restoredDrafts.map(d=>d.data)]);
  }else incoming=xlsxInput(await f.arrayBuffer());
  if(!incoming.length&&!restoredDirectory&&!restoredDrafts.length){histNote('O arquivo não contém dados para importar.');return;}
  if(new Set(incoming.map(r=>r.id)).size!==incoming.length)throw Error('O arquivo contém IDs duplicados.');
  const map=new Map((await readDB()).map(r=>[r.id,r]));
  const matches=incoming.filter(r=>map.has(r.id)).length;
  const msg=matches+' registro(s) com o mesmo ID serão atualizados. Os outros registros do navegador ficam como estão. '+(backup?'Para esses IDs, as fotos serão restauradas do backup.':'As fotos já salvas para esses IDs serão mantidas.');
  if((matches||restoredDirectory||restoredDrafts.length)&&!window.confirm(msg+((restoredDirectory||restoredDrafts.length)?' Cadastros e rascunhos do backup também serão mesclados pelo ID.':''))){histNote('Importação cancelada.');return;}
  if(!backup)incoming.forEach(r=>{const saved=map.get(r.id);r.pics=saved?.pics??[];if(r.keepPreviousChecklist&&saved){r.checklist=saved.checklist??r.checklist;r.internalNote=saved.internalNote??r.internalNote;}delete r.keepPreviousChecklist;});
  if(restoredDirectory||restoredDrafts.length){
   await workStorage('readwrite',store=>{
    let req;
    if(restoredDirectory)req=store.put(restoredDirectory);
    for(const d of restoredDrafts)req=store.put(d);
    return req;
   });
   if(restoredDirectory)directory=restoredDirectory;
   if(restoredDrafts.length)await loadDrafts();
  }
  if(incoming.length)await writeDB(await setupDirectoryForRows(incoming));records=await readDB();historyPage=0;$('search').value='';histNote(incoming.length+' visita(s) importada(s).'+(restoredDirectory||restoredDrafts.length?' Cadastros e rascunhos do backup processados.':''));
 }catch(e){histNote('Não foi possível importar. '+(e instanceof SyntaxError?'O arquivo está inválido ou incompleto.':e.message));}
 finally{transferring=false;renderHistory();}
}
function setupHistory(){
 $('blank').onclick=()=>openRecord(null,catalogRows().find(r=>r._empty&&!r._clientOnly&&assetKey(r)===assetScope)??scopedRows()[0]);
 $('new-first-visit').onclick=()=>editCatalog('client');
 $('new-client-visit').onclick=()=>editCatalog('asset');
 $('catalog-close').onclick=()=>$('catalog-dialog').close();
 $('catalog-form').onsubmit=submitCatalog;
 $('edit-provider').onclick=()=>{$('transfer').close();editCatalog('provider');};
 $('manage-data').onclick=()=>$('transfer').showModal();
 $('close-data').onclick=()=>$('transfer').close();
 $('search').oninput=()=>{historyPage=0;renderHistory();};
 for(const [id,delta] of [['prev-page',-1],['next-page',1]])$(id).onclick=()=>{historyPage+=delta;renderHistory();if($(id).disabled)$(delta>0?'prev-page':'next-page').focus();};
 $('back-history').onclick=()=>leaveVisit();
 $('save-record').onclick=saveRecord;
 $('save-draft').onclick=saveDraft;
 $('draft-open').onclick=()=>{$('draft-dialog-status').textContent='';renderDraftList();$('draft-dialog').showModal();};
 $('draft-close').onclick=()=>$('draft-dialog').close();
 const auxiliary=openWorkDB().then(async base=>{workDB=base;await loadDrafts();await loadDirectory();}).catch(()=>{workDB=null;});
 $('export-xlsx').onclick=()=>{try{exportXlsx();histNote('Excel gerado. As fotos não acompanham a planilha.');}catch{histNote('Não consegui gerar o Excel.');}};
 $('export-backup').onclick=()=>{try{fileOut('Backup-Completo-Duo-'+today()+'.json',JSON.stringify({schema,records:records.map(r=>({...r,clientId:resolveClient(r)?.id,assetId:resolveAsset(r)?.id})),directory,drafts:savedDrafts}),'application/json');histNote('Backup completo gerado. Guarde o arquivo em local seguro.');}catch{histNote('Não consegui gerar o backup.');}};
 for(const [kind,b] of [['xlsx',false],['backup',true]]){$('import-'+kind).onclick=()=>$('file-'+kind).click();$('file-'+kind).onchange=e=>importFile(e.target,b);}
 openDB().then(async x=>{db=x;records=await readDB();await auxiliary;try{await setupDirectoryForRows(records);}catch(e){console.warn(e);}dbLoading=false;initialDemo();renderHistory();dispatchEvent(new Event('duo-sitelog:ready'));}).catch(()=>{db=null;dbLoading=false;initialDemo();histNote('O navegador bloqueou o armazenamento local. Experimente abrir a página numa janela normal do navegador.');renderHistory();dispatchEvent(new Event('duo-sitelog:ready'));});
}
if(typeof document!=='undefined')setupHistory();

