'use strict';
(() => {
 const dialog=$('welcome-dialog'),flow=$('welcome-flow'),offer=$('welcome-offer'),next=$('welcome-next'),title=$('welcome-title');
 let step=0;
 function proceed(){
  if(!step){
   step=1;flow.hidden=true;offer.hidden=false;title.textContent='Duo Assist';$('welcome-phase').textContent='2 de 2';
   $('welcome-skip').hidden=false;next.textContent='Iniciar tutorial';next.focus();return;
  }
  dialog.close();
  startGuidedVisit();
 }
 next.addEventListener('click',proceed);
 function skip(){dialog.close();$('portal-guide').focus({preventScroll:true});}
 $('welcome-skip').addEventListener('click',skip);
 dialog.addEventListener('cancel',e=>{e.preventDefault();if(step)skip();else proceed();});
 // No saved dismissal: the introduction opens after the demo or own base is ready on each new page load.
 addEventListener('duo-sitelog:ready',()=>{dialog.showModal();next.focus();},{once:true});
 // Browser back/forward may restore a cached page without running its scripts again.
 addEventListener('pageshow',e=>{
  if(!e.persisted||dialog.open)return;
  if(tour)endTour();
  stopGuidedVisit();
  if(document.querySelector('dialog[open]'))return;
  step=0;flow.hidden=false;offer.hidden=true;title.textContent='Bem-vindo ao Duo SiteLog';$('welcome-phase').textContent='1 de 2';next.textContent='Próximo';$('welcome-skip').hidden=true;
  dialog.showModal();next.focus();
 });
})();
