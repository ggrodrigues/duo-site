// Synthetic service histories. These records never enter the user's IndexedDB.
(() => {
 const cfg={
 hvac:{
  customers:[
   ['Centro Comercial Igarapé (fictício)','hvac-cliente.webp'],
   ['Clínica Horizonte do Norte (fictícia)','clinica.webp'],
   ['Padaria Forno do Porto (fictícia)','padaria.webp']
  ],
  techs:['Luana Reis (fictícia)','Caio Barros (fictício)','Marta Vidal (fictícia)'],
  equipment:[
   [0,'Bloco B · Sala de reuniões','Cassete · AC-07','cassete','CL','clima','vazão insuficiente'], 
   [0,'Bloco A · Sala técnica','Unidade de tratamento de ar · UTA-02','uta','CL','clima','filtro saturado'],
   [1,'Pavimento 1 · Consultório 03','Split de parede · AC-11','split','HN','clima','gotejamento na condensação'],
   [1,'Cobertura · Setor ambulatorial','Condensadora · CD-04','cond','HN','cond','ruído intermitente na grelha'],
   [2,'Térreo · Embalagem','Split piso-teto · AC-15','pisoteto','FP','clima','aleta de insuflamento com folga'],
   [2,'Térreo · Área de preparo','Exaustor centrífugo · EX-03','exaustor','FP','ar','vibração acima da referência da própria máquina']
  ]
 },
 electric:{
  customers:[
   ['Centro Logístico Samaúma (fictício)','electric-cliente.webp'],
   ['Distribuidora Frutos do Rio (fictícia)','frutos.webp'],
   ['Centro de Dados Rio Claro (fictício)','rio.webp']
  ],
  techs:['Rafael Alves (fictício)','Iara Coutinho (fictícia)','Nicolas Antunes (fictício)'],
  equipment:[
   [0,'Unidade 2 · Sala elétrica','Subestação · Painel SE-02','painel','SE','painel','etiqueta externa ilegível'],
   [0,'Unidade 2 · Sala de utilidades','Quadro de transferência automática · QTA-01','qta','SE','qta','indicador de estado intermitente'],
   [1,'Galpão 1 · Casa de máquinas','Grupo gerador · GMG-04','gerador','FR','gerador','alerta de bateria registrado no painel'],
   [1,'Galpão 1 · Sala de distribuição','Banco de capacitores · BC-02','banco','FR','banco','alarme recorrente em um estágio'],
   [2,'Unidade 1 · Sala de TI','UPS industrial · UPS-03','ups','RC','ups','notificação de bateria no histórico de eventos'],
   [2,'Unidade 1 · Central de água gelada','Inversor de frequência · INV-06','inversor','RC','inversor','eventos intermitentes de perda de comando']
  ]
 }
 };
 const definitions={
  clima:[['Temperatura de retorno',24.8,0.17,'°C'],['Temperatura de insuflamento',15.2,0.22,'°C'],['Umidade relativa ambiente',57,0.76,'%']],
  cond:[['Temperatura do ar na entrada',31.6,0.25,'°C'],['Temperatura do ar na saída',42.1,0.23,'°C'],['Corrente em operação',5.8,0.08,'A']],
  ar:[['Velocidade do ar na grelha',2.8,0.08,'m/s'],['Vibração no mancal',2.1,0.07,'mm/s'],['Corrente em regime',2.5,0.04,'A']],
  painel:[['Tensão indicada no painel',220,0.4,'V'],['Temperatura externa do gabinete',31.5,0.21,'°C'],['Temperatura ambiente',27.1,0.21,'°C']],
  qta:[['Tensão indicada da rede',380,0.61,'V'],['Tensão indicada da fonte reserva',382,0.53,'V'],['Temperatura externa do quadro',29.8,0.18,'°C']],
  gerador:[['Tensão da bateria indicada',27.1,0.09,'V'],['Frequência indicada em teste',60.0,0.04,'Hz'],['Temperatura indicada ao fim do teste',77.5,0.42,'°C']],
  banco:[['Fator de potência indicado',0.97,0.005,''],['Potência reativa indicada',18.7,0.31,'kvar'],['Temperatura externa do gabinete',35.2,0.22,'°C']],
  ups:[['Carga na saída indicada',42,0.84,'%'],['Tensão de saída indicada',220,0.33,'V'],['Autonomia estimada pelo display',24.8,0.45,'min']],
  inversor:[['Frequência de saída indicada',45.5,0.21,'Hz'],['Corrente de saída indicada',7.4,0.1,'A'],['Temperatura indicada no inversor',43.2,0.24,'°C']]
 };
 const observations={
  clima:['Conferência de filtro, grelha e condição do dreno com o equipamento nas condições descritas pelo cliente.','Temperaturas de insuflamento e retorno registradas após estabilização e comparadas com o último atendimento.','Inspeção visual dos pontos de acesso e verificação do retorno de condensado, sem constatação de vazamento no momento da visita.'],
  cond:['Inspeção visual de aletas, grelha e fixação externa, com registro das temperaturas do ar.','Observação da ventilação e do ruído na cobertura durante a operação normal.','Conferência visual do conjunto e revisão do registro de corrente em operação.'],
  ar:['Verificação da grelha, do ruído e das condições de fixação acessíveis.','Registro da velocidade do ar e da vibração para comparação com o próprio histórico do exaustor.','Inspeção visual da carcaça e da saída de ar; anotadas as condições encontradas durante o expediente.'],
  painel:['Inspeção visual externa, conferência da identificação e leitura dos indicadores disponíveis.','Revisão das anotações do responsável local e registro da temperatura externa do gabinete.','Identificação do painel confrontada com o cadastro; valores do visor registrados sem abrir o gabinete.'],
  qta:['Conferência do estado indicado pelas sinalizações e das leituras das duas fontes nos visores.','Revisão do histórico de eventos com o responsável local; quadro inspecionado externamente.','Registro de temperatura externa e das indicações do painel durante operação normal.'],
  gerador:['Coleta das indicações do controlador durante o teste programado conduzido pelo responsável local.','Consulta ao histórico de alarmes e registro da tensão indicada da bateria em espera.','Comparação das leituras do painel com a visita anterior e inspeção visual externa do conjunto.'],
  banco:['Leitura dos indicadores de fator de potência, potência reativa e estado dos estágios, com gabinete fechado.','Conferência dos alarmes registrados pelo controlador e das condições externas de ventilação do gabinete.','Verificação das indicações durante o período de carga informado pela equipe da unidade.'],
  ups:['Registro das indicações de carga, tensão de saída e autonomia estimada, sem interromper as cargas atendidas.','Conferência do histórico de eventos e inspeção visual da entrada de ventilação do equipamento.','Comparação das indicações atuais com o registro da visita anterior; teste de autonomia não executado.'],
  inversor:['Leitura da frequência, corrente e temperatura indicadas no teclado externo durante a operação.','Consulta ao histórico de eventos e confirmação do horário da ocorrência com o operador.','Inspeção visual externa do conjunto e anotação das indicações em regime estável.']
 };
 const rounds=[
  ['Cadastro e referência inicial','Identificação e condições iniciais registradas para comparação nas visitas seguintes.',''],
  ['Preventiva de rotina','',''],
  ['Inspeção após chamado','A equipe local relatou a ocorrência: {issue}. O relato e as condições observadas foram anotados.','Confirmar solução para {issue} com o responsável da unidade.'],
  ['Retorno da ocorrência','A equipe local informou que o ajuste combinado foi realizado. Não houve repetição do sintoma no período observado.','Confirmar se a ocorrência volta no próximo ciclo.'],
  ['Visita preventiva','O responsável local não registrou repetição da ocorrência desde o retorno anterior.',''],
  ['Verificação em horário de maior uso','As leituras foram registradas no período de uso mais intenso informado pela unidade.',''],
  ['Revisão de rotina','',''],
  ['Acompanhamento de condição','As leituras foram comparadas com a referência da própria máquina. Não foram usados limites de aceitação genéricos.',''],
  ['Conferência de identificação','Cadastro e identificação externa revisados com o responsável local.',''],
  ['Fechamento do acompanhamento','Visita documentada para o fechamento mensal do contrato.','Programar a próxima preventiva com a unidade.']
 ];
 const days=['07-08','07-22','08-05','08-19','09-09','09-23','10-07','10-21','11-04','11-18'];
 const originalDays=['07-07','07-21','09-08','09-24','11-05','11-19'];
 const fmt=new Intl.NumberFormat('pt-BR',{maximumFractionDigits:2,minimumFractionDigits:0});
 for(const [bank,setup] of Object.entries(cfg)){
  const data=demoBanks[bank].records;
  const original=data[0];
  setup.equipment.forEach(([ci,local,equipamento,slug,prefix,type,issue],ai)=>{
   const [cliente,logo]=setup.customers[ci];
   const thumb=ai===0?(bank+'-equipamento.webp'):slug+'.webp';
   if(ai===0) for(const r of data){r.demoClientThumb=logo;r.demoEquipThumb=thumb;}
   const dates=ai===0?originalDays:days;
   for(const [i,md] of dates.entries()){
    const stage=ai===0?[0,1,4,5,8,9][i]:i;
    const [objetivo,extra,pend]=rounds[stage];
    const substitute=s=>s.replaceAll('{issue}',issue);
    const date='2026-'+md.slice(0,3)+String(Number(md.slice(3))+(ai===0?0:ai%3)).padStart(2,'0');
    const im=demoPhotoAssets[slug][(i+ai)%2];
    const offset=(stage===2?3:0);
    const readings=definitions[type].map(([name,base,scale,unit],j)=>[name,fmt.format(base+scale*((i*7+j*5+ai*3)%11-5+offset)),unit]);
    const photoCaption=(i+ai)%2?'Vista de detalhe do conjunto.':'Vista geral do equipamento no local.';
    data.push({
     id:`demo-${bank}-v11-${ai+1}-${i+1}`,sample:true,demoClientThumb:logo,demoEquipThumb:thumb,
     cliente:ai===0?original.cliente:cliente,local:ai===0?original.local:local,equipamento:ai===0?original.equipamento:equipamento,
     data:date,tecnico:setup.techs[(ai+i+(stage===2?1:0))%setup.techs.length],
     os:prefix+'-'+String(101+ai*20+i),objetivo,
     servicos:[observations[type][(i+ai)%3],substitute(extra)].filter(Boolean).join(' '),
     pendencias:substitute(pend),readings,
     pics:[{...im,caption:'Imagem ilustrativa de demonstração. '+photoCaption}],
     checklist:['clima','painel'].includes(type)?{kind:bank,values:{0:'OK',1:'OK',2:'OK',3:'OK'}}:{kind:'',values:{}}
    });
   }
  });
 }
})();
