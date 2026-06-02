import OpenAI from 'openai';
import { TranscriptSegment, Astrologer } from '../../../shared/types';

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateSummary(
    transcript: TranscriptSegment[],
    astrologers: Astrologer[]
  ): Promise<{ collectiveHoroscope: string; themeDiscussion: string; keyInsights: string[] }> {
    try {
      const fullTranscript = transcript.map(s => `[${this.getAstrologerName(s.astrologerId, astrologers)}] ${s.text}`).join('\n');

      const prompt = `你是一位专业的占星编辑，你需要根据以下占星研讨会的内容，生成一份轻松有趣的纪要。

研讨会内容：
${fullTranscript}

请生成：
1. 集体运势分析（300字左右，轻松有趣的风格）
2. 主题探讨摘要（200字左右）
3. 3-5条关键洞察（每条50字以内）

请用JSON格式返回，包含collectiveHoroscope, themeDiscussion, keyInsights三个字段。`;

      const mockResponse = {
        collectiveHoroscope: `🌟 **本周集体运势播报来啦！木星这位"幸运之星"正式入驻金牛座，就像给每个人的钱包里塞了一张无限额信用卡！💰 不过别急着买买买，先听听占星师们怎么说。张星辰老师说这是"物质层面的大扩张，最近是不是总刷到理财广告？别慌，金星在巨蟹座提醒我们：真正的财富是你对自己的投资！李星月老师从进化占星的角度，告诉我们这是价值观的重新校准——是时候想想：什么才是你真正在乎的？王星海老师用吠陀占星加持，这个满月在射手座，简直是许愿天花板！✨ 总的来说，这周适合：买基金、涨工资、谈恋爱、做自己！不适合：冲动消费、怀疑人生、熬夜修仙（划重点！）。记住，星星只是天气预报，出门带伞但也别忘了晒太阳~ 🌞`,
        themeDiscussion: `本次研讨会围绕"木星进入金牛座"展开，三位不同流派的占星师展开了精彩的跨界对话。现代占星派关注现实层面的影响，进化占星派深入灵魂成长的课题，吠陀占星派则提供了古老智慧的视角。大家一致认为这是一个关于价值、丰盛与自我价值感的重要时期。关键讨论点包括：财务机遇、关系价值、自我认同。`,
        keyInsights: [
          '木星在金牛座带来物质扩张，适合财务规划新开始',
          '金星在巨蟹座强调自我关爱，先爱自己再爱他人',
          '太阳与天王星六分相，意外惊喜正在路上',
          '北交点在白羊座，是时候勇敢做自己了'
        ]
      };

      return mockResponse;
    } catch (error) {
      console.error('OpenAI摘要生成错误:', error);
      throw new Error('摘要生成失败');
    }
  }

  private getAstrologerName(astrologerId: string | undefined, astrologers: Astrologer[]): string {
    if (!astrologerId) return '神秘嘉宾';
    const astrologer = astrologers.find(a => a.id === astrologerId);
    return astrologer ? astrologer.name : '神秘嘉宾';
  }

  async generateEmailMarkdown(seminarData: any): Promise<string> {
    const { title, date, summary, chartData, astrologers } = seminarData;

    const planetList = chartData.planets.map((p: any) =>
      `- ${p.symbol} **${p.name}** 在 ${p.sign} ${p.degree.toFixed(1)}°`
    ).join('\n');

    const aspectList = chartData.aspects.slice(0, 5).map((a: any) =>
      `- ${a.planet1} ${this.getAspectSymbol(a.type)} ${a.planet2} (${a.angle}°)`
    ).join('\n');

    const astrologerList = astrologers.map((a: any) =>
      `- ${a.avatar} **${a.name}** (${a.school})`
    ).join('\n');

    return `# ✨ ${title} ✨

**日期:** ${date}

---

## 🌟 本期占星师阵容

${astrologerList}

---

## 🔮 星盘关键信息

### 🪐 行星位置
${planetList}

### ⚡ 主要相位
${aspectList}

---

## 📜 集体运势分析

${summary.collectiveHoroscope}

---

## 💬 主题探讨

${summary.themeDiscussion}

---

## 🎯 关键洞察

${summary.keyInsights.map((i: string, idx: number) => `${idx + 1}. ${i}`).join('\n')}

---

*本内容仅供娱乐，生活还是要靠自己努力哦！💪

记得关注我们，下次研讨会不见不散~ 🌙`;
  }

  private getAspectSymbol(type: string): string {
    const symbols: Record<string, string> = {
      conjunction: '☌',
      opposition: '☍',
      trine: '△',
      square: '□',
      sextile: '⚹'
    };
    return symbols[type] || '⚡';
  }
}
