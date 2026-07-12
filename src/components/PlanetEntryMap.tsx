import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Compass, Coins, Award, HelpCircle, Lock, Play, CheckCircle2 
} from 'lucide-react';
import { Planet, PlanetNode, PlayerStats } from '../types';
import { playClick, playSuccess, playError } from '../utils/audio';

interface PlanetEntryMapProps {
  planet: Planet;
  playerStats: PlayerStats;
  completedNodes: string[];
  onBackToWorldMap: () => void;
  onSelectNode: (nodeId: string) => void;
}

export default function PlanetEntryMap({
  planet,
  playerStats,
  completedNodes,
  onBackToWorldMap,
  onSelectNode
}: PlanetEntryMapProps) {
  const [currentNode, setCurrentNode] = useState<PlanetNode>(planet.nodes[0]);
  const [selectedNode, setSelectedNode] = useState<PlanetNode | null>(null);
  const [shipCoords, setShipCoords] = useState({ x: planet.nodes[0].x, y: planet.nodes[0].y });

  // Determine if a node is unlocked
  // Node 1 is always unlocked. Others are unlocked if the previous one is completed.
  const isNodeUnlocked = (node: PlanetNode, index: number) => {
    if (index === 0) return true;
    const prevNode = planet.nodes[index - 1];
    return completedNodes.includes(prevNode.id);
  };

  const handleNodeClick = (node: PlanetNode, index: number) => {
    if (!isNodeUnlocked(node, index)) {
      playError();
      return;
    }

    playClick();
    setSelectedNode(node);
    
    // Fly the ship to the clicked node
    setShipCoords({ x: node.x, y: node.y });
    setCurrentNode(node);
  };

  const handleStartGame = (nodeId: string) => {
    playSuccess();
    onSelectNode(nodeId);
  };

  // Color config helpers based on planet theme
  const getThemeClasses = () => {
    switch (planet.gameType) {
      case 'math':
        return {
          glow: 'shadow-amber-500/20 border-amber-500/30 text-amber-400',
          line: '#f59e0b',
          dotBg: 'bg-amber-500',
          gButton: 'bg-amber-500 shadow-amber-500/30'
        };
      case 'language':
        return {
          glow: 'shadow-sky-500/20 border-sky-500/30 text-sky-400',
          line: '#38bdf8',
          dotBg: 'bg-sky-500',
          gButton: 'bg-sky-500 shadow-sky-500/30'
        };
      case 'science':
        return {
          glow: 'shadow-emerald-500/20 border-emerald-500/30 text-emerald-400',
          line: '#10b981',
          dotBg: 'bg-emerald-500',
          gButton: 'bg-emerald-500 shadow-emerald-500/30'
        };
      case 'art':
        return {
          glow: 'shadow-violet-500/20 border-violet-500/30 text-violet-400',
          line: '#8b5cf6',
          dotBg: 'bg-violet-500',
          gButton: 'bg-violet-500 shadow-violet-500/30'
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div id="planet-entry-map" className="relative w-full min-h-screen z-10 p-4 md:p-6 flex flex-col justify-between text-white select-none">
      <style>{`
        @keyframes pulse-glowing {
          0%, 100% { box-shadow: 0 0 10px rgba(255,255,255,0.2); }
          50% { box-shadow: 0 0 25px rgba(255,255,255,0.6); }
        }
        @keyframes float-ship {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) rotate(-15deg); }
          50% { transform: translate(-50%, -50%) translateY(-6px) rotate(-10deg); }
        }
        .ship-float {
          animation: float-ship 3s ease-in-out infinite;
        }
        .node-pulse {
          animation: pulse-glowing 2.5s infinite;
        }
      `}</style>

      {/* Header bar */}
      <div className="flex justify-between items-center bg-slate-900/40 border border-slate-700/50 backdrop-blur-lg rounded-2xl p-3 md:p-4 shadow-xl relative z-20">
        <button 
          onClick={() => {
            playClick();
            onBackToWorldMap();
          }}
          className="flex items-center gap-2 text-xs md:text-sm bg-slate-950/60 hover:bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl cursor-pointer hover:scale-105 active:scale-95 transition-all text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>성간 지도로 후퇴</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">진입 행성</span>
          <h1 className="text-sm md:text-lg font-black tracking-wide text-indigo-200">
            {planet.name}
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-xl shadow-[0_0_10px_rgba(245,158,11,0.15)]">
          <Coins className="w-4 h-4 text-yellow-300" />
          <span className="text-xs md:text-sm font-bold text-yellow-300">{playerStats.starPieces} <span className="font-normal text-[10px] text-yellow-400/80">별조각</span></span>
        </div>
      </div>

      {/* Level Transit Board */}
      <div className="flex-1 my-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch justify-center relative min-h-[450px]">
        
        {/* Left: Star Map Grid with Glowing Connected Nodes */}
        <div className="lg:col-span-8 bg-slate-950/40 border border-slate-800/80 rounded-3xl p-4 md:p-6 shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[380px]">
          
          {/* Faint Grid Mesh */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* SVG Connector Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Draw glowing paths between connected nodes */}
            {planet.nodes.map((node, idx) => {
              if (idx === 0) return null;
              const prevNode = planet.nodes[idx - 1];
              const unlocked = isNodeUnlocked(node, idx);

              return (
                <g key={`path-${idx}`}>
                  {/* Outer glowing trace line */}
                  <line
                    x1={`${prevNode.x}%`}
                    y1={`${prevNode.y}%`}
                    x2={`${node.x}%`}
                    y2={`${node.y}%`}
                    stroke={unlocked ? theme.line : '#475569'}
                    strokeWidth="6"
                    strokeOpacity={unlocked ? 0.15 : 0.05}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  {/* Core connector line */}
                  <line
                    x1={`${prevNode.x}%`}
                    y1={`${prevNode.y}%`}
                    x2={`${node.x}%`}
                    y2={`${node.y}%`}
                    stroke={unlocked ? theme.line : '#475569'}
                    strokeWidth="2.5"
                    strokeDasharray={unlocked ? 'none' : '4 4'}
                    strokeOpacity={unlocked ? 0.7 : 0.3}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </g>
              );
            })}
          </svg>

          {/* Spaceship (Little Prince's Ship) */}
          <div 
            className="absolute z-10 transition-all duration-1000 ease-out ship-float pointer-events-none"
            style={{ 
              left: `${shipCoords.x}%`, 
              top: `${shipCoords.y}%`,
            }}
          >
            {/* Elegant Golden Spaceship Graphic */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              {/* Thrust Fire */}
              <div className="absolute -bottom-1.5 w-3 h-5 bg-gradient-to-t from-transparent via-red-500 to-amber-400 blur-[1px] animate-bounce rounded-full origin-top" />
              <div className="absolute -bottom-1 w-1.5 h-3 bg-yellow-300 rounded-full animate-pulse" />
              
              {/* Rocket Body */}
              <svg className="w-10 h-10 drop-shadow-[0_0_12px_rgba(251,191,36,0.85)]" viewBox="0 0 100 100">
                {/* Nose Cone */}
                <path d="M50,10 L30,40 L70,40 Z" fill="#f59e0b" />
                {/* Body */}
                <rect x="30" y="40" width="40" height="35" rx="5" fill="#fef08a" stroke="#d97706" strokeWidth="2" />
                {/* Window */}
                <circle cx="50" cy="55" r="10" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
                {/* Fins */}
                <path d="M30,55 L15,75 L30,75 Z" fill="#ef4444" />
                <path d="M70,55 L85,75 L70,75 Z" fill="#ef4444" />
              </svg>
            </div>
          </div>

          {/* Render Nodes */}
          {planet.nodes.map((node, idx) => {
            const unlocked = isNodeUnlocked(node, idx);
            const isCompleted = completedNodes.includes(node.id);
            const isSelected = selectedNode?.id === node.id;

            return (
              <div
                key={node.id}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div 
                  onClick={() => handleNodeClick(node, idx)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    unlocked 
                      ? isCompleted
                        ? 'bg-indigo-500 border-2 border-indigo-300 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)] hover:scale-110'
                        : isSelected
                          ? 'bg-white text-slate-900 border-3 border-indigo-400 shadow-[0_0_18px_#fff] scale-110 node-pulse'
                          : 'bg-slate-900 border-2 border-white/60 text-white hover:border-white shadow-md hover:scale-110'
                      : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  {unlocked ? (
                    isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-xs font-black">{idx + 1}</span>
                    )
                  ) : (
                    <Lock className="w-4 h-4 text-slate-500" />
                  )}
                </div>

                {/* Level Title Tag */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-slate-800 px-2 py-1 rounded-lg text-[9px] font-bold text-center w-24 shadow-md backdrop-blur-sm pointer-events-none truncate">
                  <div className={`text-[8px] uppercase tracking-wide truncate ${unlocked ? 'text-indigo-400' : 'text-slate-500'}`}>
                    {unlocked ? node.topic : '잠김'}
                  </div>
                  <div className="truncate text-slate-200 mt-0.5">{node.name}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Level Holographic Details Panel */}
        <div className="lg:col-span-4 h-full flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900/40 border border-slate-700/50 backdrop-blur-lg rounded-3xl p-5 shadow-2xl flex flex-col justify-between min-h-[380px]"
              >
                <div>
                  <div className="flex justify-between items-center border-b border-slate-800/80 pb-3 mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">학습 구역 정보</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-950 ${
                      selectedNode.difficulty === '하' 
                        ? 'text-emerald-400 border-emerald-500/20' 
                        : selectedNode.difficulty === '중' 
                          ? 'text-amber-400 border-amber-500/20' 
                          : 'text-rose-400 border-rose-500/20'
                    }`}>
                      난이도: {selectedNode.difficulty}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xs text-slate-400">단원 주제</h3>
                    <p className="text-lg font-black text-white leading-tight mt-0.5">{selectedNode.name}</p>
                    <span className="inline-block mt-1.5 text-[10px] bg-indigo-500/10 text-indigo-300 font-extrabold px-2 py-0.5 rounded border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.15)]">
                      교과: {selectedNode.topic}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6 bg-slate-950/50 border border-slate-800/80 p-3 rounded-xl shadow-inner">
                    {selectedNode.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-[11px] text-slate-400 flex justify-between items-center px-1">
                    <span>보상 별 조각</span>
                    <span className="font-bold text-yellow-300 flex items-center gap-0.5">
                      <Coins className="w-3.5 h-3.5" /> +10 ~ 15
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between items-center px-1">
                    <span>보상 경험치</span>
                    <span className="font-bold text-amber-400">
                      +20 EXP
                    </span>
                  </div>

                  <button
                    onClick={() => handleStartGame(selectedNode.id)}
                    className={`mt-2 w-full py-3.5 rounded-2xl font-black tracking-widest text-xs uppercase cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-200 text-slate-950 flex items-center justify-center gap-1.5 ${theme.gButton}`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>학습 챌린지 개시</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-900/20 border border-slate-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-inner flex flex-col justify-center items-center text-center min-h-[380px] border-dashed">
                <Compass className="w-10 h-10 text-indigo-400/40 mb-3 animate-spin duration-3000" />
                <h3 className="text-xs font-extrabold text-indigo-200/80 mb-1.5">지도 노드를 탭하세요</h3>
                <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
                  활성화되어 해제된 숫자 모양 노드(1, 2, 3...)를 클릭해 탐험선 비행 및 해당 주제의 미니게임 콘솔을 활성화하세요. 이전 노드를 해결하면 다음 노드가 영구적으로 활성화됩니다!
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Tip footer */}
      <div className="text-center text-[10px] text-slate-400 uppercase tracking-widest">
        ✦ 은하 비행 상태 양호 • 단원 잠금 해제 시스템 정상 작동 중 ✦
      </div>
    </div>
  );
}
