import type { TemplateCollection } from './types';

export const templates: TemplateCollection = {
    decades: {
        name: 'Viajante do Tempo',
        description: 'Veja-se através das décadas.',
        icon: '⏳',
        isPolaroid: true,
        prompts: [
            { id: 'Anos 50', base: 'Recriar como um retrato fotográfico dos anos 1950, com moda e cabelo daquela época, com cores quentes e levemente desbotadas.' },
            { id: 'Anos 60', base: 'Recriar como um retrato fotográfico dos anos 1960, com estilo mod, cores vibrantes e um leve grão de filme.' },
            { id: 'Anos 70', base: 'Recriar como um retrato fotográfico dos anos 1970, com estilo disco/boêmio, tons terrosos e quentes.' },
            { id: 'Anos 80', base: 'Recriar como uma foto de estúdio glamorosa dos anos 1980, com cores neon, cabelo volumoso e foco suave.' },
            { id: 'Anos 90', base: 'Recriar como uma foto casual dos anos 1990, com estilo grunge/pop e a aparência de uma foto instantânea.' },
            { id: 'Anos 2000', base: 'Recriar como uma foto do início dos anos 2000, com estilo Y2K/pop-punk e a aparência nítida de uma câmera digital antiga.' },
        ]
    },
    styleLookbook: {
        name: "Lookbook de Estilo",
        description: "Seu ensaio de moda pessoal.",
        icon: '👗',
        isPolaroid: false,
        styles: [
            'Clássico / Casual', 'Streetwear', 'Vintage', 'Gótico', 'Preppy', 'Minimalista',
            'Athleisure', 'Old Money / Luxo Discreto', 'Boêmio (Boho)', 'Business Casual',
            'Grunge anos 90', 'Coquetel / Formal'
        ],
        prompts: [
            { id: 'Look 1', base: 'uma foto de corpo inteiro, em pé' },
            { id: 'Look 2', base: 'uma foto de meio corpo, sorrindo' },
            { id: 'Look 3', base: 'uma foto espontânea andando' },
            { id: 'Look 4', base: 'uma foto mostrando detalhes da roupa' },
            { id: 'Look 5', base: 'uma pose sentada' },
            { id: 'Look 6', base: 'um close-up focado nos acessórios' },
        ]
    },
    eightiesMall: {
        name: "Sessão no Shopping 80's",
        description: "Retratos totalmente tubulares dos anos 80.",
        icon: '📼',
        isPolaroid: false,
        prompts: [
            { id: 'Sorrindo', base: 'uma pose amigável e sorridente' },
            { id: 'Pensativo', base: 'uma pose pensativa, olhando para longe da câmera' },
            { id: 'Divertido', base: 'uma pose divertida, rindo' },
            { id: 'Sério', base: 'uma pose séria e dramática' },
            { id: 'Mão no Queixo', base: 'posando com a mão no queixo' },
            { id: 'Por cima do Ombro', base: 'olhando para trás por cima do ombro' },
        ]
    },
    figurines: {
        name: 'Miniatura de Mim',
        description: 'Suas próprias estatuetas colecionáveis.',
        icon: '🧍‍♂️',
        isPolaroid: false,
        prompts: [
            { id: 'Bobblehead', base: 'Uma figura realista de bobblehead da pessoa com uma cabeça superdimensionada, exibida em uma mesa de madeira polida ao lado de um teclado de computador.' },
            { id: 'Estatueta de Porcelana', base: 'Uma delicada estatueta de porcelana de souvenir da pessoa, pintada com cores brilhantes, sentada em uma toalhinha de renda sobre uma cômoda vintage.' },
            { id: 'Action Figure Retrô', base: 'Uma figura de ação retrô estilo anos 1980 da pessoa, completa com articulações e pintura levemente desgastada, em uma pose dinâmica sobre uma base de diorama rochoso.' },
            { id: 'Figura de Vinil', base: 'Um brinquedo de arte colecionável de vinil estilizado da pessoa com características minimalistas, em pé em uma prateleira cheia de outros brinquedos semelhantes.' },
            { id: 'Figura de Pelúcia', base: 'Uma figura de pelúcia macia e fofa da pessoa com textura de tecido detalhada e costura, sentada em uma cama arrumada.' },
            { id: 'Arte Folclórica de Madeira', base: 'Uma figura de arte folclórica de madeira esculpida à mão da pessoa, pintada com detalhes rústicos e encantadores, em pé sobre um bloco de madeira simples em uma mesa de feira de artesanato.' },
        ]
    },
    hairStyler: {
        name: 'Estilista de Cabelo',
        description: 'Experimente novos penteados e cores.',
        icon: '💇‍♀️',
        isPolaroid: false,
        prompts: [
            { id: 'Short', base: 'um penteado curto' },
            { id: 'Medium', base: 'um penteado de comprimento médio' },
            { id: 'Long', base: 'um penteado longo' },
            { id: 'Straight', base: 'cabelo liso' },
            { id: 'Wavy', base: 'cabelo ondulado' },
            { id: 'Curly', base: 'cabelo cacheado' },
        ]
    },
    impossibleSelfies: {
        name: 'Fotos Impossíveis',
        description: 'Fotos que desafiam a realidade.',
        icon: '🚀',
        isPolaroid: false,
        prompts: [
            { id: 'Com Lincoln', base: 'A pessoa posando com Abraham Lincoln, que também está fazendo um sinal de paz e mostrando a língua. Mantenha o local original.' },
            { id: 'Alien & Bolhas', base: 'A pessoa posando ao lado de um alienígena realista segurando duas pistolas de bolhas, soprando milhares de bolhas. Mantenha a pose da pessoa e o local original.' },
            { id: 'Quarto de Filhotes', base: 'A pessoa posando em uma sala cheia de cem cachorrinhos diferentes.' },
            { id: 'Fantoches Cantores', base: 'A pessoa posando em uma sala cheia de grandes fantoches de feltro, caprichosos e coloridos, que estão cantando.' },
            { id: 'Frango Frito Gigante', base: 'A pessoa posando com o braço em volta de um filé de frango de 1,2 metro de altura. Mantenha a expressão facial da pessoa exatamente a mesma.' },
            { id: 'Yeti de Surpresa', base: 'Adicione um yeti realista em pé ao lado da pessoa no lado esquerdo da foto, combinando com a iluminação. Mantenha a pose e o rosto da pessoa exatamente os mesmos.' },
        ]
    },
    headshots: {
        name: "Retratos Profissionais",
        description: "Fotos de perfil profissionais.",
        icon: '💼',
        isPolaroid: false,
        prompts: [
            { id: 'Terno de Negócios', base: 'vestindo um terno escuro com uma camisa branca impecável' },
            { id: 'Casual Elegante', base: 'vestindo um suéter de malha casual elegante sobre uma camisa de colarinho' },
            { id: 'Profissional Criativo', base: 'vestindo uma gola alta escura' },
            { id: 'Look Corporativo', base: 'vestindo uma camisa social azul clara' },
            { id: 'Moderno e Vibrante', base: 'vestindo um blazer colorido' },
            { id: 'Descontraído', base: 'vestindo uma camiseta simples de alta qualidade sob uma jaqueta casual' },
        ]
    },
    retroPoster: {
        name: 'Pôster Retrô',
        description: 'Seja a estrela de um pôster de filme vintage.',
        icon: '🎞️',
        isPolaroid: false,
        prompts: [
            { id: 'Pôster', base: 'Transforme a foto em um pôster de filme de aventura no estilo dos anos 80.' },
        ]
    },
    cyberpunkCity: {
        name: 'Cidade Cyberpunk',
        description: 'Entre em uma metrópole futurista de neon.',
        icon: '🌃',
        isPolaroid: false,
        prompts: [
            { id: 'Vista da Rua', base: 'Coloque a pessoa em uma rua movimentada de uma cidade cyberpunk à noite.' },
            { id: 'Arranha-céu', base: 'Retrato da pessoa na varanda de um arranha-céu em uma cidade cyberpunk.' },
            { id: 'Beco', base: 'A pessoa em um beco escuro e chuvoso iluminado por neon em uma cidade cyberpunk.' },
        ]
    },
    oilPainting: {
        name: 'Pintura a Óleo',
        description: 'Transforme sua foto em uma pintura clássica.',
        icon: '🎨',
        isPolaroid: false,
        prompts: [
            { id: 'Retrato Clássico', base: 'Recrie a foto como uma pintura a óleo clássica com pinceladas visíveis e texturizadas e cores ricas.' },
        ]
    },
    watercolor: {
        name: 'Aquarela',
        description: 'Converta sua imagem em arte delicada.',
        icon: '🖌️',
        isPolaroid: false,
        prompts: [
            { id: 'Lavagem Expressiva', base: 'Recrie a foto como uma pintura em aquarela vibrante e expressiva com cores fluidas e bordas suaves.' },
        ]
    },
    steampunk: {
        name: 'Universo Steampunk',
        description: 'Reimagine-se na era vitoriana a vapor.',
        icon: '⚙️',
        isPolaroid: false,
        prompts: [
            { id: 'Inventor', base: 'Transforme a pessoa em um inventor steampunk, completo com óculos de proteção e engrenagens de latão.' },
            { id: 'Aviador', base: 'Retrate a pessoa como um aviador steampunk em frente a uma aeronave ornamentada.' },
        ]
    },
    pixelArt: {
        name: 'Pixel Art',
        description: 'Torne-se um personagem de video game retrô.',
        icon: '🕹️',
        isPolaroid: false,
        prompts: [
            { id: 'Sprite de 16 bits', base: 'Transforme a foto em um sprite de personagem de pixel art de 16 bits, no estilo de um video game de aventura clássico.' },
        ]
    },
};