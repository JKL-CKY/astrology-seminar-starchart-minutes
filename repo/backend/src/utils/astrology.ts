import { Planet, Aspect, House } from '../../../shared/types';

const ZODIAC_SIGNS = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];
const PLANET_NAMES = ['太阳', '月亮', '水星', '金星', '火星', '木星', '土星', '天王星', '海王星', '冥王星'];
const PLANET_SYMBOLS = ['☉', '☽', '☿', '♀', '♂', '♃', '♄', '♅', '♆', '♇'];
const PLANET_COLORS = ['#FFD700', '#C0C0C0', '#87CEEB', '#FFB6C1', '#FF4500', '#9370DB', '#8B4513', '#40E0D0', '#4682B4', '#2F4F4F'];

const HOUSE_INTERPRETATIONS: Record<number, string> = {
  1: '自我表达、外在形象、个人特质的展现',
  2: '物质资源、财务状况、价值观建立',
  3: '沟通交流、学习能力、兄弟姐妹关系',
  4: '家庭根基、内心世界、父母影响',
  5: '创造力、浪漫恋情、自我表达',
  6: '健康日常、工作服务、责任义务',
  7: '合作关系、婚姻伴侣、公开敌人',
  8: '深度转化、共享资源、死亡重生',
  9: '高等教育、哲学信仰、长途旅行',
  10: '事业成就、社会地位、公众形象',
  11: '团体友谊、希望愿望、创新改革',
  12: '潜意识、隐秘事务、灵性修行'
};

export function generateChartData(date: Date): { planets: Planet[]; aspects: Aspect[]; houses: House[] } {
  const seed = date.getTime();
  const random = (min: number, max: number) => {
    const x = Math.sin(seed++) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };

  const planets: Planet[] = PLANET_NAMES.map((name, index) => ({
    name,
    symbol: PLANET_SYMBOLS[index],
    degree: random(0, 360),
    sign: ZODIAC_SIGNS[Math.floor(random(0, 12))],
    house: Math.floor(random(1, 13)),
    color: PLANET_COLORS[index]
  }));

  const aspectTypes: Aspect['type'][] = ['conjunction', 'opposition', 'trine', 'square', 'sextile'];
  const aspectAngles = [0, 180, 120, 90, 60];
  const aspectColors = ['#FFD700', '#FF4500', '#32CD32', '#FF6347', '#87CEEB'];

  const aspects: Aspect[] = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      if (random(0, 1) > 0.6) {
        const typeIndex = Math.floor(random(0, aspectTypes.length));
        aspects.push({
          planet1: planets[i].name,
          planet2: planets[j].name,
          type: aspectTypes[typeIndex],
          angle: aspectAngles[typeIndex],
          orb: random(0, 8),
          color: aspectColors[typeIndex]
        });
      }
    }
  }

  const houses: House[] = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    cusp: random(0, 30),
    sign: ZODIAC_SIGNS[(i + Math.floor(random(0, 12))) % 12],
    interpretation: HOUSE_INTERPRETATIONS[i + 1]
  }));

  return { planets, aspects, houses };
}

export function getAspectName(type: string): string {
  const names: Record<string, string> = {
    conjunction: '合相',
    opposition: '对分相',
    trine: '三分相',
    square: '四分相',
    sextile: '六分相'
  };
  return names[type] || type;
}

export function getZodiacEmoji(sign: string): string {
  const emojis: Record<string, string> = {
    '白羊座': '♈', '金牛座': '♉', '双子座': '♊', '巨蟹座': '♋',
    '狮子座': '♌', '处女座': '♍', '天秤座': '♎', '天蝎座': '♏',
    '射手座': '♐', '摩羯座': '♑', '水瓶座': '♒', '双鱼座': '♓'
  };
  return emojis[sign] || '✨';
}
