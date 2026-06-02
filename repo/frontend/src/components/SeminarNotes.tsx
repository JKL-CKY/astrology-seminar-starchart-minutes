import { motion } from 'framer-motion';
import { TranscriptSegment, Astrologer } from '../../../shared/types';

interface SeminarNotesProps {
  transcript: TranscriptSegment[];
  astrologers: Astrologer[];
}

export default function SeminarNotes({ transcript, astrologers }: SeminarNotesProps) {
  const getAstrologer = (id?: string) => astrologers.find(a => a.id === id);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/30">
      <h2 className="text-2xl font-bold mb-6 text-indigo-200 flex items-center gap-2">
        <span className="text-3xl">📜</span>
        研讨会纪要
      </h2>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {transcript.map((segment, index) => {
          const astrologer = getAstrologer(segment.astrologerId);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 border-l-2 pb-4"
              style={{ borderColor: astrologer?.color || '#6366f1' }}
            >
              <div
                className="absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center text-sm"
                style={{ backgroundColor: astrologer?.color || '#6366f1' }}
              >
                {astrologer?.avatar || '✨'}
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold" style={{ color: astrologer?.color || '#a78bfa' }}>
                  {astrologer?.name || '神秘嘉宾'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-800/50 text-purple-300">
                  {astrologer?.school || '未知流派'}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(segment.start)} - {formatTime(segment.end)}
                </span>
              </div>

              <p className="text-gray-300 leading-relaxed">{segment.text}</p>
            </motion.div>
          );
        })}
      </div>

      {transcript.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <span className="text-4xl mb-4 block">🎙️</span>
          <p>暂无纪要内容</p>
        </div>
      )}
    </div>
  );
}
