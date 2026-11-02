/* ==========================================================================
   DADOS EDITÁVEIS — textos, preços, fotos e livros ficam aqui.
   Para mudar um valor, um texto ou uma foto, altere somente este bloco.
   ========================================================================== */

const SITE = {
  whatsapp: 'https://wa.me/5568992547865',
  instagram: 'https://www.instagram.com/englishbyvitoriab/',
};

const ABOUT_ITEMS = [
  'Aluna de Sistemas de Informação na UFAC',
  'Professora particular de inglês',
  'Ex-intercambista',
  'Experiência extensiva com inglês',
];

/* Fotos do carrossel (ordem de exibição) */
const PHOTOS = [
  { src: 'images/foto-1.jpg', alt: 'Vitória em uma selfie sorrindo, com uma turma de alunos sentada atrás dela em uma sala de aula' },
  { src: 'images/foto-2.jpg', alt: 'Grupo de participantes do Sakura Science Exchange Program acenando, com a faixa do programa, sob as cerejeiras' },
  { src: 'images/foto-3.jpg', alt: 'Grupo de pessoas posando em frente a uma parede da UFAC com palavras de tecnologia' },
  { src: 'images/foto-4.jpg', alt: 'Turma sentada no chão em frente a um quadro branco cheio de palavras em inglês' },
];

/* Pacotes de aulas. type "plan" = card simples, type "group" = turmas particulares */
const PLANS = [
  { id: 'light',    label: 'Light',    type: 'plan', items: ['1 aula por semana', '60 minutos por aula', '4 aulas por mês'],  price: 'R$ 170', period: '/mês' },
  { id: 'standard', label: 'Standard', type: 'plan', items: ['2 aulas por semana', '60 minutos por aula', '8 aulas por mês'], price: 'R$ 230', period: '/mês' },
  { id: 'fluency',  label: 'Fluency',  type: 'plan', items: ['3 aulas por semana', '60 minutos por aula', '12 aulas por mês'], price: 'R$ 300', period: '/mês' },
  { id: 'turmas',   label: 'Turmas particulares', type: 'group', meta: '1h30 por aula' },
];

const GROUP_CLASSES = {
  title: 'Turmas particulares',
  subtitle: 'Aulas em grupo para aprender inglês, praticar conversação e evoluir junto com outras pessoas.',
  duration: 'Aulas com duração de 1h30min',
  /* icon: users | level | chat | spark */
  highlights: [
    { icon: 'users', text: 'Turmas de até 5 pessoas' },
    { icon: 'level', text: 'Necessário nível de inglês parecido' },
    { icon: 'chat',  text: 'Mais prática de conversação' },
    { icon: 'spark', text: 'Vagas limitadas!', hot: true },
  ],
  pricesTitle: 'Valor por pessoa, de acordo com o tamanho da turma',
  tabs: [
    { id: 'd1', label: '1 dia na semana',  prices: [{ people: 2, value: 'R$ 210' }, { people: 3, value: 'R$ 195' }, { people: 4, value: 'R$ 180' }, { people: 5, value: 'R$ 165' }] },
    { id: 'd2', label: '2 dias na semana', prices: [{ people: 2, value: 'R$ 150' }, { people: 3, value: 'R$ 130' }, { people: 4, value: 'R$ 120' }, { people: 5, value: 'R$ 110' }] },
    { id: 'd3', label: '3 dias na semana', prices: [{ people: 2, value: 'R$ 280' }, { people: 3, value: 'R$ 265' }, { people: 4, value: 'R$ 245' }, { people: 5, value: 'R$ 230' }] },
  ],
  cta: 'Agende sua aula',
};

/* Livros da estante (Metodologia). "color" e "ink" usam só cores da paleta. */
const BOOKS = [
  {
    id: 'basic', title: ['Basic', 'English'], color: '#A8BFD8', ink: '#1B4168',
    audience: 'Modalidade voltada para alunos iniciantes.',
    description: 'Comece sua jornada no inglês aprendendo os fundamentos da língua, construindo uma base sólida para desenvolver suas habilidades.',
    topics: ['Alfabeto e pronúncia', 'Cumprimentos e apresentações', 'Vocabulário básico', 'Verb to be', 'Pronomes pessoais', 'Construção de frases simples', 'Conceitos iniciais da língua inglesa'],
  },
  {
    id: 'reading', title: ['English', 'Reading'], color: '#8E292B', ink: '#FFFFFF',
    audience: 'Modalidade voltada para leitura e interpretação.',
    description: 'Desenvolva sua compreensão da língua inglesa por meio de textos, interpretação e descoberta de novas palavras e expressões.',
    topics: ['Leitura de textos em inglês', 'Interpretação textual', 'Ampliação de vocabulário', 'Identificação de expressões', 'Compreensão de diferentes contextos', 'Desenvolvimento da leitura'],
  },
  {
    id: 'guided', title: ['Guided', 'Conversation'], color: '#1B4168', ink: '#FFFFFF',
    audience: 'Modalidade de conversação guiada.',
    description: 'Pratique conversação com orientação durante toda a aula, aprendendo a construir frases e se expressar com mais segurança.',
    topics: ['Perguntas e respostas', 'Diálogos sobre situações cotidianas', 'Orientação durante a construção das frases', 'Correção de pronúncia e gramática', 'Desenvolvimento gradual da confiança ao falar', 'Ampliação do vocabulário'],
  },
  {
    id: 'free', title: ['Free', 'Conversation'], color: '#827E7E', ink: '#FFFFFF',
    audience: 'Modalidade de conversação direta.',
    description: 'Uma experiência de conversação mais livre e espontânea, na qual você desenvolve sua fluência e aprende a se comunicar naturalmente.',
    topics: ['Conversas espontâneas em inglês', 'Discussão de temas variados', 'Expressão de opiniões', 'Desenvolvimento da fluência', 'Ampliação do vocabulário durante a conversa', 'Prática de situações reais'],
  },
  {
    id: 'grammar', title: ['English', 'Grammar'], color: '#414041', ink: '#D9D9D9',
    audience: 'Modalidade de aulas mais teóricas.',
    description: 'Aprenda a estrutura da língua inglesa, compreendendo as regras gramaticais e como utilizá-las corretamente na comunicação.',
    topics: ['Estrutura gramatical', 'Tempos verbais', 'Formação de frases', 'Regras gramaticais e aplicações', 'Exercícios de fixação', 'Construção de conhecimento teórico'],
  },
];

