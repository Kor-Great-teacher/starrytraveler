import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
  isGolden?: boolean;
}

export default function BackgroundStars() {
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate twinkling stars
    const starCount = 100;
    const colors = [
      '#ffffff', // White
      '#bae6fd', // Soft Light Blue
      '#ddd6fe', // Lavender
      '#fcd34d', // Gold
      '#f59e0b', // Deep Gold/Amber
      '#f97316', // Orange-gold
    ];
    
    const generatedStars: Star[] = Array.from({ length: starCount }).map((_, i) => {
      const isGolden = Math.random() > 0.65;
      const starColor = isGolden 
        ? colors[3 + Math.floor(Math.random() * 3)] // amber/gold colors
        : colors[Math.floor(Math.random() * 3)];   // white/blue/lavender
      
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: isGolden ? Math.random() * 3 + 1.5 : Math.random() * 1.5 + 0.8,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 2,
        color: starColor,
        isGolden,
      };
    });
    setStars(generatedStars);

    // Create periodic shooting stars
    const triggerShootingStar = () => {
      const id = Date.now();
      const x = Math.random() * 60 + 20; // 20% to 80%
      const y = Math.random() * 30 + 10; // 10% to 40%
      const delay = Math.random() * 1.5;
      setShootingStars((prev) => [...prev, { id, x, y, delay }]);

      // Cleanup
      setTimeout(() => {
        setShootingStars((prev) => prev.filter((star) => star.id !== id));
      }, 4000);
    };

    // Initial shooting star
    setTimeout(triggerShootingStar, 4000);

    const interval = setInterval(triggerShootingStar, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#02030d] overflow-hidden pointer-events-none select-none z-0">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); filter: drop-shadow(0 0 4px var(--star-color, #fff)); }
        }
        @keyframes shooting-star {
          0% {
            transform: translate(0, 0) rotate(-35deg) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          30% {
            transform: translate(-350px, 245px) rotate(-35deg) scale(1);
            opacity: 0;
          }
          100% {
            transform: translate(-350px, 245px) rotate(-35deg) scale(0);
            opacity: 0;
          }
        }
        @keyframes float-nebula {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.3; }
          50% { transform: translate(30px, -20px) scale(1.08) rotate(3deg); opacity: 0.45; }
        }
        @keyframes pulse-constellation {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.6; }
        }
        .twinkle-star {
          animation: twinkle var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
        }
        .shooting-star-line {
          animation: shooting-star 3.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
          transform-origin: top right;
        }
        .constellation-line {
          animation: pulse-constellation 6s ease-in-out infinite;
        }
      `}</style>

      {/* Layered Deep Space watercolor wash and glowing nebulae (inspired by the uploaded image) */}
      <div 
        className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-br from-[#0c1033] to-[#121b5c] opacity-35 blur-[120px] top-[-10%] left-[-10%]"
        style={{ animation: 'float-nebula 32s ease-in-out infinite' }}
      />
      <div 
        className="absolute w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-[#1b194f] via-[#101445] to-[#132c66] opacity-40 blur-[130px] bottom-[-10%] right-[-15%]"
        style={{ animation: 'float-nebula 40s ease-in-out infinite 5s' }}
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full bg-indigo-950/25 blur-[100px] top-[30%] left-[25%]"
        style={{ animation: 'float-nebula 28s ease-in-out infinite 2s' }}
      />
      
      {/* Subtle paper-like grain overlay for watercolor feeling */}
      <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:3px_3px] pointer-events-none mix-blend-overlay" />

      {/* Elegant Golden and Light Blue Constellations from the Uploaded Image */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        {/* Constellation A (Left Side, Golden Starry Outline) */}
        <g className="constellation-line" style={{ animationDelay: '0s' }}>
          <polyline
            points="120,400 160,370 210,390 190,440 120,400"
            fill="none"
            stroke="#fcd34d"
            strokeWidth="0.75"
            strokeDasharray="3 3"
            opacity="0.5"
          />
          <polyline
            points="210,390 260,330 230,290"
            fill="none"
            stroke="#fcd34d"
            strokeWidth="0.75"
            strokeDasharray="3 3"
            opacity="0.5"
          />
          {/* Joint Stars */}
          <circle cx="120" cy="400" r="2" fill="#fbbf24" className="shadow-[0_0_6px_#f59e0b]" />
          <circle cx="160" cy="370" r="1.5" fill="#fcd34d" />
          <circle cx="210" cy="390" r="2" fill="#fbbf24" />
          <circle cx="190" cy="440" r="1.5" fill="#fcd34d" />
          <circle cx="260" cy="330" r="2.5" fill="#f59e0b" className="shadow-[0_0_8px_#f59e0b]" />
          <circle cx="230" cy="290" r="1.5" fill="#fcd34d" />
        </g>

        {/* Constellation B (Right Top Side, Crown/Crescent-like Golden Constellation) */}
        <g className="constellation-line" style={{ animationDelay: '2s' }}>
          <polyline
            points="720,180 740,220 780,240 820,220 840,180"
            fill="none"
            stroke="#fcd34d"
            strokeWidth="0.8"
            strokeDasharray="4 3"
            opacity="0.6"
          />
          <line x1="780" y1="240" x2="780" y2="280" stroke="#fcd34d" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.6" />
          {/* Joint Stars */}
          <circle cx="720" cy="180" r="2" fill="#fbbf24" />
          <circle cx="740" cy="220" r="2.5" fill="#f59e0b" className="shadow-[0_0_8px_#f59e0b]" />
          <circle cx="780" cy="240" r="3.5" fill="#f59e0b" className="shadow-[0_0_12px_#f59e0b]" />
          <circle cx="820" cy="220" r="2" fill="#fbbf24" />
          <circle cx="840" cy="180" r="2.5" fill="#fbbf24" />
          <circle cx="780" cy="280" r="2" fill="#fcd34d" />
        </g>

        {/* Constellation C (Bottom Right, Diagonal Wave) */}
        <g className="constellation-line" style={{ animationDelay: '4s' }}>
          <polyline
            points="810,540 860,490 890,520 930,480"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="0.75"
            strokeDasharray="2 3"
            opacity="0.4"
          />
          {/* Joint Stars */}
          <circle cx="810" cy="540" r="1.5" fill="#bae6fd" />
          <circle cx="860" cy="490" r="2" fill="#7dd3fc" />
          <circle cx="890" cy="520" r="1.5" fill="#bae6fd" />
          <circle cx="930" cy="480" r="2.5" fill="#38bdf8" className="shadow-[0_0_6px_#38bdf8]" />
        </g>
      </svg>

      {/* Twinkling Stars (including glowing golden diamond-flare stars) */}
      {stars.map((star) => {
        const isBigGolden = star.isGolden && star.size > 3;
        return (
          <div
            key={star.id}
            className="absolute rounded-full twinkle-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              boxShadow: star.size > 2 ? `0 0 ${star.isGolden ? '10px' : '4px'} ${star.color}` : 'none',
              // Set CSS custom properties for individual animation parameters
              ['--delay' as any]: `${star.delay}s`,
              ['--duration' as any]: `${star.duration}s`,
              ['--star-color' as any]: star.color,
            }}
          >
            {/* If it's a prominent golden star, add an exquisite glowing flare matching the uploaded image */}
            {isBigGolden && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none">
                {/* Horizontal flare line */}
                <div className="absolute top-1/2 left-0 right-0 h-[0.75px] bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent transform -translate-y-1/2" />
                {/* Vertical flare line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[0.75px] bg-gradient-to-b from-transparent via-[#fbbf24] to-transparent transform -translate-x-1/2" />
                {/* Soft glow aura */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-400/35 blur-[1.5px]" />
              </div>
            )}
          </div>
        );
      })}

      {/* Shooting Stars */}
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="absolute shooting-star-line"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
          }}
        >
          {/* Glowing head of shooting star */}
          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_#fff]" />
          {/* Tail */}
          <div 
            className="w-[140px] h-[1.5px] bg-gradient-to-l from-white via-amber-400/40 to-transparent origin-right"
            style={{ transform: 'translateX(-140px) translateY(-1px)' }}
          />
        </div>
      ))}
    </div>
  );
}
