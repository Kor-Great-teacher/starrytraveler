import { Planet, InventoryItem } from './types';

export const SHOP_ITEMS: InventoryItem[] = [
  {
    id: 'glass_dome',
    name: '유리 돔',
    description: '우주 먼지와 찬 바람으로부터 장미를 안전하게 지켜줍니다. 장미 행복도 보너스 +50%!',
    iconName: 'Shield',
    cost: 15,
    purchased: false,
    effectText: '유리 돔이 먼지 바람을 막아 장미가 따뜻하고 안전하게 지낼 수 있습니다.'
  },
  {
    id: 'watering_can',
    name: '빛나는 물뿌리개',
    description: '은하수의 신선한 별빛 수분을 모아 장미에게 줍니다. 물을 줄 때 획득 친밀도가 2배가 됩니다.',
    iconName: 'Droplet',
    cost: 25,
    purchased: false,
    effectText: '빛나는 물뿌리개로 우주의 신선한 영양을 가득 채워줍니다.'
  },
  {
    id: 'fox_scarf',
    name: '여우의 노란 목도리',
    description: '여우가 고마움의 표시로 남긴 부드러운 목도리입니다. 착용 시 획득 EXP가 20% 상승합니다.',
    iconName: 'Gift',
    cost: 40,
    purchased: false,
    effectText: '노란 목도리를 따스하게 두르고 더 자신감 있게 우주를 탐험합니다.'
  },
  {
    id: 'star_telescope',
    name: '별빛 망원경',
    description: '먼 우주의 미지의 별들을 더 선명하게 관측할 수 있습니다. 행성 잠금 해제 비용이 소폭 감소합니다.',
    iconName: 'Compass',
    cost: 60,
    purchased: false,
    effectText: '망원경을 통해 미지의 소행성들이 반짝이며 길을 밝혀주는 것이 보입니다.'
  }
];

