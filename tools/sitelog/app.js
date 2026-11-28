'use strict';
const $ = id => document.getElementById(id);
const fields = ['cliente','local','data','tecnico','equipamento','os','objetivo','servicos','pendencias'];
const pairs = [['Cliente','cliente'],['Local','local'],['Data','data'],['Técnico responsável','tecnico'],['Equipamento','equipamento'],['Ordem de serviço','os']];
const MAX_PHOTOS=8;
const examples={
 hvac:{data:{cliente:'Parque Comercial Aruana (fictício)',local:'Bloco B · Sala de reuniões',data:'2026-11-18',tecnico:'Luana Silva (personagem fictícia)',equipamento:'Split cassete · AC-07',os:'OS-031',objetivo:'Manutenção preventiva trimestral',servicos:'Limpamos os filtros e a bandeja. Verificamos a drenagem e registramos as temperaturas de insuflamento e retorno após estabilização.',pendencias:'Avaliar a troca do filtro na próxima visita. A equipe de manutenção ficou responsável pela cotação.'},readings:[['Temperatura de retorno','24,8','°C'],['Temperatura de insuflamento','14,1','°C']],captions:['Ilustração: equipamento AC-07.','Ilustração: leitura de temperatura após o serviço.']},
 electric:{data:{cliente:'Centro Logístico Samaúma (fictício)',local:'Unidade 2 · Sala elétrica',data:'2026-11-20',tecnico:'Rafael Alves (personagem fictício)',equipamento:'Subestação · Painel SE-02',os:'OS-058',objetivo:'Inspeção programada e registro de resultados',servicos:'Registramos a identificação do painel e anexamos os resultados do ensaio. Conferimos as etiquetas dos circuitos no quadro e documentamos a pendência encontrada.',pendencias:'Repor a etiqueta do circuito auxiliar. Encaminhar resultados para análise do responsável técnico.'},readings:[['Resistência de isolamento · circuito A','84','MΩ'],['Temperatura registrada no painel','36,5','°C']],captions:['Ilustração: identificação do painel SE-02.','Ilustração: instrumento usado para registrar a leitura.']}
};
let pics=[], sample=false, dirty=false, busy=false, visitMode='edit',readingSerial=0;
function el(tag,txt,cls){const n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;if(cls)n.className=cls;return n;}
function note(txt){$('notice').textContent=txt;$('notice').hidden=!txt;}
function brdate(v){return /^\d{4}-\d\d-\d\d$/.test(v)?v.split('-').reverse().join('/'):v;}
function today(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
function reading(values=['','',''],focus=false){
 const row=el('div',undefined,'reading'),serial=++readingSerial;
 ['Item','Valor','Unidade'].forEach((name,i)=>{const label=el('label',name);const input=el('input');input.id='medicao-'+serial+'-'+['item','valor','unidade'][i];input.maxLength=[90,32,18][i];input.value=values[i];if(i===1)input.inputMode='decimal';if(i===2)input.placeholder='Ex.: °C';input.addEventListener('input',()=>input.setCustomValidity(''));label.append(input);row.append(label);});
 const btn=el('button','×','remove');btn.type='button';btn.setAttribute('aria-label','Remover medição');btn.onclick=()=>{row.remove();markEdited();$('empty-readings').hidden=!!$('readings').children.length;$('add-reading').focus();};row.append(btn);
 $('readings').append(row);$('empty-readings').hidden=true;if(focus)row.querySelector('input').focus();
}
function renderPhotos(){
 $('photos').replaceChildren();$('empty-photos').hidden=pics.length>0;
 pics.forEach((p,i)=>{const row=el('div',undefined,'photo');const im=el('img');im.src=p.url;im.alt='';const label=el('label','Legenda da foto '+(i+1));const input=el('input');input.maxLength=140;input.value=p.caption;input.oninput=()=>{p.caption=input.value;markEdited();};label.append(input);
 const btn=el('button','×','remove');btn.type='button';btn.setAttribute('aria-label','Remover foto '+(i+1));btn.onclick=()=>{pics.splice(i,1);markEdited();renderPhotos();$('gallery-button').focus();};row.append(im,label,btn);$('photos').append(row);});
}
function art(kind,i,caption){
 const c=document.createElement('canvas');c.width=600;c.height=340;const g=c.getContext('2d');g.fillStyle='#deebf6';g.fillRect(0,0,600,340);g.fillStyle='#a6bfd5';g.fillRect(0,275,600,65);
 g.lineWidth=7;g.strokeStyle='#234866';g.fillStyle='#f8fbff';g.beginPath();g.roundRect(165,55,270,210,14);g.fill();g.stroke();
 if(i){g.fillStyle='#0b2a4a';g.fillRect(204,86,190,64);g.fillStyle='#98ded0';g.font='bold 33px system-ui';g.fillText(kind==='hvac'?'14,1 °C':'84 MΩ',230,128);g.fillStyle='#f2622d';g.beginPath();g.arc(302,194,21,0,Math.PI*2);g.fill();}
 else if(kind==='hvac'){g.fillStyle='#234866';for(let j=0;j<9;j++)g.fillRect(202,86+j*15,196,6);g.fillStyle='#f2622d';g.fillRect(378,230,20,9);}
 else{g.strokeRect(203,91,194,119);g.fillStyle='#0b2a4a';g.font='bold 29px system-ui';g.fillText('SE-02',248,162);g.fillStyle='#f2622d';g.fillRect(356,182,20,10);}
 return {url:c.toDataURL('image/jpeg',.85),w:c.width,h:c.height,caption};
}
function reset(key){
 if(busy)return;
 if(dirty&&!window.confirm('Substituir o relatório atual? Baixe o PDF antes se quiser guardar os dados.'))return;
 sample=!!key;const e=examples[key];fields.forEach(id=>$(id).value=e?.data[id]??(id==='data'?today():''));
 $('readings').replaceChildren();$('empty-readings').hidden=false;
 e?.readings.forEach(x=>reading(x));
 pics=e?e.captions.map((v,i)=>art(key,i,v)):[];renderPhotos();
 dirty=false;show('edit',false);note(e?'Exemplo carregado. O PDF será identificado como amostra.':'');$('cliente').focus();
}
async function convert(file){
 const url=URL.createObjectURL(file);
 try{const im=new Image();im.src=url;await im.decode();if(!im.naturalWidth||!im.naturalHeight)throw Error('Imagem vazia');
 const scale=Math.min(1,1440/Math.max(im.naturalWidth,im.naturalHeight));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.naturalWidth*scale));c.height=Math.max(1,Math.round(im.naturalHeight*scale));
 const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(im,0,0,c.width,c.height);
 return {url:c.toDataURL('image/jpeg',.84),w:c.width,h:c.height,caption:''};}
 finally{URL.revokeObjectURL(url);}
}
async function addPhotos(input){
 if(busy)return;const fs=Array.from(input.files);input.value='';if(!fs.length)return;
 busy=true;document.querySelectorAll('[data-export],#camera-button,#gallery-button').forEach(b=>b.disabled=true);
 const room=MAX_PHOTOS-pics.length;let failed=0;
 try{for(const f of fs.slice(0,room)){try{if(f.size>30*1024*1024)throw Error('Tamanho');pics.push(await convert(f));markEdited();}catch{failed++;}}
 renderPhotos();note([fs.length>room?'Limite de 8 fotos por relatório.':'',failed?'Não consegui abrir '+failed+' foto(s). Use JPG ou PNG de até 30 MB.':''].filter(Boolean).join(' '));}
 finally{busy=false;document.querySelectorAll('[data-export],#camera-button,#gallery-button').forEach(b=>b.disabled=false);}
}
function collect(){
 const d=Object.fromEntries(fields.map(k=>[k,$(k).value.trim()]));
 d.readings=Array.from($('readings').children).map(row=>Array.from(row.querySelectorAll('input'),x=>x.value.trim())).filter(row=>row.some(Boolean));d.pics=pics;d.sample=sample;d.checklist=readChecklist();d.checkLines=checklistLines(d.checklist);d.internalNote=$('internal-note').value.trim();return d;
}
function reviewHeading(target,title){
 const h=el('div',undefined,'review-section-title');h.append(el('h4',title));
 if(visitMode==='review'){
  const b=el('button','Editar');b.type='button';b.setAttribute('aria-label','Editar '+title);
  b.onclick=()=>{if(saving)return;show('edit',false);scrollToField(target);};h.append(b);
 }
 return h;
}
function scrollToField(id){
 const field=$(id);
 field.scrollIntoView({block:'center',behavior:'instant'});
 field.focus({preventScroll:true});
}
function photoChecklistMismatch(r){
 const kind=r.checklist?.kind;
 return !!kind&&r.checklist?.values?.[3]==='OK'&&!r.pics?.length;
}
function drawPreview(d){
 const paper=$('paper');paper.replaceChildren(el('h3','Relatório de visita técnica'));
 const grid=el('div',undefined,'grid');
 pairs.forEach(([label,key])=>{if(d[key]){const p=el('p');p.append(el('strong',label+': '),document.createTextNode(key==='data'?brdate(d[key]):d[key]));grid.append(p);}});
 if(grid.children.length)paper.append(reviewHeading('cliente','Identificação'),grid);
 for(const [key,title] of [['objetivo','Objetivo'],['servicos','Serviços executados'],['pendencias','Pendências e próximos passos']]){
  if(d[key])paper.append(reviewHeading(key,title),el('p',d[key]));
 }
 if(photoChecklistMismatch(d)){
  const warning=el('div',undefined,'review-warning');warning.append(el('p','O checklist indica foto conferida, mas nenhuma foi anexada.','small'));
  if(visitMode==='review'){const add=el('button','Anexar foto');add.type='button';add.onclick=()=>{if(saving)return;show('edit',false);scrollToField('gallery-button');};warning.append(add);}
  paper.append(warning);
 }
 if(d.checkLines?.length){const list=el('ul');d.checkLines.forEach(line=>list.append(el('li',line)));paper.append(reviewHeading('check-kind','Checklist'),list);}
 if(d.readings.length){paper.append(reviewHeading('add-reading','Medições'));const table=el('table');const head=table.createTHead().insertRow();['Item','Valor','Unidade'].forEach(x=>{const th=el('th',x);th.scope='col';head.append(th);});const t=table.createTBody();d.readings.forEach(r=>{const row=t.insertRow();r.forEach(v=>row.insertCell().textContent=v||'—');});paper.append(table);}
 if(d.pics.length){paper.append(reviewHeading('camera-button','Fotos'));const gal=el('div',undefined,'gallery');d.pics.forEach((p,i)=>{const fig=el('figure');const img=el('img');img.src=p.url;img.alt='Foto '+(i+1);fig.append(img,el('figcaption',p.caption||'Foto '+(i+1)));gal.append(fig);});paper.append(gal);}
 if(!d.cliente&&!d.local&&!d.tecnico&&!d.servicos&&!d.readings.length&&!d.pics.length)paper.append(el('p','Volte em Editar para preencher os dados da visita.'));
}
function show(view,focus=true){
 const final=view==='final', review=view==='review', edit=!final&&!review;
 visitMode=view;
 $('editor').hidden=!edit;$('review').hidden=edit;$('review-btn').hidden=!edit;$('save-record').hidden=!review;$('visit-export').hidden=!final;
 $('save-draft').hidden=final||sample||!workDB;
 $('edit-visit').hidden=!final;
 $('review-title').textContent=final?'Relatório da visita':'Revise antes de concluir';
 $('visit-stage').textContent=final?'Relatório registrado':(review?'Revisão':'Preenchimento');
 $('validation-summary').hidden=true;
 paintDraftStatus();
 if(!edit){drawPreview(collect());if(focus)$('review-title').focus();}
 else if(focus)scrollToField($('cliente').readOnly?'tecnico':'cliente');
 dispatchEvent(new Event('sitelog:view'));
}
const winAnsi={'Ω':'Ohm','μ':'µ','–':'\x96','—':'\x97','‘':'\x91','’':'\x92','“':'\x93','”':'\x94','…':'\x85','•':'\x95','€':'\x80'};
function pdfText(s){
 let out='';for(const raw of String(s).normalize('NFC')){const safe=winAnsi[raw]??raw;for(const c of safe){const n=c.charCodeAt(0);out+=n<32||n>255?'3F':n.toString(16).padStart(2,'0');}}
 return '<'+out+'>';
}
function makePdf(d,measure){
 const enc=new TextEncoder();const bytes=s=>enc.encode(s);
 const join=(...xs)=>{const b=new Uint8Array(xs.reduce((n,x)=>n+x.length,0));let o=0;for(const x of xs){b.set(x,o);o+=x.length;}return b;};
 const n=x=>Number(x).toFixed(2);
 const W=595.28,H=841.89,L=38,R=557.28,T=54;
 const objects=[null,null,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'];
 const push=o=>objects.push(o);
 const stream=(b,dict='')=>join(bytes('<< /Length '+b.length+' '+dict+' >>\nstream\n'),b,bytes('\nendstream'));
 const pages=[];let p,y;const title=d.inventory?'Relatório de equipamentos':d.monthly?'Relatório mensal do equipamento':'Relatório de visita técnica';
 function rect(x,y,w,h,col){p.cmd+=col+' rg '+[x,H-y-h,w,h].map(n).join(' ')+' re f\n';}
 function txt(s,x,y,sz=11,b=false,col='.043 .165 .29'){p.cmd+='BT /F'+(b?'2':'1')+' '+sz+' Tf '+col+' rg 1 0 0 1 '+n(x)+' '+n(H-y)+' Tm '+pdfText(s)+' Tj ET\n';}
 function jpeg(im,x,top,w,h){
  const bin=Uint8Array.from(atob(im.url.split(',')[1]),v=>v.charCodeAt(0));
  const id=push(stream(bin,'/Type /XObject /Subtype /Image /Width '+im.w+' /Height '+im.h+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode'));
  const name='I'+id;p.images.push('/'+name+' '+id+' 0 R');
  p.cmd+='q '+n(w)+' 0 0 '+n(h)+' '+n(x)+' '+n(H-top-h)+' cm /'+name+' Do Q\n';
 }
 function next(){p={cmd:'',images:[]};pages.push(p);rect(L,34,R-L,3,'0.95 .38 .18');
  let textX=L;
  if(d.logo){const k=Math.min(88/d.logo.w,22/d.logo.h);const w=d.logo.w*k,h=d.logo.h*k;jpeg(d.logo,L,41+(22-h)/2,w,h);textX+=w+8;}
  const brand=(d.provider||'DUO SOLUÇÕES / DUO TOOLS').toUpperCase();
  const nameLines=wrap(brand,R-textX-4,9,true);
  nameLines.forEach((line,i)=>txt(line,textX,T+i*11,9,true));y=Math.max(78,T+nameLines.length*11+7);
  if(pages.length===1){txt(title,L,y,d.monthly?21:23,true);y+=24;}
  if(d.sample){txt('AMOSTRA · Dados fictícios',L,y,10,true,'.60 .22 .07');y+=17;}
 }
 function room(h){if(y+h>H-59)next();}
 function wrap(s,w,sz=11,b=false){
  const result=[];const fits=t=>measure(t,sz,b)<=w;
  for(const para of String(s).replace(/\t/g,' ').split('\n')){
   let line='';
   for(let word of para.trim().split(/\s+/)){
    if(!word)continue;
    const trial=line?line+' '+word:word;if(fits(trial)){line=trial;continue;}
    if(line){result.push(line);line='';}
    let part='';for(const ch of word){if(part&&!fits(part+ch)){result.push(part);part='';}part+=ch;}line=part;
   }
   result.push(line);
  }return result;
 }
 function head(t){room(47);rect(L,y-10,R-L,18,'.90 .94 .97');txt(t,L+7,y+3,11,true);y+=27;}
 function body(s){for(const x of wrap(s,R-L-10)){room(16);txt(x,L+5,y);y+=15;}y+=8;}
 function writeVisit(d){
 head('Identificação');
 for(const [name,k] of pairs){if(d[k])body(name+': '+(k==='data'?brdate(d[k]):d[k]));}
 for(const [id,title] of [['objetivo','Objetivo'],['servicos','Serviços executados'],['pendencias','Pendências e próximos passos']]){if(d[id]){head(title);body(d[id]);}}
 if(d.checkLines?.length){head('Checklist');for(const line of d.checkLines)body(line);}
 if(photoChecklistMismatch(d))body('A foto foi marcada como OK no checklist, mas não foi anexada.');
 if(d.readings.length){
  const hdr=()=>{rect(L,y-11,R-L,18,'.95 .97 .99');txt('Item',L+5,y,10,true);txt('Valor',L+315,y,10,true);txt('Unidade',L+439,y,10,true);y+=17;};
  head('Medições');hdr();
  for(const r of d.readings){
   const lines=[wrap(r[0]||'—',297),wrap(r[1]||'—',112),wrap(r[2]||'—',70)];const h=Math.max(...lines.map(v=>v.length))*15+4;
   if(y+h>H-59){next();head('Medições · continuação');hdr();}
   lines.forEach((col,i)=>col.forEach((x,j)=>txt(x,L+[5,315,439][i],y+j*15)));
   y+=h;rect(L,y-9,R-L,.55,'.76 .81 .86');
  }y+=8;
 }
 if(d.pics.length){
  d.pics.forEach((im,i)=>{
   const scale=Math.min((R-L-10)/im.w,220/im.h);
   const w=im.w*scale,h=im.h*scale, cap=wrap((i+1)+'. '+(im.caption||'Foto'),R-L-10,10);
   if(i===0){room(h+cap.length*14+50);head('Fotos');}
   else if(y+h+cap.length*14+15>H-59){next();head('Fotos · continuação');}
   jpeg(im,L+5,y,w,h);y+=h+13;
   cap.forEach(line=>{txt(line,L+5,y,10);y+=14;});y+=9;
  });
 }
 }
 next();
 if(d.inventory){
  head('Cliente');body(d.cliente);body(d.inventory.length+' equipamento(s) com visitas registradas');
  for(const entry of d.inventory){
   head('Equipamento');body(entry.name);body('Local: '+entry.local);body(entry.count?'Visitas: '+entry.count+' · Última: '+brdate(entry.date):'Ainda sem visitas.');
   if(entry.pending)body('Última pendência registrada: '+entry.pending);
  }
 }else if(d.monthly){
  head('Resumo do período');body('Cliente: '+d.cliente);body('Local: '+d.local);body('Equipamento: '+d.equipamento);body('Competência: '+d.period);
  body(d.visits.length+' visita(s)');head('Visitas e avisos de preenchimento');d.summary.forEach(body);
  for(const visit of d.visits){next();head('Visita · '+brdate(visit.data));writeVisit(visit);}
 }else writeVisit(d);
 const refs=[];
 pages.forEach((page,i)=>{
  p=page;rect(L,H-42,R-L,.6,'.76 .81 .86');txt(title,L,H-26,9);txt((i+1)+' / '+pages.length,R-29,H-26,9);
  const content=push(stream(bytes(p.cmd)));refs.push(push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+W+' '+H+'] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> /XObject << '+p.images.join(' ')+' >> >> /Contents '+content+' 0 R >>'));
 });
 objects[0]='<< /Type /Catalog /Pages 2 0 R >>';objects[1]='<< /Type /Pages /Count '+refs.length+' /Kids ['+refs.map(x=>x+' 0 R').join(' ')+'] >>';
 const chunks=[bytes('%PDF-1.4\n%'),new Uint8Array([226,227,207,211]),bytes('\n')];let len=chunks.reduce((a,b)=>a+b.length,0);const offsets=[];
 objects.forEach((obj,i)=>{offsets.push(len);const c=join(bytes((i+1)+' 0 obj\n'),typeof obj==='string'?bytes(obj):obj,bytes('\nendobj\n'));chunks.push(c);len+=c.length;});
 chunks.push(bytes('xref\n0 '+(objects.length+1)+'\n0000000000 65535 f \n'+offsets.map(v=>String(v).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size '+(objects.length+1)+' /Root 1 0 R >>\nstartxref\n'+len+'\n%%EOF\n'));
 return join(...chunks);
}
function validateRecord(d){
 const form=$('editor');const rows=Array.from($('readings').children);
 const required=['cliente','local','data','tecnico'];
 required.forEach(id=>$(id).setCustomValidity(d[id]?'':'Preencha este campo.'));
 for(const row of rows){const [item,value,unit]=row.querySelectorAll('input');item.setCustomValidity('');value.setCustomValidity('');
  if([item,value,unit].some(x=>x.value.trim())){
   if(!item.value.trim())item.setCustomValidity('Informe o item medido.');
   if(!value.value.trim())value.setCustomValidity('Informe o valor medido.');
  }}
 if(!form.checkValidity()){
  show('edit',false);
  const summary=$('validation-summary');summary.replaceChildren(el('strong','Confira os campos antes de continuar.'));
  const errors=el('ul');
  [...form.querySelectorAll('input:invalid,textarea:invalid,select:invalid')].forEach(input=>{
   const row=input.closest('.reading'),label=input.labels?.[0]?.textContent?.trim()||'Campo';
   const entry=el('li'),link=el('a',row?'Medição '+(rows.indexOf(row)+1)+' · '+label:label);
   link.href=input.id?'#'+input.id:'#editor';
   link.onclick=e=>{e.preventDefault();input.scrollIntoView({block:'center',behavior:'instant'});input.focus({preventScroll:true});};
   entry.append(link,document.createTextNode(': '+input.validationMessage));errors.append(entry);
  });
  summary.append(errors);summary.hidden=false;summary.focus();return false;
 }
 return true;
}
function download(){
 if(busy||visitMode!=='final')return;const d=collect();if(!validateRecord(d))return;
 try{
  const c=document.createElement('canvas').getContext('2d');
  const measure=(s,sz,b)=>{c.font=(b?'bold ':'')+sz+'px Arial';return c.measureText(s.replace(/Ω/g,'Ohm')).width*1.045;};
  const pdf=makePdf({...d,...reportBrand()},measure),url=URL.createObjectURL(new Blob([pdf],{type:'application/pdf'}));
  const name=d.cliente.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48)||'cliente';
  const a=el('a');a.href=url;a.download=(sample?'AMOSTRA-':'')+'Relatorio-'+name+'-'+d.data+'.pdf';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
  note('PDF gerado. Veja os downloads do navegador.');
  dispatchEvent(new Event('sitelog:pdf-generated'));
 }catch(err){note('Não consegui gerar o PDF. Remova uma foto grande e tente novamente.');console.error(err);}
}
if(typeof module!=='undefined'&&module.exports)module.exports={makePdf,pdfText,examples};
if(typeof document!=='undefined'){
 $('data').value=today();
 $('editor').addEventListener('submit',e=>{e.preventDefault();if(!saving&&validateRecord(collect()))show('review');});
 $('editor').addEventListener('input',e=>{markEdited();if(fields.includes(e.target.id)&&e.target.value.trim())e.target.setCustomValidity('');});
 document.querySelectorAll('[data-view]').forEach(x=>x.onclick=()=>{if(saving)return;if(x.dataset.view!=='review'||validateRecord(collect())){note('');show(x.dataset.view);}});
 document.querySelectorAll('[data-export]').forEach(x=>x.onclick=download);
 document.querySelectorAll('[data-example]').forEach(x=>x.onclick=()=>reset(x.dataset.example));

 $('add-reading').onclick=()=>{reading(undefined,true);markEdited();};
 $('camera-button').onclick=()=>$('camera').click();$('gallery-button').onclick=()=>$('gallery').click();
 addEventListener('beforeunload',e=>{if(!sample&&(dirty||saving)){e.preventDefault();e.returnValue='';}});
 $('camera').onchange=e=>addPhotos(e.target);$('gallery').onchange=e=>addPhotos(e.target);
}