/* Montagem da estante. w/h são unidades de desenho (a estante escala sozinha).
   book = livro interativo (id de BOOKS) · f = livro decorativo · lean = inclinado
   sm:false = esconde no celular · stack = livros deitados · cup/box = objetos */
const SHELVES = [
  [
    { f: 1, w: 34, h: 176, c: '#8E292B' }, { f: 1, w: 26, h: 150, c: '#A8BFD8', ink: '#1B4168', sm: false }, { f: 1, w: 40, h: 192, c: '#414041' },
    { f: 1, w: 36, h: 168, c: '#1B4168', sm: false }, { f: 1, w: 30, h: 146, c: '#D9D9D9', ink: '#1B4168', sm: false },
    { book: 'basic', w: 62, ws: 52, h: 208 },
    { f: 1, w: 30, h: 164, c: '#D9D9D9', ink: '#1B4168' }, { f: 1, w: 44, h: 184, c: '#1B4168', sm: false },
    { book: 'reading', w: 66, ws: 56, h: 216 },
    { f: 1, w: 32, h: 172, c: '#827E7E', sm: false }, { f: 1, w: 40, h: 150, c: '#414041', sm: false }, { f: 1, w: 36, h: 178, c: '#8E292B', lean: -8 },
    { book: 'guided', w: 64, ws: 54, h: 200 },
    { f: 1, w: 34, h: 170, c: '#A8BFD8', ink: '#1B4168', sm: false },
    { cup: 1, sm: false },
  ],
  [
    { f: 1, w: 36, h: 170, c: '#1B4168', sm: false }, { f: 1, w: 30, h: 152, c: '#8E292B', sm: false }, { f: 1, w: 44, h: 192, c: '#827E7E', sm: false },
    { book: 'free', w: 64, ws: 56, h: 206 },
    { f: 1, w: 32, h: 168, c: '#414041' }, { f: 1, w: 42, h: 190, c: '#8E292B' }, { f: 1, w: 28, h: 150, c: '#D9D9D9', ink: '#1B4168' },
    { book: 'grammar', w: 66, ws: 58, h: 212 },
    { f: 1, w: 38, h: 176, c: '#1B4168' }, { f: 1, w: 28, h: 154, c: '#A8BFD8', ink: '#1B4168' }, { f: 1, w: 34, h: 166, c: '#414041', sm: false },
    { f: 1, w: 40, h: 186, c: '#827E7E', lean: 9, sm: false }, { f: 1, w: 26, h: 148, c: '#8E292B', sm: false },
    { box: 1, sm: false },
  ],
  [
    { f: 1, w: 36, h: 176, c: '#1B4168' }, { f: 1, w: 30, h: 158, c: '#8E292B' }, { f: 1, w: 42, h: 190, c: '#D9D9D9', ink: '#1B4168' }, { f: 1, w: 28, h: 150, c: '#414041' },
    { f: 1, w: 34, h: 168, c: '#A8BFD8', ink: '#1B4168', sm: false }, { f: 1, w: 40, h: 182, c: '#827E7E', sm: false }, { f: 1, w: 32, h: 160, c: '#8E292B', sm: false },
    { stack: [{ w: 190, sh: 30, c: '#8E292B' }, { w: 170, sh: 26, c: '#1B4168', off: 12 }, { w: 182, sh: 28, c: '#827E7E', off: 4 }, { w: 150, sh: 24, c: '#414041', off: 18 }], w: 190, ws: 130 },
    { f: 1, w: 32, h: 164, c: '#8E292B', sm: false }, { f: 1, w: 26, h: 140, c: '#A8BFD8', ink: '#1B4168', sm: false }, { f: 1, w: 38, h: 180, c: '#1B4168', sm: false }, { f: 1, w: 30, h: 154, c: '#D9D9D9', ink: '#1B4168', sm: false },
    { f: 1, w: 34, h: 172, c: '#414041', sm: false },
  ],
];
