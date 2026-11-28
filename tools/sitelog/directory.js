'use strict';
let directory={id:'catalog',type:'catalog',provider:'',logo:null,clients:[],assets:[]}, catalogEdit=null;
const legacyClient=r=>r.cliente;
const legacyAsset=r=>JSON.stringify([r.cliente,r.local,r.equipamento||'']);
function resolveClient(r,dir=directory){
 return dir.clients.find(c=>c.id===r.clientId)||dir.clients.find(c=>c.name===r.cliente||c.aliases.includes(legacyClient(r)));
}
function resolveAsset(r,dir=directory){
 return dir.assets.find(a=>a.id===r.assetId)||dir.assets.find(a=>a.aliases.includes(legacyAsset(r)))||
 dir.assets.find(a=>a.clientId===resolveClient(r,dir)?.id&&a.local===r.local&&a.name===r.equipamento);
}
function enrichVisit(r){
 const asset=resolveAsset(r), client=directory.clients.find(c=>c.id===asset?.clientId)||resolveClient(r);
 return {...r,clientId:client?.id,assetId:asset?.id,cliente:client?.name||r.cliente};
}
function seedAsset(a){
 const c=directory.clients.find(x=>x.id===a.clientId);
 return {cliente:c.name,clientId:c.id,local:a.local,equipamento:a.name,assetId:a.id,data:'',updated:0,_empty:true};
}
function catalogRows(){
 const rows=activeRows();
 if(demo)return rows;
 return [...rows,...directory.assets.map(seedAsset),...directory.clients.map(c=>({cliente:c.name,clientId:c.id,local:'',equipamento:'',data:'',_empty:true,_clientOnly:true}))];
}
function prepareDirectory(raw){
 if(!raw||!Array.isArray(raw.clients)||!Array.isArray(raw.assets)||raw.clients.length>4000||raw.assets.length>8000)throw Error('Cadastro no backup inválido.');
 const value=(v,max)=>{if(typeof v!=='string'||!v.trim()||v.length>max)throw Error('Identificação de cadastro inválida.');return v.trim();};
 const aliases=(v,max)=>{
  if(!Array.isArray(v)||v.length>250||v.some(x=>typeof x!=='string'||x.length>max))throw Error('Histórico de nomes inválido.');
  return [...new Set(v)];
 };
 const clients=raw.clients.map(c=>{if(!validId(c.id))throw Error('ID de cliente inválido.');return {id:c.id,name:value(c.name,120),aliases:aliases(c.aliases,120)};});
 const ids=new Set(clients.map(c=>c.id));
 if(ids.size!==clients.length)throw Error('Cadastro contém IDs de clientes duplicados.');
 if(new Set(clients.map(c=>c.name)).size!==clients.length)throw Error('Há clientes com o mesmo nome em cadastros diferentes. Para restaurar outra base, use um perfil de navegador vazio.');
 const assets=raw.assets.map(a=>{if(!validId(a.id)||!ids.has(a.clientId))throw Error('Vínculo de equipamento inválido.');return {id:a.id,clientId:a.clientId,name:value(a.name,120),local:value(a.local,120),aliases:aliases(a.aliases,1000)};});
 if(new Set(assets.map(a=>a.id)).size!==assets.length)throw Error('Cadastro contém IDs de equipamentos duplicados.');
 if(new Set(assets.map(a=>JSON.stringify([a.clientId,a.local,a.name]))).size!==assets.length)throw Error('Há equipamentos iguais com IDs diferentes. Para restaurar outra base, use um perfil de navegador vazio.');
 return {id:'catalog',type:'catalog',provider:raw.provider?value(raw.provider,100):'',logo:raw.logo?cleanPhotos([{...raw.logo,caption:''}])[0]:null,clients,assets};
}
async function loadDirectory(){
 const item=await workStorage('readonly',s=>s.get('catalog'));
 if(item) directory=prepareDirectory(item);
}
function provisionCatalogRow(r,next){
 let c=resolveClient(r,next);
 if(!c){c={id:validId(r.clientId)?r.clientId:crypto.randomUUID(),name:r.cliente,aliases:[]};next.clients.push(c);}
 let a=r.equipamento?resolveAsset({...r,clientId:c.id},next):null;
 if(r.equipamento&&!a){a={id:validId(r.assetId)?r.assetId:crypto.randomUUID(),clientId:c.id,local:r.local,name:r.equipamento,aliases:[]};next.assets.push(a);}
 if(a&&!a.aliases.includes(legacyAsset(r)))a.aliases.push(legacyAsset(r));
 return {...r,clientId:c.id,assetId:a?.id};
}
async function setupDirectoryForRows(rows){
 if(!workDB)return rows;
 const next=copy(directory), linked=rows.map(r=>provisionCatalogRow(r,next));
 if(JSON.stringify(next)!==JSON.stringify(directory))await persistDirectory(next);
 return linked;
}
async function persistDirectory(next){await workStorage('readwrite',s=>s.put(next));directory=next;}
function catalogWriteable(){return !demo&&!!workDB&&!!db&&!transferring;}
function providerName(){return demo?providerNames[demo]:directory.provider||'Minha empresa';}
function editCatalog(kind,id=''){
 if(!catalogWriteable())return;
 const entry=(kind==='client'?directory.clients:directory.assets).find(x=>x.id===id);
 const form=$('catalog-form'), name=$('catalog-name'), loc=$('catalog-local');
 catalogEdit={kind,id,client:clientScope};
 $('catalog-title').textContent=kind==='provider'?'Identidade da prestadora':(id?'Editar ':'Adicionar ')+(kind==='client'?'cliente':'equipamento');
 name.value=kind==='provider'?directory.provider:entry?.name||'';name.maxLength=kind==='provider'?100:120;loc.value=kind==='asset'?entry?.local||'':'';
 $('provider-logo-controls').hidden=kind!=='provider';$('provider-logo').value='';$('provider-logo-remove').checked=false;$('provider-logo-remove').disabled=!directory.logo;
 $('catalog-local-label').hidden=kind!=='asset';loc.required=kind==='asset';$('catalog-error').textContent='';
 form.querySelector('button[type=submit]').disabled=false;$('catalog-dialog').showModal();name.focus();
}
async function submitCatalog(e){
 e.preventDefault();if(!catalogWriteable()||!catalogEdit)return;
 const next=copy(directory),{kind,id,client}=catalogEdit,n=$('catalog-name').value.trim(),loc=$('catalog-local').value.trim();
 const btn=e.currentTarget.querySelector('button[type=submit]');btn.disabled=true;
 try{
  if(!n||(kind==='asset'&&!loc))throw Error('Informe nome e, para equipamento, o local.');
  if(kind==='provider'){
   next.provider=n;const file=$('provider-logo').files[0];
   if(file)next.logo=await renderProviderLogo(file);else if($('provider-logo-remove').checked)next.logo=null;
  }
  if(kind==='client'){
   if(next.clients.some(c=>c.id!==id&&(normal(c.name)===normal(n)||c.aliases.some(a=>normal(a)===normal(n)))))throw Error('Já existe um cliente com esse nome.');
   const c=next.clients.find(x=>x.id===id);
   if(c){if(c.name!==n&&!c.aliases.includes(c.name))c.aliases.push(c.name);c.name=n;}
   else next.clients.push({id:crypto.randomUUID(),name:n,aliases:[]});
  }
  if(kind==='asset'){
   const c=next.clients.find(x=>x.name===client);if(!c)throw Error('Selecione um cliente antes.');
   const a=next.assets.find(x=>x.id===id), key=legacyAsset({cliente:c.name,local:loc,equipamento:n});
   if(next.assets.some(x=>x.id!==id&&((x.clientId===c.id&&normal(x.local)===normal(loc)&&normal(x.name)===normal(n))||x.aliases.includes(key))))throw Error('Já existe um equipamento com essa identificação nesse local.');
   if(a){for(const label of [c.name,...c.aliases]){const previous=legacyAsset({cliente:label,local:a.local,equipamento:a.name});if(!a.aliases.includes(previous))a.aliases.push(previous);}a.name=n;a.local=loc;}
   else next.assets.push({id:crypto.randomUUID(),clientId:c.id,name:n,local:loc,aliases:[]});
  }
  await persistDirectory(prepareDirectory(next));$('catalog-dialog').close();
  if(kind==='client'&&clientScope===client&&id&&clientScope)clientScope=n;
  renderHistory();histNote('Cadastro salvo neste navegador.');
 }catch(err){$('catalog-error').textContent=err.message;}
 finally{btn.disabled=false;}
}

