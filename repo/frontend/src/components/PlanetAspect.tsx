import { motion } from 'framer-motion';
import { Aspect } from '../../../shared/types';

interface PlanetAspectProps {
  aspects: Aspect[];
  onAspectHover?: (aspect: Aspect | null) => void;
}

const ASPECT_NAMES: Record<string, string> = {
  conjunction: '合相',
  opposition: '对分相',
  trine: '三分相',
  square: '四分相',
  sextile: '六分相'
};

const ASPECT_DESCRIPTIONS: Record<string, string> = {
  conjunction: '能量融合，两颗行星的力量结合在一起',
  opposition: '张力与平衡，需要找到对立面的和谐',
  trine: '和谐与好运，能量流动顺畅',
  square: '挑战与成长，需要克服的障碍',
  sextile: '机会与合作，带来积极的可能性'
};

const ASPECT_SYMBOLS: Record<string, string> = {
  conjunction: '☌',
  opposition: '☍',
  trine: '△',
  square: '□',
  sextile: '⚹'
};

export default function PlanetAspect({ aspects, onAspectHover }: PlanetAspectProps) {
  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
      <h2 className="text-2xl font-bold mb-6 text-purple-200 flex items-center gap-2">
        <span className="text-3xl">⚡</span>
        行星相位
      </h2>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {aspects.map((aspect, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-xl bg-purple-800/30 hover:bg-purple-700/40 transition-all cursor-pointer group"
            onMouseEnter={() => onAspectHover?.(aspect)}
            onMouseLeave={() => onAspectHover?.(null)}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{
                  background: `linear-gradient(135deg, ${aspect.color}40, ${aspect.color}20)`,
                  border: `2px solid ${aspect.color}`
                }}
              >
                {ASPECT_SYMBOLS[aspect.type]}
              </div>
              <div>
                <p className="font-semibold text-purple-100">
                  {aspect.planet1} {ASPECT_SYMBOLS[aspect.type]} {aspect.planet2}
                </p>
                <p className="text-sm text-purple-400">
                  {ASPECT_NAMES[aspect.type]} · {aspect.angle}° · 容许度 {aspect.orb.toFixed(1)}°
                </p>
              </div>
            </div>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: aspect.color }} />
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-purple-900/50 rounded-xl">
        <h3 className="font-semibold text-purple-200 mb-3">相位类型说明</h3>
        <div className="grid grid-cols-1 gap-2 text-sm">
          {Object.entries(ASPECT_NAMES).map(([type, name]) => (
            <div key={type} className="flex items-start gap-2 text-purple-300">
              <span className="text-purple-400">{ASPECT_SYMBOLS[type]}</span>
              <span>
                <strong className="text-purple-200">{name}</strong>: {ASPECT_DESCRIPTIONS[type]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
