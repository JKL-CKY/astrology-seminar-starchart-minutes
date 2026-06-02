import { TranscriptSegment, Astrologer } from '../../../shared/types';

export class PyannoteService {
  private astrologerSchools: Record<string, Astrologer> = {
    'SPEAKER_00': {
      id: '1',
      name: '张星辰',
      school: '现代占星',
      avatar: '🌟',
      color: '#FF6B6B'
    },
    'SPEAKER_01': {
      id: '2',
      name: '李星月',
      school: '进化占星',
      avatar: '🌙',
      color: '#4ECDC4'
    },
    'SPEAKER_02': {
      id: '3',
      name: '王星海',
      school: '吠陀占星',
      avatar: '🔮',
      color: '#FFE66D'
    }
  };

  async diarizeAudio(audioFilePath: string, transcript: TranscriptSegment[]): Promise<{ segments: TranscriptSegment[]; astrologers: Astrologer[] }> {
    try {
      const segments = transcript.map(segment => ({
        ...segment,
        astrologerId: this.astrologerSchools[segment.speaker]?.id
      }));

      const astrologers = Object.values(this.astrologerSchools);

      return { segments, astrologers };
    } catch (error) {
      console.error('Pyannote说话人分离错误:', error);
      throw new Error('说话人分离失败');
    }
  }

  identifySchool(text: string): string {
    if (text.includes('进化') || text.includes('灵魂') || text.includes('前世')) {
      return '进化占星';
    }
    if (text.includes('吠陀') || text.includes('印度') || text.includes('宿曜')) {
      return '吠陀占星';
    }
    if (text.includes('心理') || text.includes('荣格') || text.includes('潜意识')) {
      return '心理占星';
    }
    if (text.includes('古典') || text.includes('传统') || text.includes('中世纪')) {
      return '古典占星';
    }
    return '现代占星';
  }
}
