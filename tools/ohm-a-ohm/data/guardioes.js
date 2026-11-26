// Falas dos guardiões. Cada bicho tem uma personalidade quando possuído e a oposta quando livre.
// Os da Floresta conhecem o MAX; os dos outros mundos nunca o viram.
// Tom: sério, sem infantilizar. Possuídos ameaçam e desprezam; livres contam, com sobriedade, o que o Barão fez.
// Códigos: g = possuído (rosnando), h = possuído levando golpe, f = livre,
// mw / ma / mn = MAX preocupado / bravo / neutro, n = narrador. {doTree} = "do Broto de Cobre" etc.
// Anedotas do Barão (raras, de propósito): Pássaro, Águia, Rato e Hiena.
window.OHM_GUARDIOES = {
  // ===== Floresta de Impedância (amigos do MAX) =====
  fox: { // possuída: raivosa · livre: calma
    intro: [
      'mw|Raposa? Sou eu, o MAX. Seus olhos estão roxos. Você dormia na porta da minha oficina e nunca me mostrou os dentes.',
      'g|Na sua oficina, você põe pra fora quem quiser. Aqui quem manda sou eu!',
      'mw|Você é a guardiã {doTree}. Desde quando expulsa os amigos?',
      'g|Desde que o Barão me deu força pra isso. Mais um passo e você vai ver!',
      'ma|Achei o fio do Barão nas raízes. Quase toda a corrente passa pelo fio sem passar pelos resistores. Aguente firme, amiga. Vou soltar o fio.'
    ],
    hits: [
      ['h|Ouviu o meu rosnado, velho?', 'mw|Ouvi. Mas as faíscas nas suas patas me preocupam mais.'],
      ['h|Larga esse fio! Ele é meu!', 'mn|As faíscas diminuíram. Suas patas ainda estão ardendo?']
    ],
    end: [
      'f|Passou, MAX. Obrigada. Eu sabia que era você e, mesmo assim, queria morder.',
      'f|Eu vi o Barão mexer nas raízes. Ele ligou um fio entre as pontas de cada resistor. Quase toda a corrente passou pelo fio.',
      'f|Senti o calor subir pelas patas e, de repente, até você parecia um inimigo.',
      'mn|Descanse aqui. Quando quiser voltar à oficina, a porta continua aberta.'
    ]
  },
  squirrel: { // possuído: sarcástico · livre: sincero
    intro: [
      'mw|Esquilo? Vem cá. Deixa eu dar uma olhada em você.',
      'g|Já sei. Primeiro vem o suspiro, depois o conselho. Acertei?',
      'mw|Hoje eu vim ouvir você, guardião {doTree}. O que houve por aqui?',
      'g|Eu, dando conselho pro MAX? O Barão vai adorar essa história.',
      'ma|Hoje eu só quero saber o que aconteceu com o Carvalho.'
    ],
    hits: [
      ['h|Vai examinar a árvore inteira, professor?', 'mn|Se for preciso. Tem faísca bem debaixo da sua pata.'],
      ['h|E eu aqui achando que era cócega. Ai!', 'mn|Solta o galho. Isso, devagar.']
    ],
    end: [
      'f|Eu morria de medo de soltar aquele galho, MAX. Era isso que eu queria ter dito.',
      'f|O Barão pendurou faíscas no Carvalho. De longe, até pareciam enfeites. A gente descobriu o que eram ao encostar.',
      'f|Os filhotes ainda estão lá em cima, MAX. Eles têm medo de descer.',
      'mn|Agora os galhos estão seguros. Você mostra aos filhotes por onde descer? Eu espero aqui embaixo.'
    ]
  },
  frog: { // possuído: melancólico · livre: esperançoso
    intro: [
      'mw|Estranhei o silêncio, Sapo. Eu escutava seu canto lá da oficina.',
      'g|Era mais bonito quando tinha lago, MAX. Agora olha só.',
      'mw|O guardião {doTree} sempre foi bom de prosa. Me conta o que houve com a água.',
      'g|Pergunta pro Barão. Até os peixes ele deixou na lama.',
      'ma|Ainda tem peixe na água. Eu fico aqui com vocês.'
    ],
    hits: [
      ['h|Você ainda acha que esse lago volta?', 'mn|Acho. E tem peixe aqui que vai precisar dele.'],
      ['h|E se o Barão vier amanhã e secar tudo de novo?', 'mn|Amanhã eu volto também.']
    ],
    end: [
      'f|MAX, sentiu esse cheiro? Vem chuva aí!',
      'f|O Barão esvaziou o lago. Onde tinha água, ele deixou os fios dele atravessados.',
      'f|Olha, MAX! Ainda tem peixinhos vivos nessas poças. Quando chover, eles vão ter um lago de novo.',
      'mn|Quando o lago encher, canta bem alto. Quero ouvir lá de casa.'
    ]
  },
  tortoise: { // possuída: impaciente · livre: paciente
    intro: [
      'mw|Tartaruga, espera por mim! Desde quando eu preciso correr pra te acompanhar?',
      'g|Se eu parar pra conversar, perco a manhã. Anda, MAX!',
      'mw|É a primeira vez que vejo a guardiã {doTree} com essa pressa. Você está bem?',
      'g|Estava indo muito bem até você entrar na minha frente!',
      'ma|Vou sair da frente. Quer que eu caminhe do seu lado?'
    ],
    hits: [
      ['h|Vai ficar nesse passinho o dia inteiro?', 'mn|Foi nesse passo que a gente chegou a velho, minha amiga.'],
      ['h|Eu tento parar e as patas continuam, MAX.', 'mn|Respira, minha amiga. Eu fico do seu lado até suas patas sossegarem.']
    ],
    end: [
      'f|Consegui parar. Escuta, MAX. Fazia tempo que eu não ouvia o vento nas folhas.',
      'f|O Barão passou por aqui reclamando que a floresta era lenta. Veio o clarão e minhas patas dispararam.',
      'f|Demorei pra reconhecer aquela faísca de cartola. Foi você que ensinou o rapaz, não foi?',
      'mn|Fui eu. Naquela época ele já queria terminar antes de começar.'
    ]
  },
  bird: { // possuído: arrogante · livre: humilde
    intro: [
      'mw|Pássaro! Hoje eu tive que acordar sozinho. Senti falta de você na janela.',
      'g|Naquela janelinha? Agora, quando eu canto, a floresta inteira escuta.',
      'mw|Vim ver o guardião {doTree}. Da janela eu nunca vi suas asas brilharem desse jeito.',
      'g|Daqui dá pra ver muito bem! Olha o brilho das asas que o Barão me deu!',
      'ma|Estou vendo. Tem faísca saltando de uma pena pra outra.'
    ],
    hits: [
      ['h|Está vendo como elas brilham?', 'mn|Estou. Uma das asas está batendo mais devagar.'],
      ['h|MAX… Não consigo subir!', 'mw|Abre as asas. Dá pra planar até aquele galho.']
    ],
    end: [
      'f|Que bom sentir um galho firme outra vez. Desculpa ter gritado com você lá de cima.',
      'f|Eu estava lá no alto da Copa quando o Barão subiu. Ele chamou um raio, depois outro. Ouvi as árvores estalarem lá embaixo.',
      'f|Tentei avisar os outros. Quando abri o bico, só saiu aquele grito.',
      'mn|Agora já reconheço sua voz. Amanhã eu abro a janela cedinho.'
    ]
  },

  // ===== Montanhas Dielétricas (o MAX não conhece ninguém) =====
  goat: { // possuída: briguenta · livre: acolhedora
    intro: [
      'mw|Com licença. É por aqui que se sobe ao pico?',
      'g|Era. Agora tem uma cabra no meio.',
      'g|Se eu fosse você, dava meia-volta antes de conhecer meus chifres.',
      'ma|Seus chifres começaram a soltar faísca quando o Barão passou?',
      'g|Quer ver de perto, é?',
      'ma|Daqui eu vejo bem. Pode ficar onde está.'
    ],
    hits: [
      ['h|Foi o gelo! Eu não saí da frente!', 'mn|Eu vi o gelo ceder. Cuidado com a beirada.'],
      ['h|Ficou aí só pra me segurar?', 'mn|Fiquei, sim. Não vou deixar você cair daqui.']
    ],
    end: [
      'f|Venha por este lado, forasteiro. Aqui a gente pisa em pedra firme.',
      'f|O Barão cobriu o pico de placas de metal. Voltava todo dia pra guardar mais carga elétrica nelas.',
      'f|Um dia as placas soltaram um raio. A neve veio abaixo e cobriu a trilha dos meus cabritos.',
      'mw|Então foi daqui que desceu a avalanche.',
      'f|Foi. Eu mostro por onde ainda dá pra subir. E, se precisar de um canto pra dormir, já sabe com quem falar.'
    ]
  },
  marmot: { // possuída: histérica · livre: tímida
    intro: [
      'mw|Foi você que assobiou, marmota? Ouvi lá de baixo. Aconteceu alguma coisa?',
      'g|Pra toca! Todo mundo pra toca! Ele ouviu o sinal!',
      'mw|Ouvi, sim. Vou parar aqui na entrada.',
      'g|Essa barba! O Barão disse que um velho igualzinho a você vinha roubar a energia da nossa toca!',
      'ma|Ele falou de mim. Sou o MAX. Posso conversar com você daqui mesmo?'
    ],
    hits: [
      ['h|Esse estalo! Você ouviu? Eu tenho que avisar os outros!', 'mn|Eles já ouviram seu assobio. Pode descansar um pouco.'],
      ['h|Ficou tão quieto… Ainda dá pra me ouvir?', 'mw|Dá. Até falando baixinho.']
    ],
    end: [
      'f|Que bom. Gosto mais da minha voz assim.',
      'f|No inverno, o Barão se escondeu na nossa toca. O chão zumbia mesmo quando ele saía.',
      'f|Era tempo de hibernar. Os filhotes tentavam dormir, mas cada estalo acordava a toca inteira. E lá ia eu assobiar de novo.',
      'mn|Daqui pra frente eu ando mais de mansinho. Eles merecem o sossego.',
      'f|Obrigada, MAX. Se ouvir um ronquinho… é o menor.'
    ]
  },
  eagle: { // possuída: desdenhosa · livre: protetora
    intro: [
      'mw|Nunca vi uma águia dar tantas voltas no mesmo pico. Você está procurando alguma coisa?',
      'g|Você, mestre. Lá do vale já dava pra ver o quanto anda devagar.',
      'g|O Barão fez essas nuvens pararem. E você, o que pretende fazer aí embaixo?',
      'ma|Quero ver suas asas de perto. Tem faísca nas pontas. Consegue pousar?',
      'g|Se eu quiser. Você é que parece precisar de descanso.'
    ],
    hits: [
      ['h|Foi o vento que me empurrou.', 'mn|Então venha pelo lado de cá. Venta menos.'],
      ['h|Minhas asas… tem alguma coisa prendendo as penas.', 'mw|Pode recolher as asas. Vou cuidar disso.']
    ],
    end: [
      'f|Fique perto de mim. Minha asa corta o vento enquanto você sobe.',
      'f|Conheço as correntes de ar daqui. Antes do Barão, uma nuvem dessas atravessava o pico e ia embora.',
      'f|Ele prendeu a tempestade sobre os ninhos. Passei semanas voando de um ninho a outro pra ver quais ainda estavam nos galhos.',
      'f|Hoje vou olhar os ninhos de novo. Venha comigo. O primeiro fica no seu caminho.',
      'mn|Agradeço a companhia. Você conhece melhor a serra.'
    ]
  },
  lynx: { // possuído: debochado · livre: honrado
    intro: [
      'mw|Lince! Vi suas pegadas lá embaixo. Você guarda esta passagem?',
      'g|Um mestre seguindo um gato. Essa eu preciso contar ao Barão.',
      'g|Sabe como ele imita a sua voz? Assim, ó. “Com calma, Curto.” Ficou parecido?',
      'ma|Ficou. Eu dizia isso quando ele ainda parava pra ouvir.',
      'g|Pois vai ter que falar comigo. Ele deixou a passagem por minha conta.'
    ],
    hits: [
      ['h|Agora vem a parte do “com calma”?', 'mn|Você já sabe essa parte.'],
      ['h|Minha pata está tremendo. Deve ser o frio, claro.', 'mw|Quer se apoiar em mim?']
    ],
    end: [
      'f|Quero, sim. E quero pedir desculpa pelo que disse.',
      'f|O Barão prendeu os filhotes da montanha dentro de blocos de gelo. Até hoje dá pra ver faíscas no gelo.',
      'f|Eu via os pequenos lá dentro. Quando eu chegava perto, eles me seguiam com os olhos.',
      'ma|Vamos tirar os filhotes daí. Eu ajudo você.',
      'f|Me ajude com o gelo, MAX. Eu fico com os filhotes até levar o último pra casa. Tem a minha palavra.'
    ]
  },
  bear: { // possuído: raivoso · livre: sereno
    intro: [
      'mw|Então é um urso que guarda o pico. Só preciso atravessar. Podemos conversar?',
      'g|ATRAVESSAR? Ninguém põe o pé no meu pico!',
      'g|O Barão sabe disso. Foi por isso que me deixou aqui!',
      'ma|E deixou você aí sozinho, soltando faísca desse jeito?',
      'g|EU AGUENTO! Pergunte a quem quiser! Sou o mais forte daqui!',
      'ma|Eu acredito. Agora me deixe ver o que isso fez com você.'
    ],
    hits: [
      ['h|NEM SENTI!', 'mn|Ainda bem. Era com as faíscas que eu queria mexer.'],
      ['h|Posso… sentar um pouco?', 'mw|Claro. O pico pode esperar.']
    ],
    end: [
      'f|Fazia dias que eu não sentava pra olhar a montanha.',
      'f|Vê a rachadura? Foi um raio do Barão. Eu estava do outro lado do pico e ouvi a pedra partir.',
      'f|Quando cheguei, a passagem dos meus vizinhos estava coberta de gelo. Alguns ainda estão presos lá.',
      'mn|Você conhece a passagem. Eles vão precisar da sua ajuda.',
      'f|Conheço, sim. Vou abrir caminho pra eles. Boa descida até as minas, amigo.'
    ]
  },

  // ===== Minas dos Indutores =====
  mole: { // possuída: arrogante · livre: humilde
    intro: [
      'mw|Ainda bem que encontrei uma toupeira. Você conhece este túnel? As vigas estão tremendo.',
      'g|Eu conheço cada curva desses túneis, velho. Guarde seus avisos.',
      'g|O Barão me deu olhos para ver através da pedra. Aqui, quem avisa sou eu.',
      'ma|E esses olhos não te deixam descansar, deixam?'
    ],
    hits: [
      ['h|Eu estava olhando! Como não vi?', 'mn|Você está vendo coisa demais. Escute minha voz.'],
      ['h|A luz sumiu… Eu não enxergo!', 'mw|O chão continua aí. Sinta com as patas.']
    ],
    end: [
      'f|Terra úmida… pedra… Ah, eu conheço este túnel. Pode vir, senhor.',
      'f|As bobinas do Barão viravam ímãs quando a corrente passava por elas. Puxavam com tanta força que até as vigas de ferro entortaram.',
      'f|Três túneis desabaram. Tiramos as famílias de lá, mas ainda tem gente sem caminho pra voltar pra casa.',
      'mw|Vou atrás dessas bobinas antes que outro túnel desabe.'
    ]
  },
  bat: { // possuído: sombrio · livre: vivaz
    intro: [
      'mw|Morcego, você que conhece esses túneis… É só aqui dentro que os lampiões se apagaram?',
      'g|Lá fora é igual. Você só vai demorar mais para perceber.',
      'g|Toda luz apaga. Toda pilha descarrega. O Barão só adiantou as coisas.',
      'ma|Os lampiões eu conserto. Agora estou preocupado com você.'
    ],
    hits: [
      ['h|Quero ver quanto tempo você aguenta aqui no escuro.', 'mn|Fico até descobrir o que está te fazendo mal.'],
      ['h|Minhas asas… Faz tempo que não sinto esse vento!', 'mw|Então elas ainda lembram como é voar.']
    ],
    end: [
      'f|Ah, eu vou percorrer esta mina inteira! Preciso contar aos outros que já dá para sair!',
      'f|O Barão fez as bobinas soltarem um chiado bem agudo. Vocês nem ouviam. A gente ouvia até demais.',
      'f|A gente se guia pelo eco. Com aquele chiado, não dava pra ouvir o som voltar. De tanto bater nas paredes, a gente parou de voar.',
      'f|Agora ouço o eco de cada curva. Já sei o caminho pra saída!',
      'mn|Leve os outros até ela. Ainda vou precisar desses seus ouvidos.'
    ]
  },
  armadillo: { // possuído: paranoico · livre: confiante
    intro: [
      'mw|Calma, tatu. Vi que seu casco está preso. Posso chegar por esse lado?',
      'g|Por esse lado, não! Nem pelo outro. Eu sei o que você quer.',
      'g|Vai desmontar meu casco e levar as placas. O Barão me contou tudo!',
      'ma|Seu casco fica com você. Eu quero descobrir o que está puxando as placas.',
      'g|Pra descobrir vai ter que mexer nelas. Eu bem sabia!'
    ],
    hits: [
      ['h|Eu ouvi um estalo! O que você soltou?', 'mn|Diminuí a corrente nas bobinas. Suas placas estão todas aí.'],
      ['h|Já não puxa tanto… Mas eu ainda estou de olho!', 'mw|Pode conferir cada placa depois.']
    ],
    end: [
      'f|Tudo no lugar! Pode passar. Se a galeria apertar, eu mostro outro caminho.',
      'f|O Barão prendeu placas de ferro no meu casco. Com as bobinas ligadas, as paredes puxavam as placas como ímãs. Fui parar no teto!',
      'f|Passei três dias de costas lá no alto. Toda vez que tentava descer, meu casco grudava de novo.',
      'ma|Vou desligar essas bobinas antes de seguir.',
      'f|Eu conheço um túnel seguro. Depois dessa, faço questão de ir na frente.'
    ]
  },
  salamander: { // possuída: fria e calculista · livre: emotiva
    intro: [
      'mw|A pedra está quente até deste lado, salamandra. Faz quanto tempo que você vigia essa bobina?',
      'g|Tempo suficiente. A bobina me aquece. Em troca, vigio a passagem.',
      'g|Se veio desligar a bobina, pode dar meia-volta. Poupa o seu tempo. E o meu.',
      'ma|Estou mais preocupado com o que esse calor está fazendo com você.',
      'g|Preocupação não muda a temperatura.'
    ],
    hits: [
      ['h|A temperatura caiu. Isso não estava previsto.', 'mn|A bobina está esfriando. Já dá pra chegar perto sem sentir aquele bafo quente.'],
      ['h|Você não foi embora… Eu achei que…', 'mw|Sou o MAX. Está conseguindo me ouvir?']
    ],
    end: [
      'f|MAX… Eu queria tanto pedir para você desligar! Mas só saía aquela voz.',
      'f|O Barão fez passar corrente demais pela Bobina Mestra. Ela ficou em brasa, e ele não deixou ninguém desligar.',
      'f|As pedras esquentaram tanto que minha família teve que sair das fendas. Até nós, que gostamos de calor, queimamos as patas.',
      'ma|Ainda pode esquentar. Mantenha todos longe até eu resolver.',
      'f|Eu aviso. Obrigada, MAX. Já estava esquecendo o quanto eu queria voltar para casa.'
    ]
  },
  rat: { // possuído: servil ao Barão · livre: rebelde
    intro: [
      'mw|Sou o MAX, amigo rato. O Barão passou por aqui?',
      'g|O excelentíssimo Barão Curto me confiou esta passagem! Pode voltar. Ele não recebe qualquer um.',
      'g|Eu poderia chamar por ele, mas resolvo isso sozinho. Ele vai gostar.',
      'ma|Ele foi embora e deixou seu pelo soltando faísca. Foi pra isso que você ficou de guarda?',
      'g|Deixou alguém de confiança! Vai engolir essas palavras!'
    ],
    hits: [
      ['h|Não posso sair do posto. Não posso decepcionar…', 'mn|Seu pelo está soltando faíscas. Isso precisa parar.'],
      ['h|Ele mandou eu ficar… enquanto ele fugia?', 'mw|Você já esperou demais por ele.']
    ],
    end: [
      'f|Excelentíssimo… Eu disse isso mesmo? Não quero nem ouvir o nome dele.',
      'f|Ele fez a gente carregar fio dia e noite. Depois foi embora e deixou os fios ligados, bem no meio dos túneis.',
      'f|Cada vez que mudava de ideia, a gente arrastava tudo de volta. Eu devia ter mandado ele carregar.',
      'mn|Não vou deixar esses fios ligados. Ainda passa muita gente aqui.',
      'f|Ótimo. Eu aviso o pessoal. E, se ele voltar, vai ter que carregar o próprio fio.'
    ]
  },

  // ===== Cidadela Integrada (onde tudo aconteceu) =====
  crow: { // possuído: agourento · livre: esperançoso
    intro: [
      'mw|Corvo! Você consegue ver o cofre daí?',
      'g|Vejo o que vai sobrar dele. Cinza. Como tudo aqui.',
      'g|Lá embaixo, as luzes se apagaram uma a uma. Já vi como isso acaba pra você também, velho.',
      'ma|Vou começar pelas trilhas. Ainda tem cobre bom debaixo dessa cinza.'
    ],
    hits: [
      ['h|Você devia estar no chão. Foi o que eu vi!', 'mn|Olhe outra vez. Ainda estou de pé.'],
      ['h|Aquela abertura nas nuvens… Ela não estava ali.', 'mw|Consegue ver além da fumaça agora?']
    ],
    end: [
      'f|Consigo! Fazia tanto tempo que eu não via um pedaço de céu azul.',
      'f|Eu cruzava a Cidadela seguindo as trilhas acesas. Não precisava nem olhar o céu.',
      'f|Eu vi o Barão usar o Núcleo de Criação. Ele abriu um caminho por fora das proteções. Passou corrente demais e as trilhas queimaram.',
      'mw|Então foi por isso que as luzes se apagaram. Você viu onde as trilhas ainda estão inteiras?',
      'f|Vou procurar lá do alto. Quando eu achar uma trilha boa, dou um grito!'
    ]
  },
  scorpion: { // possuído: furioso · livre: sereno e sábio
    intro: [
      'mw|Com licença, escorpião. Você mora aqui na torre, no meio dessa solda toda?',
      'g|MORO! E não convidei ninguém! Tire essas botas daqui!',
      'g|O Barão pôs corrente no meu ferrão. Quer ver de perto? É só dar mais um passo!',
      'ma|As botas param aqui. Mas preciso alcançar aqueles fios.'
    ],
    hits: [
      ['h|EU AVISEI! QUER SENTIR O FERRÃO?', 'mn|Pode ficar onde está. Daqui eu alcanço os fios.'],
      ['h|Meu ferrão… Parou de estalar.', 'mw|E as pinças? Consegue abrir?']
    ],
    end: [
      'f|Ah… Passei tanto tempo com as pinças fechadas. Obrigado por não ter ido embora.',
      'f|Lá na Torre de Fumaça, vi as peças do circuito esquentarem até ficarem pretas por fora.',
      'f|O Barão forçava mais corrente e comemorava os estalos. Quando a fumaça tomou tudo, já não dava para desligar.',
      'ma|Ele ouviu os estalos e continuou? Vou cortar a energia da torre.',
      'f|A entrada está livre. Vá com cuidado. Quando ele começa a perder, é aí que mais força a corrente.'
    ]
  },
  cockroach: { // possuída: cínica · livre: sincera e grata
    intro: [
      'mw|Com licença, dona barata. Tem mais alguém debaixo dessa placa?',
      'g|Só eu. Pode seguir viagem. Já sobrevivi a gente mais barulhenta.',
      'g|Mais um querendo salvar a Cidadela? O Barão também chegou cheio de boas ideias.',
      'ma|Eu trouxe ferramentas. Para começar, quero tirar esse fio queimado do seu caminho.',
      'g|Claro. Conserta um fio e já acha que resolveu a vida de todo mundo.'
    ],
    hits: [
      ['h|Uma faísca a menos. Vai querer agradecimento por isso?', 'mn|Não precisa. Já consigo ouvir você sem aquele chiado.'],
      ['h|Quase… Não pare agora! Quer dizer… Faça o que quiser.', 'mw|Ouvi a primeira parte. Pode deixar.']
    ],
    end: [
      'f|Obrigada. Quando eu disse pra você ir embora, torci pra você não me escutar.',
      'f|Eu morava ao lado do Regulador. Era uma peça que mantinha a tensão certa nas casas da vizinhança.',
      'f|O Barão arrancou o Regulador e emendou os fios. Chamou de liberdade. A tensão subiu e as casas queimaram.',
      'mw|Então ninguém deve religar essa placa ainda. Primeiro eu recoloco as proteções.',
      'f|Eu aviso os vizinhos. E conheço as passagens por baixo das casas. Se precisar, eu mostro.'
    ]
  },
  hyena: { // possuída: riso cruel · livre: séria e seca
    intro: [
      'mw|Ouvi uma hiena rir do outro lado do Processador Morto. Foi você? Tem mais alguém aqui?',
      'g|Hihi! Só eu! O resto da placa ficou bem quietinho. Você vai gostar!',
      'g|O Barão me contou da noite em que fugiu. Disse que você ficou chamando por ele. Hihi! Chamou muito?',
      'ma|Chamei. Ele devia ter me ouvido.'
    ],
    hits: [
      ['h|Hih… Espere! Essa não teve graça!', 'mn|Você parou de rir por um instante.'],
      ['h|Minha garganta… Eu não consigo mais rir.', 'mw|Não force. Sua voz está voltando.']
    ],
    end: [
      'f|Obrigada. Eu já não aguentava ouvir a minha própria risada.',
      'f|Este Processador controlava a placa inteira. O Barão queria ser o único a dar ordens.',
      'f|Não deu certo. O Barão forçou o Processador. As peças que faziam as contas lá dentro queimaram. A placa inteira parou. Péssimo plano.',
      'f|Ainda bateu no Processador queimado e mandou que respondesse. Nada. Chamou aquilo de traição.',
      'mn|Preciso recuperar o Núcleo. Moore ainda tem trabalho aqui.'
    ]
  },
  vulture: { // possuído: fatalista · livre: determinado
    intro: [
      'mw|Urubu, lá do alto do Trono de Faíscas você viu o Barão passar?',
      'g|Vi. Sempre passa alguém. Depois ninguém volta. Eu só espero.',
      'g|Pode subir, velho. Quando cansar, tem lugar nesta pedra.',
      'ma|Estou cansado desde as montanhas. Mas ainda preciso chegar ao cofre.'
    ],
    hits: [
      ['h|Tanto esforço… Para acabar sentado aqui comigo.', 'mn|Depois eu sento aqui com você. Primeiro vou cuidar dessa corrente que te faz mal.'],
      ['h|O Barão passou por mim e foi pro cofre… Eu podia ter feito alguma coisa.', 'mw|Ainda pode. Conhece o caminho melhor que eu.']
    ],
    end: [
      'f|Conheço. E chega de ficar nesta pedra. Escute bem.',
      'f|O Barão trouxe ao trono os fios dos quatro setores. Agora quer abrir o cofre e ligar tudo direto ao Núcleo, sem nenhuma proteção.',
      'f|Já vi aquelas trilhas ficarem vermelhas de tão quentes. Se ele ligar os fios, as outras regiões também vão queimar.',
      'ma|Você vigia o caminho. Eu vou até o cofre antes que o Barão ligue os fios.',
      'f|Deixe comigo. Vou avisar quem estiver subindo. Ninguém mais vai cair na conversa dele.'
    ]
  }
};
