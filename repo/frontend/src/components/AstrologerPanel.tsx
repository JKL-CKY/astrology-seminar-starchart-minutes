import { motion } from 'framer-motion';
import { Astrologer } from '../../../shared/types';

interface AstrologerPanelProps {
  astrologers: Astrologer[];
}

export default function AstrologerPanel({ astrologers }: AstrologerPanelProps) {
  return (
    <div className="bg-gradient-to-br from-pink-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30">
      <h2 className="text-2xl font-bold mb-6 text-pink-200 flex items-center gap-2">
        <span className="text-3xl">🔮</span>
        本期占星师
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {astrologers.map((astrologer, index) => (
          <motion.div
            key={astrologer.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.15 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
            style={{
              borderLeft: `4px solid ${astrologer.color}`
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${astrologer.color}40, ${astrologer.color}20)`,
                boxShadow: `0 0 20px ${astrologer.color}40`
              }}
            >
              {astrologer.avatar}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg" style={{ color: astrologer.color }}>
                {astrologer.name}
              </h3>
              <p className="text-sm text-gray-400">{astrologer.school}</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-2xl">✨</span>
            </div>
          </motion.div>
        ))}
      </div>

      {astrologers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <span className="text-4xl mb-4 block">🌟</span>
          <p>等待占星师入场...</p>
        </div>
      )}
    </div>
  );
}