export const PLANETS: Planet[] = [
  {
    id: 'math',
    name: '수학의 별 (Arithmetica)',
    displayName: '수학의 별',
    gameType: 'math',
    description: '끝없이 날아오는 혼돈의 숫자를 파괴하고 행성의 기하학적 균형과 수의 질서를 수호하세요.',
    themeColor: 'amber',
    accentColor: '#F59E0B',
    textColor: 'text-amber-400',
    bgGradient: 'from-amber-950/40 via-slate-900/90 to-amber-950/30',
    nodes: [
      {
        id: 'math-1',
        name: '덧셈의 은하수',
        topic: '기초 덧셈',
        description: '떠돌이 소행성의 덧셈 궤도를 수정하여 안전하게 통과하세요.',
        x: 20,
        y: 40,
        difficulty: '하',
        completed: false
      },
      {
        id: 'math-2',
        name: '뺄셈의 중력장',
        topic: '단자리 뺄셈',
        description: '행성의 중력에 이끌려 추락하는 뺄셈 유성우를 격파하세요.',
        x: 45,
        y: 30,
        difficulty: '하',
        completed: false
      },
      {
        id: 'math-3',
        name: '곱셈의 초신성',
        topic: '구구단 & 배수',
        description: '급격히 팽창하는 구구단 미지의 에너지를 계산 광선으로 융합시키세요.',
        x: 65,
        y: 65,
        difficulty: '중',
        completed: false
      },
      {
        id: 'math-4',
        name: '방정식의 암흑홀',
        topic: '미지수 찾기',
        description: '수학의 별 가장 중심부, 알 수 없는 빈칸(X)에 채워질 수를 구해 우주의 균열을 닫으세요.',
        x: 85,
        y: 45,
        difficulty: '상',
        completed: false
      }
    ]
  },
  {
    id: 'language',
    name: '언어의 별 (Logia)',
    displayName: '언어의 별',
    gameType: 'language',
    description: '우주 저편에 흩어진 한글 조각들을 맞추어 빛나는 단어의 별자리를 수놓아 보세요.',
    themeColor: 'sky',
    accentColor: '#38BDF8',
    textColor: 'text-sky-400',
    bgGradient: 'from-sky-950/40 via-slate-900/90 to-sky-950/30',
    nodes: [
      {
        id: 'lang-1',
        name: '이름의 숲',
        topic: '동화 속 사물 이름',
        description: '어린 왕자 이야기 속에 나오는 따뜻한 존재들의 이름을 별자리로 그립니다.',
        x: 25,
        y: 55,
        difficulty: '하',
        completed: false
      },
      {
        id: 'lang-2',
        name: '바오밥 언덕',
        topic: '여행을 위한 단어',
        description: '우주를 안전하게 여행하기 위해 소행성과 물건들의 올바른 단어를 철자합니다.',
        x: 50,
        y: 35,
        difficulty: '중',
        completed: false
      },
      {
        id: 'lang-3',
        name: '눈먼 이들의 오아시스',
        topic: '마음의 지혜',
        description: '"가장 소중한 것은 눈에 보이지 않아." 비밀스러운 철학적 문장을 완성해 별을 밝히세요.',
        x: 80,
        y: 60,
        difficulty: '상',
        completed: false
      }
    ]
  },
  {
    id: 'science',
    name: '과학의 별 (Physia)',
    displayName: '과학의 별',
    gameType: 'science',
    description: '우주 질서의 기둥인 물질의 세 가지 형태와 천체의 거대한 분류를 나누어 행성을 안정시키세요.',
    themeColor: 'emerald',
    accentColor: '#10B981',
    textColor: 'text-emerald-400',
    bgGradient: 'from-emerald-950/40 via-slate-900/90 to-emerald-950/30',
    nodes: [
      {
        id: 'sci-1',
        name: '삼태의 연구소',
        topic: '고체, 액체, 기체',
        description: '떠다니는 우주의 원소들을 고체(Solid), 액체(Liquid), 기체(Gas) 캡슐에 안전하게 담으세요.',
        x: 25,
        y: 30,
        difficulty: '하',
        completed: false
      },
      {
        id: 'sci-2',
        name: '천체의 궤도탑',
        topic: '항성, 행성, 위성',
        description: '스스로 빛을 내는 별(항성)과, 이를 도는 행성, 그리고 위성들을 바르게 구별하세요.',
        x: 60,
        y: 65,
        difficulty: '중',
        completed: false
      },
      {
        id: 'sci-3',
        name: '생태의 에너지 장막',
        topic: '생태계 생산,소비,분해',
        description: '생명 활동의 핵심, 생산자, 소비자, 분해자를 분류하여 푸른 우주 숲을 살려냅니다.',
        x: 85,
        y: 35,
        difficulty: '상',
        completed: false
      }
    ]
  },
  {
    id: 'art',
    name: '예술의 별 (Harmonia)',
    displayName: '예술의 별',
    gameType: 'art',
    description: '우주의 오케스트라가 내는 빛나는 별들의 음악을 듣고, 맑은 도레미 선율을 기억하여 다시 연주하세요.',
    themeColor: 'violet',
    accentColor: '#8B5CF6',
    textColor: 'text-violet-400',
    bgGradient: 'from-violet-950/40 via-slate-900/90 to-violet-950/30',
    nodes: [
      {
        id: 'art-1',
        name: '아기별의 허밍',
        topic: '3음계 따라하기',
        description: '갓 태어난 소행성이 내는 맑고 따뜻한 3가지 멜로디 조각을 연주하세요.',
        x: 30,
        y: 45,
        difficulty: '하',
        completed: false
      },
      {
        id: 'art-2',
        name: '은하수의 밤',
        topic: '4음계 앙상블',
        description: '수많은 별똥별이 흐르며 떨어뜨리는 아름다운 4개 건반의 조화로운 화음을 반복하세요.',
        x: 55,
        y: 65,
        difficulty: '중',
        completed: false
      },
      {
        id: 'art-3',
        name: '우주의 대합창',
        topic: '5음계 심포니',
        description: '우주 전체를 뒤흔드는 거대한 하모니의 흐름을 쫓아 마법의 오르골 선율을 가동시키세요.',
        x: 80,
        y: 35,
        difficulty: '상',
        completed: false
      }
    ]
  }
];

