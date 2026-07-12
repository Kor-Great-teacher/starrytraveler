import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Compass, Coins, Star, Trophy, GraduationCap, CheckCircle2 
} from 'lucide-react';
import { Planet, PlayerStats } from '../types';
import { PLANETS } from '../data';
import { playClick, playSuccess } from '../utils/audio';

interface SpaceWorldmapProps {
  playerStats: PlayerStats;
  completedNodes: string[];
  onSelectPlanet: (planetId: string) => void;
  onBackToBase: () => void;
}

export default function SpaceWorldmap({
  playerStats,
  completedNodes,
  onSelectPlanet,
  onBackToBase
}: SpaceWorldmapProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  const getPlanetCompletion = (planet: Planet) => {
    const totalNodes = planet.nodes.length;
    const completed = planet.nodes.filter(n => completedNodes.includes(n.id)).length;
    return {
      completed,
      total: totalNodes,
      percentage: Math.round((completed / totalNodes) * 100)
    };
  };

  const handlePlanetClick = (planet: Planet) => {
    playClick();
    setSelectedPlanet(planet);
  };

  const handleWarp = (planetId: string) => {
    playSuccess();
    onSelectPlanet(planetId);
  };

  // Icon mapping for academic subjects
  const getSubjectIcon = (type: string) => {
    switch (type) {
      case 'math': return <Trophy className="w-6 h-6 text-amber-400" />;
      case 'language': return <GraduationCap className="w-6 h-6 text-sky-400" />;
      case 'science': return <Compass className="w-6 h-6 text-emerald-400" />;
      case 'art': return <Star className="w-6 h-6 text-violet-400 animate-pulse" />;
      default: return <Compass className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div id="space-worldmap" className="relative w-full min-h-screen z-10 p-4 md:p-6 flex flex-col justify-between text-white select-none">
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes orbit-ring {
          0% { transform: rotate3d(1, 1, 0, 0deg); }
          100% { transform: rotate3d(1, 1, 0, 360deg); }
        }
        .planet-float {
          animation: float-slow var(--float-duration, 6s) ease-in-out infinite;
          animation-delay: var(--float-delay, 0s);
        }
        .ring-rotate {
          transform: rotateX(75deg);
        }
      `}</style>

      {/* Header Bar */}
      <div className="flex justify-between items-center bg-slate-900/40 border border-slate-700/50 backdrop-blur-lg rounded-2xl p-3 md:p-4 shadow-xl">
        <button 
          onClick={() => {
            playClick();
            onBackToBase();
          }}
          className="flex items-center gap-2 text-xs md:text-sm bg-slate-950/60 hover:bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl cursor-pointer hover:scale-105 active:scale-95 transition-all text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>베이스캠프로 귀환</span>
        </button>

        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-400 animate-pulse" />
          <h1 className="text-xs md:text-base font-extrabold tracking-wide uppercase text-indigo-200">
            은하 배움 길잡이
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-xl shadow-[0_0_10px_rgba(245,158,11,0.15)]">
          <Coins className="w-4 h-4 text-yellow-300" />
          <span className="text-xs md:text-sm font-bold text-yellow-300">{playerStats.starPieces} <span className="font-normal text-[10px] text-yellow-400/80">별조각</span></span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6 flex-1 items-center justify-center">
        
        {/* Left/Center: Visual Star Map Solar System */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center relative min-h-[400px]">
          {/* Subtle orbital orbits in background */}
          <div className="absolute w-[450px] h-[450px] rounded-full border border-dashed border-indigo-500/5 rotate-12 pointer-events-none" />
          <div className="absolute w-[350px] h-[350px] rounded-full border border-dashed border-indigo-400/5 -rotate-45 pointer-events-none" />
          <div className="absolute w-[200px] h-[200px] rounded-full border border-dashed border-indigo-300/5 pointer-events-none" />

          {/* Central Bright Sun/Nebula representing core */}
          <div className="absolute w-16 h-16 rounded-full bg-indigo-500/20 blur-xl flex items-center justify-center pointer-events-none">
            <div className="w-6 h-6 rounded-full bg-indigo-400/40 blur-md" />
          </div>

          {/* Planets layout in Grid / Orbit Style */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-12 max-w-lg w-full relative z-10 px-4">
            {PLANETS.map((planet, index) => {
              const comp = getPlanetCompletion(planet);
              const isSelected = selectedPlanet?.id === planet.id;
              
              // Define positioning-based floating timings
              const timings = [
                { dur: '6s', dly: '0s' },
                { dur: '7.5s', dly: '1.2s' },
                { dur: '6.8s', dly: '0.5s' },
                { dur: '8s', dly: '1.8s' }
              ][index];

              // Color configs
              let pColor = 'from-amber-600 to-yellow-400 border-amber-400/30';
              let ringColor = 'border-amber-400/40 shadow-amber-400/20';
              let glowColor = 'shadow-amber-500/20';

              if (planet.gameType === 'language') {
                pColor = 'from-blue-600 to-sky-400 border-sky-400/30';
                ringColor = 'border-sky-400/40 shadow-sky-400/20';
                glowColor = 'shadow-sky-500/20';
              } else if (planet.gameType === 'science') {
                pColor = 'from-emerald-600 to-teal-400 border-emerald-400/30';
                ringColor = 'border-emerald-400/40 shadow-emerald-400/20';
                glowColor = 'shadow-emerald-500/20';
              } else if (planet.gameType === 'art') {
                pColor = 'from-violet-600 to-fuchsia-400 border-violet-400/30';
                ringColor = 'border-violet-400/40 shadow-violet-400/20';
                glowColor = 'shadow-violet-500/20';
              }

              return (
                <motion.div
                  key={planet.id}
                  className={`planet-float relative flex flex-col items-center justify-center p-3 rounded-3xl cursor-pointer transition-all duration-300 border ${
                    isSelected 
                      ? 'bg-slate-900/80 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.35)] scale-105' 
                      : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/60 hover:border-slate-700/50 hover:scale-103'
                  }`}
                  style={{
                    ['--float-duration' as any]: timings.dur,
                    ['--float-delay' as any]: timings.dly,
                  }}
                  onClick={() => handlePlanetClick(planet)}
                >
                  {/* Planet Core Sphere */}
                  <div className="relative w-24 h-24 flex items-center justify-center mb-3">
                    
                    {/* Glowing effect shadow behind */}
                    <div className={`absolute inset-1 rounded-full bg-gradient-to-tr ${pColor} blur-[8px] opacity-40`} />
                    
                    {/* The Planet Circle */}
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${pColor} border-2 border-white/10 shadow-[0_0_20px_var(--tw-shadow-color)] ${glowColor} overflow-hidden relative flex items-center justify-center`}>
                      {/* Internal shadow craters for planetary effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute top-2 left-3 w-5 h-5 rounded-full bg-white/10 blur-[1px]" />
                      <div className="absolute bottom-3 right-4 w-3 h-3 rounded-full bg-black/20" />
                      <div className="absolute top-8 right-3 w-2 h-2 rounded-full bg-black/25" />
                    </div>

                    {/* Outer Rings (e.g., Saturn-like rings) */}
                    <div className={`absolute w-[92px] h-[20px] rounded-full border-[2.5px] ring-rotate pointer-events-none ${ringColor} shadow-[0_0_10px_var(--tw-shadow-color)]`} />
                  </div>

                  {/* Planet Title */}
                  <h3 className="font-extrabold text-sm tracking-wide text-center drop-shadow-md">
                    {planet.displayName}
                  </h3>

                  {/* Planet Progress badge */}
                  <div className="mt-1.5 flex items-center gap-1">
                    {comp.percentage === 100 ? (
                      <span className="flex items-center gap-0.5 text-[10px] bg-indigo-500/30 text-indigo-300 font-extrabold px-2 py-0.5 rounded-full border border-indigo-400/20">
                        완료 👑
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-950/60 text-slate-300 px-2 py-0.5 rounded-full border border-white/5 font-semibold">
                        진행률 {comp.percentage}%
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right: Holographic Planet details panel */}
        <div className="lg:col-span-5 h-full flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {selectedPlanet ? (
              <motion.div
                key={selectedPlanet.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="bg-slate-900/40 border border-slate-700/50 backdrop-blur-lg rounded-3xl p-6 shadow-2xl flex flex-col justify-between min-h-[380px] relative overflow-hidden"
              >
                {/* Visual grid accent */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] opacity-40 pointer-events-none" />

                <div>
                  <div className="flex justify-between items-start gap-2 border-b border-slate-800/80 pb-3 mb-4 relative z-10">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800">
                        {getSubjectIcon(selectedPlanet.gameType)}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">행성 좌표 파일</span>
                        <h2 className="text-xl font-black tracking-tight">{selectedPlanet.name}</h2>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed mb-5 relative z-10">
                    {selectedPlanet.description}
                  </p>

                  {/* Level breakdown list */}
                  <div className="space-y-2.5 mb-6 relative z-10">
                    <h4 className="text-[11px] font-black uppercase text-indigo-300 tracking-wider">단원 목록</h4>
                    {selectedPlanet.nodes.map((node) => {
                      const isComp = completedNodes.includes(node.id);
                      return (
                        <div 
                          key={node.id} 
                          className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60 shadow-inner text-xs"
                        >
                          <span className="text-slate-300 flex items-center gap-2 truncate">
                            {isComp ? (
                              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-slate-600 shrink-0" />
                            )}
                            <span className="font-semibold truncate">{node.name}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                            {node.topic}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Enter Button with customized colors */}
                <div className="relative z-10 mt-auto">
                  <button
                    onClick={() => handleWarp(selectedPlanet.id)}
                    className="w-full py-3.5 rounded-2xl font-black tracking-widest text-sm text-slate-950 uppercase cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-xl flex items-center justify-center gap-1.5"
                    style={{
                      backgroundColor: selectedPlanet.accentColor,
                      boxShadow: `0 0 20px ${selectedPlanet.accentColor}50`
                    }}
                  >
                    <span>행성 진입 및 워프 가동</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-900/20 border border-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-inner flex flex-col justify-center items-center text-center min-h-[380px] border-dashed"
              >
                <Compass className="w-12 h-12 text-indigo-400/40 mb-3 animate-spin duration-3000" />
                <h3 className="text-base font-extrabold text-indigo-200/80 mb-1.5">행성이 미선택되었습니다</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  좌측 항성계 지도에서 탐사할 행성을 하나 터치하세요. 각 행성마다 다른 교과 중심의 미니게임 단원들을 포함하고 있습니다.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Footer text */}
      <div className="text-center text-[10px] text-slate-400 uppercase tracking-widest mt-3">
        ✦ 은하계 궤도선은 동화적 교육 시스템을 탑재하여 정상 작동 중입니다 ✦
      </div>
    </div>
  );
}
