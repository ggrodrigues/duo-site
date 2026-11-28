'use strict';
(() => {
 const root=$('guided-tour'), panel=root.querySelector('.guided-panel'), halo=root.querySelector('.guided-halo');
 const finish=$('guided-finish');
 const tips={
  clients:[1,'cliente','Escolha um cliente','Toque no cartão do cliente para ver os equipamentos que você atende.','#clients-list .catalog-item'],
  assets:[2,'equipamento','Abra um equipamento','Toque no cartão para abrir o histórico de visitas dessa máquina.','#assets-list .catalog-item'],
  history:[3,'visita','Comece um novo registro','Toque em Registrar visita. O cliente e o equipamento já vêm preenchidos.','#blank'],
  identify:[4,'visita','Identifique a visita','Confira os dados da visita e informe o técnico responsável. Depois toque em Próximo.','.editor-ident'],
  services:[4,'visita','Conte o que foi feito','Descreva o serviço executado. Pode usar um texto fictício se estiver na base de exemplo.','.editor-services'],
  evidence:[5,'visita','Acrescente evidências','Se quiser, adicione medições, fotos ou um checklist. Você pode seguir sem preencher esses itens.','.editor-readings'],
  reviewAction:[6,'relatorio','Abra a revisão','Toque em Revisar visita para conferir o que vai para o relatório.','#review-btn'],
  review:[7,'relatorio','Confira e conclua','Confira a prévia. Quando estiver pronto, toque em Concluir visita ou em Gerar PDF de exemplo, conforme a base.','#save-record'],
  final:[8,'relatorio','Baixe o relatório','Toque em Baixar PDF para baixar o relatório desta visita e terminar o tutorial.','#visit-export']
 };
 let active=false, key='', target=null, frame=0, editTip='identify';
 function shown(selector){const node=document.querySelector(selector);return node?.getClientRects().length?node:null;}
 function state(){
  if(!$('workspace').hidden)return visitMode==='final'?'final':visitMode==='review'?'review':editTip;
  if(pane==='history')return 'history';
  if(pane==='assets')return 'assets';
  return 'clients';
 }
 function layout(){
  if(!active)return;
  const p=panel.getBoundingClientRect();
  document.body.style.setProperty('--guided-space',Math.ceil(innerHeight-p.top+16)+'px');
  if(!target?.isConnected||document.querySelector('dialog[open]')){halo.hidden=true;return;}
  const r=target.getBoundingClientRect(),top=Math.max(4,r.top-4),left=Math.max(4,r.left-4);
  const bottom=Math.min(innerHeight-5,p.top-7,r.bottom+4),right=Math.min(innerWidth-4,r.right+4);
  halo.hidden=bottom<=top||right<=left;
  Object.assign(halo.style,{left:left+'px',top:top+'px',width:Math.max(0,right-left)+'px',height:Math.max(0,bottom-top)+'px'});
 }
 function reveal(){
  if(!target||document.querySelector('dialog[open]'))return;
  const r=target.getBoundingClientRect(),limit=panel.getBoundingClientRect().top-12;
  if(r.top>=12&&r.bottom<=limit)return;
  const goal=Math.max(10,(limit-Math.min(r.height,limit-22))/2);
  window.scrollBy({top:r.top-goal,behavior:'instant'});
 }
 function refresh(force=false){
  if(!active)return;
  const next=state(),changed=next!==key;key=next;
  const [step,art,title,tip,selector]=tips[key];
  const found=shown(selector);
  target=found??(key==='clients'?shown('#new-first-visit'):key==='assets'?shown('#new-client-visit'):null);
  const empty=(key==='clients'||key==='assets')&&!found;
  const message=empty?(key==='clients'?'Você pode cadastrar um cliente ou usar a base de exemplo para praticar sem alterar seus dados.':'Cadastre um equipamento deste cliente ou use a base de exemplo para continuar.'):tip;
  $('guided-example').hidden=!empty||!!demo;
  $('guided-prev').hidden=!['services','evidence','reviewAction'].includes(key);
  $('guided-next').hidden=!['identify','services','evidence'].includes(key);
  if($('guided-title').textContent!==title){
   $('guided-art').src='assets/abertura/'+art+'.webp';$('guided-title').textContent=title;
   $('guided-progress').textContent='Etapa '+step+' de 8';
  }
  if($('guided-text').textContent!==message)$('guided-text').textContent=message;
  layout();if(changed||force)reveal();layout();
 }
 function queue(){if(!active)return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>refresh());}
 window.isGuidedVisitActive=()=>active;
 window.startGuidedVisit=()=>{
  if(active)return;
  active=true;key='';editTip='identify';root.hidden=false;document.body.classList.add('has-guided-visit');refresh(true);
 };
 window.stopGuidedVisit=()=>{
  if(!active)return;
  const focused=root.contains(document.activeElement);
  active=false;cancelAnimationFrame(frame);root.hidden=true;document.body.classList.remove('has-guided-visit');document.body.style.removeProperty('--guided-space');
  if(focused){const focus=target?.matches('button,input,textarea')?target:target?.querySelector('button,input,textarea');(focus??($('workspace').hidden?$('portal-guide'):$('visit-guide'))).focus({preventScroll:true});}
  target=null;
 };
 function moveTip(delta){
  const edit=['identify','services','evidence','reviewAction'], i=edit.indexOf(editTip);
  if(i+delta<0||i+delta>=edit.length)return;
  editTip=edit[i+delta];refresh(true);
  if(editTip==='reviewAction')$('review-btn').focus({preventScroll:true});
  else (delta===1?$('guided-next'):$('guided-prev').hidden?$('guided-next'):$('guided-prev')).focus({preventScroll:true});
 }
 $('guided-example').onclick=()=>selectCompany('hvac');
 $('guided-next').onclick=()=>moveTip(1);
 $('guided-prev').onclick=()=>moveTip(-1);
 $('guided-skip').onclick=()=>stopGuidedVisit();
 addEventListener('sitelog:view',()=>{
  if(!active)return;
  if($('workspace').hidden)editTip='identify';
  queue();
 });
 $('guided-finish-home').onclick=()=>{
  finish.close();
  leaveVisit('clients');
 };
 addEventListener('sitelog:pdf-generated',()=>{
  if(!active)return;
  stopGuidedVisit();
  const key='duo-sitelog-guided-pdf-v1';
  let first=true;
  try{first=!localStorage.getItem(key);localStorage.setItem(key,'1');}catch{}
  $('guided-finish-title').textContent=first?'Parabéns! Seu primeiro PDF está pronto.':'Parabéns! Seu PDF está pronto.';
  finish.showModal();
 });
 addEventListener('scroll',layout,{passive:true});
 addEventListener('resize',()=>{if(active)refresh(true);});
 document.addEventListener('close',layout,true);
 const observer=new ResizeObserver(layout);observer.observe(panel);
})();
