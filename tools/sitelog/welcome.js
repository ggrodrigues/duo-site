'use strict';
(() => {
 const dialog=$('welcome-dialog'),flow=$('welcome-flow'),offer=$('welcome-offer'),next=$('welcome-next'),title=$('welcome-title');
 let step=0;
 function proceed(){
  if(!step){
   step=1;flow.hidden=true;offer.hidden=false;title.textContent='Duo Assist';$('welcome-phase').textContent='2 de 2';
   next.textContent='Iniciar tutorial';next.focus();return;
  }
  dialog.close();
  const help=$('portal-guide');help.focus({preventScroll:true});
  startTour('clients',help);
 }
 next.addEventListener('click',proceed);
 dialog.addEventListener('cancel',e=>{e.preventDefault();proceed();});
 // No saved dismissal: the introduction opens after the demo or own base is ready on each new page load.
 addEventListener('duo-sitelog:ready',()=>{dialog.showModal();next.focus();},{once:true});
 // Browser back/forward may restore a cached page without running its scripts again.
 addEventListener('pageshow',e=>{
  if(!e.persisted||dialog.open)return;
  if(tour)endTour();
  if(document.querySelector('dialog[open]'))return;
  step=0;flow.hidden=false;offer.hidden=true;title.textContent='Bem-vindo ao Duo SiteLog';$('welcome-phase').textContent='1 de 2';next.textContent='Próximo';
  dialog.showModal();next.focus();
 });
})();
