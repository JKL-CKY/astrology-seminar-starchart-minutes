import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Planet, Aspect } from '../../../shared/types';

interface StarChartProps {
  planets: Planet[];
  aspects: Aspect[];
  onPlanetClick?: (planet: Planet) => void;
}

const ZODIAC_SIGNS = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];
const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

export default function StarChart({ planets, aspects, onPlanetClick }: StarChartProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<Aspect | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationAngle, setAnimationAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationAngle(prev => (prev + 0.1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawStarField(ctx, canvas.width, canvas.height);

    for (let i = 4; i > 0; i--) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * (i / 4), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(147, 51, 234, ${0.1 + i * 0.05})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * Math.PI / 180;
      const x = centerX + Math.cos(angle) * (radius + 30);
      const y = centerY + Math.sin(angle) * (radius + 30);

      ctx.font = '20px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#a78bfa';
      ctx.fillText(ZODIAC_SYMBOLS[i], x, y);

      const lineEndX = centerX + Math.cos(angle) * radius;
      const lineEndY = centerY + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(angle) * (radius * 0.8), centerY + Math.sin(angle) * (radius * 0.8));
      ctx.lineTo(lineEndX, lineEndY);
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (let i = 0; i < 12; i++) {
      const startAngle = (i * 30 - 90) * Math.PI / 180;
      const endAngle = ((i + 1) * 30 - 90) * Math.PI / 180;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius * 0.3, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = `rgba(88, 28, 135, ${0.1 + (i % 2) * 0.05})`;
      ctx.fill();
    }

    aspects.forEach(aspect => {
      const planet1 = planets.find(p => p.name === aspect.planet1);
      const planet2 = planets.find(p => p.name === aspect.planet2);
      if (!planet1 || !planet2) return;

      const angle1 = (planet1.degree - 90) * Math.PI / 180;
      const angle2 = (planet2.degree - 90) * Math.PI / 180;
      const planetRadius = radius * 0.6;

      const x1 = centerX + Math.cos(angle1) * planetRadius;
      const y1 = centerY + Math.sin(angle1) * planetRadius;
      const x2 = centerX + Math.cos(angle2) * planetRadius;
      const y2 = centerY + Math.sin(angle2) * planetRadius;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = hoveredAspect === aspect ? aspect.color : `${aspect.color}80`;
      ctx.lineWidth = hoveredAspect === aspect ? 3 : 1.5;
      ctx.setLineDash(aspect.type === 'square' || aspect.type === 'opposition' ? [5, 5] : []);
      ctx.stroke();
      ctx.setLineDash([]);
    });

  }, [planets, aspects, hoveredAspect, animationAngle]);

  const drawStarField = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    for (let i = 0; i < 100; i++) {
      const x = (Math.sin(i * 12.9898 + animationAngle * 0.01) * 43758.5453) % 1 * width;
      const y = (Math.sin(i * 78.233 + animationAngle * 0.01) * 43758.5453) % 1 * height;
      const size = (Math.sin(i * 43.758 + animationAngle * 0.02) * 43758.5453) % 1 * 2 + 0.5;
      const opacity = (Math.sin(i * 12.345 + animationAngle * 0.05) + 1) / 2 * 0.5 + 0.3;

      ctx.beginPath();
      ctx.arc(Math.abs(x), Math.abs(y), size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    }
  };

  const getPlanetPosition = (planet: Planet) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    const angle = (planet.degree - 90) * Math.PI / 180;
    const planetRadius = radius * 0.6;
    return {
      x: centerX + Math.cos(angle) * planetRadius,
      y: centerY + Math.sin(angle) * planetRadius
    };
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="w-full max-w-lg mx-auto rounded-full"
        style={{ animation: 'pulse 3s ease-in-out infinite' }}
      />

      {planets.map((planet, index) => {
        const pos = getPlanetPosition(planet);
        return (
          <motion.div
            key={planet.name}
            className="absolute cursor-pointer"
            style={{
              left: `calc(50% - 20px)`,
              top: `calc(50% - 20px)`,
              transform: `translate(${pos.x - 300}px, ${pos.y - 300}px)`,
              zIndex: 10
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.2
            }}
            onClick={() => {
              setSelectedPlanet(planet);
              onPlanetClick?.(planet);
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
              style={{
                background: `radial-gradient(circle, ${planet.color}, ${planet.color}80)`,
                boxShadow: `0 0 20px ${planet.color}80`
              }}
            >
              {planet.symbol}
            </div>
          </motion.div>
        );
      })}

      {selectedPlanet && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-900/90 backdrop-blur-sm rounded-xl p-4 border border-purple-500/50 min-w-64"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{selectedPlanet.symbol}</span>
            <div>
              <h3 className="font-bold text-purple-200">{selectedPlanet.name}</h3>
              <p className="text-sm text-purple-400">
                {selectedPlanet.sign} {selectedPlanet.degree.toFixed(1)}°
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-300">位于第 {selectedPlanet.house} 宫</p>
          <button
            onClick={() => setSelectedPlanet(null)}
            className="absolute top-2 right-2 text-purple-400 hover:text-white"
          >
            ✕
          </button>
        </motion.div>
      )}
    </div>
  );
}