// Dialogue lines for basecamp characters
export const CHAR_DIALOGUES = {
  rose: [
    "당신은 내가 세상에서 유일한 꽃이라 생각하나요? 바람이 불면 전 조금 외로워져요.",
    "나를 위해 유리 돔을 씌워줄 수 있나요? 밤공기가 꽤 차갑거든요.",
    "은하수를 여행하는 것은 재밌나요? 나에게 다른 행성의 재미있는 계산이나 지혜 이야기를 해주세요.",
    "매일 나에게 주는 물 한 잔 속에, 당신의 다정한 마음이 담겨있다는 걸 느껴요.",
    "비록 제가 날카로운 가시 네 개밖에 없지만, 마음만큼은 누구보다도 여리답니다."
  ],
  fox: [
    "안녕! 넌 나에게 길들여진 친구가 될 거야. 그 말은 우리 서로에게 이 세상 오직 하나뿐인 존재가 된다는 뜻이지.",
    "사막이 아름다운 건, 어딘가에 우물을 숨기고 있기 때문이야.",
    "황금빛 밀밭을 볼 때마다 난 너의 빛나는 노란 머리카락을 생각하며 기뻐하게 될 거야.",
    "가장 중요한 것은 눈에 보이지 않아. 오직 마음으로만 가장 밝게 볼 수 있는 법이지.",
    "네 장미가 그토록 소중한 건, 네가 그 장미를 위해 쏟아부은 시간들 때문이란다."
  ],
  prince: [
    "내 행성은 너무 작아서 발걸음을 세 번만 떼도 해가 지는 것을 볼 수 있어.",
    "바오밥나무 싹은 아주 작을 때 얼른 뽑아야 해. 그렇지 않으면 내 작은 별이 쩍 하고 갈라질 거야.",
    "다른 행성의 지혜를 배워서 다시 돌아왔을 때, 내 장미가 활짝 웃고 있으면 정말 기쁘겠어.",
    "별들이 저렇게 빛나는 건, 우리 각자의 가슴속에 비밀을 가직한 아름다운 별이 하나씩 있기 때문이 아닐까?",
    "상자 속에 든 양은 지금쯤 곤히 잠들어 있을까?"
  ]
};

// MINI GAME DATASETS
export interface MathQuestion {
  question: string;
  answer: number;
  options: number[];
}

export const MATH_QUESTIONS: Record<string, MathQuestion[]> = {
  'math-1': [
    { question: '5 + 3 = ?', answer: 8, options: [6, 8, 9] },
    { question: '2 + 7 = ?', answer: 9, options: [9, 7, 10] },
    { question: '6 + 4 = ?', answer: 10, options: [8, 11, 10] },
    { question: '3 + 8 = ?', answer: 11, options: [11, 12, 10] },
    { question: '9 + 6 = ?', answer: 15, options: [14, 15, 16] },
  ],
  'math-2': [
    { question: '8 - 3 = ?', answer: 5, options: [4, 5, 6] },
    { question: '10 - 4 = ?', answer: 6, options: [5, 6, 7] },
    { question: '15 - 7 = ?', answer: 8, options: [9, 8, 7] },
    { question: '12 - 5 = ?', answer: 7, options: [6, 7, 8] },
    { question: '18 - 9 = ?', answer: 9, options: [9, 10, 8] },
  ],
  'math-3': [
    { question: '3 × 4 = ?', answer: 12, options: [10, 12, 14] },
    { question: '6 × 3 = ?', answer: 18, options: [16, 18, 20] },
    { question: '7 × 5 = ?', answer: 35, options: [30, 35, 40] },
    { question: '8 × 4 = ?', answer: 32, options: [32, 28, 36] },
    { question: '9 × 7 = ?', answer: 63, options: [56, 63, 72] },
  ],
  'math-4': [
    { question: 'X + 4 = 11 (X = ?)', answer: 7, options: [6, 7, 8] },
    { question: '15 - X = 8 (X = ?)', answer: 7, options: [7, 8, 9] },
    { question: 'X × 3 = 18 (X = ?)', answer: 6, options: [5, 6, 7] },
    { question: '20 ÷ X = 5 (X = ?)', answer: 4, options: [4, 5, 3] },
    { question: '2 × X + 3 = 11 (X = ?)', answer: 4, options: [3, 4, 5] },
  ]
};

