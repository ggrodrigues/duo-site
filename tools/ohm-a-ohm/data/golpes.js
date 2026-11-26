// Golpes do MAX, um repertório por mundo. O tamanho do combo da etapa escolhe o golpe:
// 1 fusão = corte, 2 = corte duplo, 3 = impacto, 4 = magia I, 5 = magia II, 6+ = magia III.
// arte: golpes que já têm folha em golpes/<pasta>/<golpe>.webp (4x2 quadros, impacto no 4º).
// Sem arte, o jogo desenha um efeito provisório nas cores do mundo.
window.OHM_GOLPES = [
  { pasta: 'floresta', cor: ['#fff1b8', '#ff9d1c'], simbolo: ['Ω', 'Ω', 'Ω', 'Ω'], arte: ['corte', 'impacto', 'magia1', 'magia2', 'magia3'],
    golpes: { corte: 'Corte de Faísca', impacto: 'Punho de Cobre', magia1: 'Limalha Dançante', magia2: 'Laço Magnético', magia3: 'Raio de Ohm' } },
  { pasta: 'montanhas', cor: ['#e6f9ff', '#3fb6ff'], simbolo: ['F', 'C', 'F', 'C'], arte: ['corte', 'impacto', 'magia1', 'magia2', 'magia3'],
    golpes: { corte: 'Lâmina Estática', impacto: 'Soco de Descarga', magia1: 'Chuva de Coulomb', magia2: 'Avalanche de Carga', magia3: 'Gaiola de Faraday' } },
  { pasta: 'minas', cor: ['#ffd9de', '#ff4f6a', '#5f86ff'], simbolo: ['N', 'S', 'N', 'S'], arte: ['corte', 'impacto', 'magia1', 'magia2', 'magia3'],
    golpes: { corte: 'Garra de Ferrite', impacto: 'Martelo de Indução', magia1: 'Pulso de Ampère', magia2: 'Redemoinho de Lenz', magia3: 'Tempestade Magnética' } },
  { pasta: 'placa', cor: ['#eafff6', '#2fffc0'], simbolo: ['∇·E', '∇·B', '∇×E', '∇×B'], arte: ['corte', 'impacto', 'magia1', 'magia2', 'magia3'],
    golpes: { corte: 'Lâmina de Plasma', impacto: 'Punho Voltaico', magia1: 'Ressonância LC', magia2: 'Onda Eletromagnética', magia3: 'As Quatro Equações' } }
];
