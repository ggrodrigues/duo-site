// Lançamento: quantos mundos estão abertos para o jogador (1 = só a Floresta dos Resistores).
// Para abrir o Capítulo 2, troque mundos para 2 (e assim por diante).
// dev: true mostra nas Configurações o botão de teste "Liberar todas as fases" e abre todos os mundos.
// Só para desenvolvimento: no site publicado fica sempre false.
// pularPara: número da fase (0 = fase 1) para testar; leva o save até ela (de novo sempre que o número muda). No site publicado fica null.
// repetir: trocar este número manda o save de volta para pularPara de novo (para rever a mesma cena).
// itensInfinitos: com dev, a mochila vem cheia e os artefatos não se gastam. No site publicado fica false.
window.OHM_LANCAMENTO = { mundos: 1, dev: false, pularPara: null, repetir: 0, itensInfinitos: false };