export interface LanguagePuzzle {
  clue: string;
  answer: string; // The correct spelling
  letters: string[]; // pool of letters to select
}

export const LANGUAGE_PUZZLES: Record<string, LanguagePuzzle[]> = {
  'lang-1': [
    {
      clue: '어린 왕자가 무척 사랑하며, 네 개의 가시를 가진 꽃은?',
      answer: '장미',
      letters: ['장', '미', '꽃', '사', '여', '우']
    },
    {
      clue: '황금빛 머릿결의 어린 왕자가 두고 온 소중한 사막 동물 친구는?',
      answer: '사막여우',
      letters: ['사', '막', '여', '우', '토', '끼', '뱀']
    },
    {
      clue: '어린 왕자가 타고 여행한 하늘을 날아다니는 은하수 탈것은?',
      answer: '비행기',
      letters: ['비', '행', '기', '우', '선', '별', '돛']
    }
  ],
  'lang-2': [
    {
      clue: '아주 작을 때 뽑지 않으면 별을 터뜨릴 정도로 거대하게 자라는 식물은?',
      answer: '바오밥나무',
      letters: ['바', '오', '밥', '나', '무', '소', '풀', '꽃']
    },
    {
      clue: '어린 왕자의 행성에 세워진 불을 켜는 작은 탑 기둥은?',
      answer: '가로등',
      letters: ['가', '로', '등', '불', '집', '문', '길']
    },
    {
      clue: '어린 왕자가 양을 가두기 위해 부탁하여 그려준 소중한 도구는?',
      answer: '상자',
      letters: ['상', '자', '철', '쇠', '집', '바', '구']
    }
  ],
  'lang-3': [
    {
      clue: '서로를 알며 깊은 우정을 맺고 책임을 진다는 뜻의 단어는?',
      answer: '길들이다',
      letters: ['길', '들', '이', '다', '사', '랑', '믿', '음']
    },
    {
      clue: '어린 왕자가 말하길 "가장 소중한 것은 눈에 ____ 않는다."',
      answer: '보이지',
      letters: ['보', '이', '지', '들', '리', '만', '져', '느']
    },
    {
      clue: '"사람들은 눈으로 보지만 오직 ____으로만 똑바로 볼 수 있어."',
      answer: '마음',
      letters: ['마', '음', '머', '리', '생', '각', '지', '혜']
    }
  ]
};

export interface ScienceItem {
  name: string;
  category: 'solid' | 'liquid' | 'gas' | 'star' | 'planet' | 'satellite' | 'producer' | 'consumer' | 'decomposer';
  categoryLabel: string; // Friendly label for the UI box
}