async function renderProviderLogo(file){
 if(file.size>4*1024*1024||!['image/png','image/jpeg','image/webp'].includes(file.type))throw Error('Use uma imagem PNG, JPEG ou WebP de até 4 MB.');
 const src=URL.createObjectURL(file),im=new Image();im.src=src;
 try{
  await im.decode();
  const ratio=Math.min(1,360/im.naturalWidth,124/im.naturalHeight);
  const c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.naturalWidth*ratio));c.height=Math.max(1,Math.round(im.naturalHeight*ratio));
  const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(im,0,0,c.width,c.height);
  return {url:c.toDataURL('image/jpeg',.92),w:c.width,h:c.height};
 }finally{URL.revokeObjectURL(src);}
}
const demoLogoCache={};
function reportBrand(){
 if(!demo)return {provider:directory.provider||'',logo:directory.logo};
 if(!demoLogoCache[demo]){
  const c=document.createElement('canvas');c.width=100;c.height=100;const ctx=c.getContext('2d');
  ctx.fillStyle=demo==='hvac'?'#0e535c':'#263755';ctx.fillRect(0,0,100,100);
  ctx.strokeStyle=demo==='hvac'?'#acf4e9':'#ffd084';ctx.lineWidth=7;
  ctx.beginPath();
  if(demo==='hvac'){ctx.moveTo(24,73);ctx.lineTo(50,24);ctx.lineTo(76,73);ctx.moveTo(37,54);ctx.lineTo(63,54);}
  else{ctx.moveTo(23,30);ctx.lineTo(77,30);ctx.moveTo(50,30);ctx.lineTo(50,74);ctx.moveTo(35,74);ctx.lineTo(65,74);}
  ctx.stroke();demoLogoCache[demo]={url:c.toDataURL('image/jpeg',.92),w:100,h:100};
 }
 return {provider:providerNames[demo],logo:demoLogoCache[demo]};
}
