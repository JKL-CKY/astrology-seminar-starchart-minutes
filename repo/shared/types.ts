export interface Planet {
  name: string;
  symbol: string;
  degree: number;
  sign: string;
  house: number;
  color: string;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';
  angle: number;
  orb: number;
  color: string;
}

export interface House {
  number: number;
  cusp: number;
  sign: string;
  interpretation: string;
}

export interface Astrologer {
  id: string;
  name: string;
  school: string;
  avatar: string;
  color: string;
}

export interface TranscriptSegment {
  speaker: string;
  start: number;
  end: number;
  text: string;
  astrologerId?: string;
}

export interface Seminar {
  id: string;
  title: string;
  date: string;
  topic: string;
  chartData: {
    planets: Planet[];
    aspects: Aspect[];
    houses: House[];
  };
  astrologers: Astrologer[];
  transcript: TranscriptSegment[];
  summary: {
    collectiveHoroscope: string;
    themeDiscussion: string;
    keyInsights: string[];
  };
  status: 'recording' | 'processing' | 'completed';
}

export interface EmailData {
  to: string;
  subject: string;
  markdown: string;
}
