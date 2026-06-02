import { motion } from 'framer-motion';

interface SummaryPanelProps {
  collectiveHoroscope: string;
  themeDiscussion: string;
  keyInsights: string[];
}

export default function SummaryPanel({ collectiveHoroscope, themeDiscussion, keyInsights }: SummaryPanelProps) {
  return (
    <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/30">
      <h2 className="text-2xl font-bold mb-6 text-amber-200 flex items-center gap-2">
        <span className="text-3xl">✨</span>
        研讨会精华
      </h2>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-bold text-amber-300 mb-3 flex items-center gap-2">
            <span>🌟</span> 集体运势分析
          </h3>
          <div className="p-4 bg-amber-900/30 rounded-xl text-gray-300 leading-relaxed">
            {collectiveHoroscope || '等待生成中...'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-bold text-amber-300 mb-3 flex items-center gap-2">
            <span>💬</span> 主题探讨
          </h3>
          <div className="p-4 bg-amber-900/30 rounded-xl text-gray-300 leading-relaxed">
            {themeDiscussion || '等待生成中...'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-bold text-amber-300 mb-3 flex items-center gap-2">
            <span>🎯</span> 关键洞察
          </h3>
          <div className="space-y-2">
            {keyInsights.length > 0 ? (
              keyInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-amber-900/20 rounded-lg hover:bg-amber-900/40 transition-all"
                >
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)'
                    }}
                  >
                    {index + 1}
                  </span>
                  <p className="text-gray-300">{insight}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">等待生成中...</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
