'use strict';
// Sidecar database: older releases can still open the unchanged visits database.
let workDB=null, savedDrafts=[], draftKey=null,draftSavedAt=0;
function openWorkDB(){
 return new Promise((resolve,reject)=>{
  const req=indexedDB.open('duo-visitas-workspace',1);
  req.onupgradeneeded=()=>req.result.createObjectStore('state',{keyPath:'id'});
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  req.onblocked=()=>reject(Error('Base auxiliar ocupada.'));
 });
}
function workStorage(mode,operation){
 return new Promise((resolve,reject)=>{
  if(!workDB){reject(Error('O armazenamento local não está disponível.'));return;}
  const tx=workDB.transaction('state',mode),req=operation(tx.objectStore('state'));
  tx.oncomplete=()=>resolve(req.result);
  tx.onabort=()=>reject(tx.error||Error('Operação cancelada.'));
 });
}
async function loadDrafts(){
 savedDrafts=(await workStorage('readonly',s=>s.getAll())).filter(x=>x.type==='draft');
}
function renderDraftList(){
 const list=$('draft-list');list.replaceChildren();
 if(!savedDrafts.length)list.append(el('p','Nenhum rascunho neste navegador.','small'));
 for(const item of [...savedDrafts].sort((a,b)=>b.updated-a.updated)){
  const row=el('div',undefined,'month-row draft-row');
  const label=item.data.objetivo||item.data.equipamento||'Visita sem título';
  const info=el('div');info.append(el('strong',label),el('p',[item.data.cliente,item.data.os].filter(Boolean).join(' · '),'small'));
  const resume=action('Retomar',()=>{$('draft-dialog').close();openRecord(item.data,null,item);});
  const remove=action('Descartar',async()=>{
   if(!window.confirm('Descartar este rascunho? Visitas já registradas não serão afetadas.'))return;
   remove.disabled=true;
   try{await removeDraft(item.id);renderDraftList();renderHistory();$('draft-close').focus();}
   catch(e){$('draft-dialog-status').textContent=e.message;remove.disabled=false;}
  });
  row.append(info,resume,remove);list.append(row);
 }
}
async function removeDraft(id){
 if(!id)return;
 await workStorage('readwrite',s=>s.delete(id));savedDrafts=savedDrafts.filter(x=>x.id!==id);
}
function markEdited(){
 dirty=true;paintDraftStatus();
 if($('notice').textContent.startsWith('Rascunho salvo'))note('');
}
function paintDraftStatus(){
 const label=$('save-label');
 if(!label)return;
 label.hidden=sample;
 if(sample)return;
 if(dirty)label.textContent='Alterações não salvas';
 else if(draftSavedAt)label.textContent='Rascunho salvo neste aparelho às '+new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit'}).format(draftSavedAt);
 else label.textContent='Armazenamento local';
}
function draftData(){
 const d=collect();return {...d,...linkedContext,pics:copy(d.pics)};
}
function reconcileDraft(snapshot, currentData){
 const unchanged=JSON.stringify(snapshot)===JSON.stringify(currentData);dirty=!unchanged;return unchanged;
}
async function saveDraft(){
 if(sample||!workDB||saving||busy)return;
 saving=true;$('save-draft').disabled=true;
 const id=draftKey||'draft-'+(current||crypto.randomUUID());
 try{
  const entry={id,type:'draft',updated:Date.now(),visitId:current,data:draftData()};
  await workStorage('readwrite',s=>s.put(entry));draftKey=id;
  savedDrafts=[...savedDrafts.filter(x=>x.id!==id),entry];draftSavedAt=entry.updated;
  if(reconcileDraft(entry.data,draftData()))note('Rascunho salvo neste aparelho. Abra Rascunhos para retomar.');
  else note('Rascunho salvo, mas ainda há alterações não salvas. Salve novamente para incluí-las.');
  paintDraftStatus();
 }catch(e){note('Não consegui salvar o rascunho. '+(e.name==='QuotaExceededError'?'O armazenamento está cheio.':e.message));}
 finally{saving=false;$('save-draft').disabled=false;}
}
