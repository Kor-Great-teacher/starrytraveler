import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Award, HelpCircle, HardDrive, Cpu, ShieldAlert, Heart, Coins, CheckCircle2 
} from 'lucide-react';
import { ScienceItem, SCIENCE_DATASETS } from '../data';
import { playClick, playSuccess, playError } from '../utils/audio';

interface ScienceGameProps {
  nodeId: string;
  nodeName: string;
  onGameComplete: (starPiecesEarned: number, expEarned: number) => void;
  onExit: () => void;
}

export default function ScienceGame({
  nodeId,
  nodeName,
  onGameComplete,
  onExit
}: ScienceGameProps) {
  const dataset = SCIENCE_DATASETS[nodeId] || SCIENCE_DATASETS['sci-1'];
  const [items, setItems] = useState<ScienceItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(3);
  const [gameState, setGameState] = useState<'playing' | 'failed' | 'completed'>('playing');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Shuffle items list on level initialization for replay value
    const shuffled = [...dataset.items].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setCurrentIdx(0);
    setScore(0);
    setHp(3);
    setGameState('playing');
  }, [nodeId]);

  const currentItem = items[currentIdx];

  const handleCategorySelect = (categoryId: string) => {
    if (gameState !== 'playing') return;
    setSelectedCategory(categoryId);

    if (currentItem.category === categoryId) {
      // Success!
      playSuccess();
      setScore(prev => prev + 1);

      setTimeout(() => {
        setSelectedCategory(null);
        if (currentIdx >= items.length - 1) {
          playSuccess();
          setGameState('completed');
        } else {
          setCurrentIdx(prev => prev + 1);
        }
      }, 800);
    } else {
      // Mistake!
      playError();
      setHp(prev => {
        const nextHp = prev - 1;
        if (nextHp <= 0) {
          setGameState('failed');
        }
        return nextHp;
      });

      // Quick visual shake/clear
      setTimeout(() => {
        setSelectedCategory(null);
      }, 800);
    }
  };

  const handleRestart = () => {
    const shuffled = [...dataset.items].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setCurrentIdx(0);
    setScore(0);
    setHp(3);
    setGameState('playing');
  };

  const handleFinish = () => {
    onGameComplete(15, 25);
  };

  return (
    <div className="relative w-full min-h-screen z-10 p-4 md:p-6 flex flex-col justify-between text-white select-none">
      
      {/* Header bar */}
      <div className="flex justify-between items-center bg-slate-900/40 border border-slate-700/50 backdrop-blur-lg rounded-2xl p-3 md:p-4 shadow-xl">
        <button 
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs bg-slate-950/60 hover:bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>목록으로</span>
        </button>

        <h1 className="text-sm md:text-base font-black text-emerald-300 tracking-wide uppercase">
          {nodeName} • 물질 과학 분류
        </h1>

        <div className="flex items-center gap-2">
          {/* HP Bar */}
          <div className="flex gap-1 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart 
                key={i} 
                className={`w-4 h-4 ${i < hp ? 'text-rose-500 fill-current' : 'text-slate-600'}`} 
              />
            ))}
          </div>
          {/* Progress badge */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl text-xs font-bold text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            분류 완료: {score} / {items.length}
          </div>
        </div>
      </div>

      {/* Game Screen container */}
      <div className="flex-1 my-6 bg-slate-950/40 border border-slate-800/80 rounded-3xl p-4 md:p-5 relative overflow-hidden flex flex-col justify-between min-h-[440px]">
        
        {/* Radar tech coordinate lines */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(16,185,129,0.015)_2px,transparent_2px)] bg-[size:16px_16px] pointer-events-none" />

        <AnimatePresence mode="wait">
          {gameState === 'completed' ? (
            /* MISSION COMPLETED VIEW */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col justify-center items-center p-6 text-center"
            >
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-400/30 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.25)] animate-pulse">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
              </div>
              <h2 className="text-2xl font-black text-emerald-300 tracking-wider">안정성 검증 완료!</h2>
              <p className="text-xs text-slate-300 mt-2 max-w-sm leading-relaxed">
                축하합니다! 원소 분석기의 모든 천체/물질 정보 분류에 성공하였습니다. 무너졌던 중력장과 양자의 상태가 안전하게 원상태로 정비되었습니다.
              </p>
              
              <div className="my-5 grid grid-cols-2 gap-4 w-full max-w-xs">
                <div className="bg-slate-900 border border-white/10 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">수확 별 조각</div>
                  <div className="text-xl font-bold text-yellow-300 flex justify-center items-center gap-0.5 mt-0.5">
                    <Coins className="w-4 h-4" /> +15
                  </div>
                </div>
                <div className="bg-slate-900 border border-white/10 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">탐험 경험치</div>
                  <div className="text-xl font-bold text-emerald-400 mt-0.5">
                    +25 EXP
                  </div>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold rounded-2xl cursor-pointer shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all text-xs"
              >
                차원 도약 보상 장착하기
              </button>
            </motion.div>

          ) : gameState === 'failed' ? (
            /* GAME OVER SCREEN */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col justify-center items-center p-6 text-center"
            >
              <div className="w-16 h-16 bg-rose-500/10 border border-rose-400/30 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert className="w-10 h-10 text-rose-500 animate-pulse" />
              </div>
              <h2 className="text-xl font-black text-rose-400 tracking-wider">양자 폭발 감지</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                잘못된 분석실 분배로 가열 장치가 과열되었습니다. 원소 분류 규칙을 한 번 더 검토해 보시는 게 어떨까요?
              </p>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl cursor-pointer transition-all text-xs border border-white/10 flex items-center gap-1"
                >
                  <Cpu className="w-4 h-4 animate-spin" />
                  <span>재가동 봇</span>
                </button>
                <button
                  onClick={onExit}
                  className="px-5 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 font-bold rounded-xl cursor-pointer transition-all text-xs"
                >
                  안전구역 후퇴
                </button>
              </div>
            </motion.div>

          ) : (
            /* ACTIVE SENSORS */
            <>
              {/* Analyzer Title */}
              <div className="bg-slate-900/40 border border-slate-700/50 p-3.5 rounded-2xl relative z-10 flex gap-2.5 shadow-md max-w-sm mx-auto backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
                  <HardDrive className="w-4 h-4 text-emerald-300 animate-bounce" />
                </div>
                <div>
                  <span className="text-[8px] uppercase font-bold tracking-widest text-emerald-400">우주 입자 분석기</span>
                  <p className="text-[11px] text-slate-200 font-semibold leading-relaxed">
                    {dataset.title} : 아래 입자를 올바른 캡슐에 넣으세요.
                  </p>
                </div>
              </div>

              {/* Central element Analyzer Orb */}
              <div className="flex-1 w-full flex items-center justify-center relative min-h-[180px]">
                {currentItem && (
                  <motion.div
                    key={`item-${currentIdx}`}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    className="relative flex flex-col items-center"
                  >
                    {/* Holographic orbital rings around target element */}
                    <div className="absolute w-36 h-36 rounded-full border border-dashed border-emerald-500/20 animate-spin" style={{ animationDuration: '8s' }} />
                    <div className="absolute w-44 h-16 rounded-full border border-indigo-400/10 transform rotate-12 animate-pulse" />

                    <div className="w-28 h-28 rounded-full bg-slate-900 border-2 border-emerald-400/40 shadow-[0_0_25px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center p-3 relative text-center">
                      {/* Scanning Laser Line */}
                      <div className="absolute top-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce" />
                      
                      <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400/80 mb-0.5">분석 대상</span>
                      <span className="font-extrabold text-sm text-slate-100 select-none drop-shadow-md">
                        {currentItem.name}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Lower Section: Category Capsules bins Selection */}
              <div className="mt-4 pt-4 border-t border-white/5 relative z-20">
                <div className="text-center text-[10px] text-slate-400 uppercase tracking-widest mb-3">
                  아래 입자 수납소 중 알맞은 성질을 선택하세요
                </div>
                
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                  {dataset.categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const isCorrect = currentItem?.category === cat.id;

                    return (
                      <button
                        key={cat.id}
                        disabled={selectedCategory !== null}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`py-4 px-2 rounded-2xl border text-center transition-all duration-150 flex flex-col items-center justify-center gap-1.5 min-h-[84px] ${
                          selectedCategory !== null
                            ? isSelected
                              ? isCorrect
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                : 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                              : 'opacity-40'
                            : 'bg-slate-900/50 hover:bg-slate-800/80 border-slate-800 hover:border-emerald-500/30 hover:scale-103 active:scale-95 cursor-pointer'
                        }`}
                      >
                        <HardDrive className={`w-5 h-5 ${
                          selectedCategory !== null && isSelected && isCorrect ? 'text-emerald-400 animate-bounce' : 'text-slate-500'
                        }`} />
                        <span className="font-extrabold text-[11px] leading-tight text-slate-200">
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </AnimatePresence>

      </div>

      {/* Footer warning */}
      <div className="text-center text-[10px] text-slate-400 uppercase tracking-widest">
        ✦ 과학 지표는 실생활 물질 관측 사실에 근거하여 작동합니다 ✦
      </div>
    </div>
  );
}