export const SCIENCE_DATASETS: Record<string, { title: string, categories: { id: string, label: string }[], items: ScienceItem[] }> = {
  'sci-1': {
    title: '물질의 삼태 분류',
    categories: [
      { id: 'solid', label: '고체 (Solid)' },
      { id: 'liquid', label: '액체 (Liquid)' },
      { id: 'gas', label: '기체 (Gas)' }
    ],
    items: [
      { name: '돌멩이', category: 'solid', categoryLabel: '고체 (Solid)' },
      { name: '맑은 생수', category: 'liquid', categoryLabel: '액체 (Liquid)' },
      { name: '산소 기체', category: 'gas', categoryLabel: '기체 (Gas)' },
      { name: '황금 보석', category: 'solid', categoryLabel: '고체 (Solid)' },
      { name: '은하수 우유', category: 'liquid', categoryLabel: '액체 (Liquid)' },
      { name: '이산화탄소', category: 'gas', categoryLabel: '기체 (Gas)' },
      { name: '바오밥 나무토막', category: 'solid', categoryLabel: '고체 (Solid)' },
      { name: '달콤한 오렌지 주스', category: 'liquid', categoryLabel: '액체 (Liquid)' },
      { name: '주전자의 수증기', category: 'gas', categoryLabel: '기체 (Gas)' }
    ]
  },
  'sci-2': {
    title: '우주 천체의 대분류',
    categories: [
      { id: 'star', label: '항성 (스스로 빛남)' },
      { id: 'planet', label: '행성 (별 주위를 돔)' },
      { id: 'satellite', label: '위성 (행성 주위를 돔)' }
    ],
    items: [
      { name: '태양 (Sun)', category: 'star', categoryLabel: '항성 (스스로 빛남)' },
      { name: '지구 (Earth)', category: 'planet', categoryLabel: '행성 (별 주위를 돔)' },
      { name: '달 (Moon)', category: 'satellite', categoryLabel: '위성 (행성 주위를 돔)' },
      { name: '붉은 화성', category: 'planet', categoryLabel: '행성 (별 주위를 돔)' },
      { name: '시리우스', category: 'star', categoryLabel: '항성 (스스로 빛남)' },
      { name: '타이탄 (토성 위성)', category: 'satellite', categoryLabel: '위성 (행성 주위를 돔)' },
      { name: '거대 목성', category: 'planet', categoryLabel: '행성 (별 주위를 돔)' },
      { name: '북극성', category: 'star', categoryLabel: '항성 (스스로 빛남)' },
      { name: '포보스 (화성 위성)', category: 'satellite', categoryLabel: '위성 (행성 주위를 돔)' }
    ]
  },
  'sci-3': {
    title: '생물과 생태계의 역할',
    categories: [
      { id: 'producer', label: '생산자 (양분 생성)' },
      { id: 'consumer', label: '소비자 (양분 섭취)' },
      { id: 'decomposer', label: '분해자 (유기물 분해)' }
    ],
    items: [
      { name: '바오밥 장미풀', category: 'producer', categoryLabel: '생산자 (양분 생성)' },
      { name: '사막여우', category: 'consumer', categoryLabel: '소비자 (양분 섭취)' },
      { name: '숲의 버섯', category: 'decomposer', categoryLabel: '분해자 (유기물 분해)' },
      { name: '해바라기 꽃', category: 'producer', categoryLabel: '생산자 (양분 생성)' },
      { name: '초원의 메뚜기', category: 'consumer', categoryLabel: '소비자 (양분 섭취)' },
      { name: '토양 속 곰팡이', category: 'decomposer', categoryLabel: '분해자 (유기물 분해)' },
      { name: '푸른 밀밭', category: 'producer', categoryLabel: '생산자 (양분 생성)' },
      { name: '사막 전갈', category: 'consumer', categoryLabel: '소비자 (양분 섭취)' },
      { name: '낙엽 밑 지렁이', category: 'decomposer', categoryLabel: '분해자 (유기물 분해)' }
    ]
  }
};

export interface ArtNote {
  id: number;
  freq: number;
  color: string;
  glowColor: string;
  label: string;
}

export const ART_NOTES: ArtNote[] = [
  { id: 0, freq: 261.63, color: 'bg-rose-500 hover:bg-rose-400', glowColor: 'shadow-rose-500/50', label: '도 (Do)' },
  { id: 1, freq: 293.66, color: 'bg-amber-500 hover:bg-amber-400', glowColor: 'shadow-amber-500/50', label: '레 (Re)' },
  { id: 2, freq: 329.63, color: 'bg-emerald-500 hover:bg-emerald-400', glowColor: 'shadow-emerald-500/50', label: '미 (Mi)' },
  { id: 3, freq: 349.23, color: 'bg-sky-500 hover:bg-sky-400', glowColor: 'shadow-sky-500/50', label: '파 (Fa)' },
  { id: 4, freq: 392.00, color: 'bg-violet-500 hover:bg-violet-400', glowColor: 'shadow-violet-500/50', label: '솔 (Sol)' }
];

export const ART_SEQUENCES: Record<string, number[][]> = {
  'art-1': [
    [0, 2, 4], // C, E, G
    [1, 3, 2], // D, F, E
    [4, 2, 0]  // G, E, C
  ],
  'art-2': [
    [0, 1, 2, 3],
    [3, 2, 1, 0],
    [2, 0, 4, 1]
  ],
  'art-3': [
    [0, 2, 4, 3, 1],
    [4, 3, 2, 1, 0],
    [1, 3, 0, 2, 4]
  ]
};
