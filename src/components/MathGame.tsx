import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Heart, RefreshCw, XCircle, ChevronLeft, Award, Flame } from 'lucide-react';
import { MathQuestion, MATH_QUESTIONS } from '../data';
import { playLaser, playExplosion, playError, playSuccess } from '../utils/audio';

interface MathGameProps {
  nodeId: string;
  nodeName: string;
  onGameComplete: (starPiecesEarned: number, expEarned: number) => void;
  onExit: () => void;
}

export default function MathGame({
  nodeId,
  nodeName,
  onGameComplete,
  onExit
}: MathGameProps) {
  const questions = MATH_QUESTIONS[nodeId] || MATH_QUESTIONS['math-1'];
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(3);
  const [meteorY, setMeteorY] = useState(10); // percentage Y coordinate
  const [gameState, setGameState] = useState<'playing' | 'laser-firing' | 'explosion' | 'failed' | 'completed'>('playing');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  const currentQuestion = questions[currentQIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Meteor falling speed logic
  useEffect(() => {
    if (gameState !== 'playing') return;

    const intervalTime = 160; // Tick rate
    const stepSize = 1.6; // Speed per tick

    timerRef.current = setInterval(() => {
      setMeteorY((prev) => {
        if (prev >= 82) {
          // Meteor hit the shields!
          handleMeteorImpact();
          return 10;
        }
        return prev + stepSize;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentQIndex]);

  const handleMeteorImpact = () => {
    playExplosion();
    setHp((prev) => {
      const nextHp = prev - 1;
      if (nextHp <= 0) {
        setGameState('failed');
      } else {
        // Move to next question on impact
        goToNextQuestion();
      }
      return nextHp;
    });
  };

  const goToNextQuestion = () => {
    setMeteorY(10);
    setSelectedOption(null);
    setGameState('playing');
    setCurrentQIndex((prev) => (prev + 1) % questions.length);
  };

  const handleOptionClick = (option: number) => {
    if (gameState !== 'playing') return;
    setSelectedOption(option);

    if (option === currentQuestion.answer) {
      // Fire Laser
      setGameState('laser-firing');
      playLaser();

      // Trigger explosion after laser animation
      setTimeout(() => {
        playExplosion();
        setGameState('explosion');
        setScore((prev) => {
          const nextScore = prev + 1;
          if (nextScore >= 5) {
            // Victory!
            setTimeout(() => {
              playSuccess();
              setGameState('completed');
            }, 600);
          } else {
            setTimeout(() => {
              goToNextQuestion();
            }, 600);
          }
          return nextScore;
        });
      }, 400);

    } else {
      // Wrong Answer
      playError();
      setHp((prev) => {
        const nextHp = prev - 1;
        if (nextHp <= 0) {
          setGameState('failed');
        } else {
          // Speed up current meteor as penalty
          setMeteorY(Math.min(75, meteorY + 15));
        }
        return nextHp;
      });
    }
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setScore(0);
    setHp(3);
    setMeteorY(10);
    setSelectedOption(null);
    setGameState('playing');
  };

  const handleFinish = () => {
    // Reward player: 15 star pieces and 25 EXP
    onGameComplete(15, 25);
  };

  return (
    <div className="relative w-full min-h-screen z-10 p-4 md:p-6 flex flex-col justify-between text-white select-none">
      <style>{`
        @keyframes laser-sweep {
          0% { height: 0%; opacity: 1; }
          50% { height: 100%; opacity: 1; }
          100% { height: 100%; opacity: 0; }
        }
        @keyframes rumble {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-1.5px, 1.5px); }
          75% { transform: translate(1.5px, -1.5px); }
        }
        .laser-beam {
          animation: laser-sweep 0.4s ease-out forwards;
        }
        .rumble-effect {
          animation: rumble 0.2s infinite;
        }
      `}</style>

      {/* Header bar */}
      <div className="flex justify-between items-center bg-slate-900/40 border border-slate-700/50 backdrop-blur-lg rounded-2xl p-3 md:p-4 shadow-xl">
        <button 
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs bg-slate-950/60 hover:bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>목록으로</span>
        </button>

        <h1 className="text-sm md:text-base font-black text-amber-300 tracking-wide uppercase">
          {nodeName} • 수학 광선
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
          {/* Progress Score */}
          <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl text-xs font-bold text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
            격파 유성: {score} / 5
          </div>
        </div>
      </div>

      {/* Game Stage Panel */}
      <div className="flex-1 my-6 bg-slate-950/40 border border-slate-800/80 rounded-3xl p-4 relative overflow-hidden flex flex-col justify-between min-h-[440px]">
        
        {/* Sky / Space background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        <AnimatePresence mode="wait">
          {gameState === 'completed' ? (
            /* MISSION COMPLETE SCREEN */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col justify-center items-center p-6 text-center"
            >
              <div className="w-20 h-20 bg-amber-500/10 border border-amber-400/30 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(245,158,11,0.2)] animate-pulse">
                <Award className="w-12 h-12 text-amber-400 animate-bounce" />
              </div>
              <h2 className="text-2xl font-black text-amber-300 tracking-wider">미션 클리어!</h2>
              <p className="text-xs text-slate-300 mt-2 max-w-sm leading-relaxed">
                훌륭합니다! 수학의 별에 혼란을 가져오던 떠돌이 덧셈/뺄셈 유성우들을 모두 격파하고, 궤도의 기하학적 균형을 복원해냈습니다.
              </p>
              
              <div className="my-5 grid grid-cols-2 gap-4 w-full max-w-xs">
                <div className="bg-slate-900 border border-white/10 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">수확 별 조각</div>
                  <div className="text-xl font-bold text-yellow-300 flex justify-center items-center gap-0.5 mt-0.5">
                    ✨ +15
                  </div>
                </div>
                <div className="bg-slate-900 border border-white/10 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">탐험 경험치</div>
                  <div className="text-xl font-bold text-amber-400 mt-0.5">
                    +25 EXP
                  </div>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold rounded-2xl cursor-pointer shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all text-xs"
              >
                별자리 복원 보상 수령하기
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
                <XCircle className="w-10 h-10 text-rose-500 animate-spin" />
              </div>
              <h2 className="text-xl font-black text-rose-400 tracking-wider">탐사 우선순위 붕괴</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                유성우의 충격으로 에너지 쉴드가 과열되어 부서졌습니다. 다시 계산 궤도를 정밀하게 조준해 보세요!
              </p>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl cursor-pointer transition-all text-xs border border-white/10 flex items-center gap-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>다시 도전하기</span>
                </button>
                <button
                  onClick={onExit}
                  className="px-5 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 font-bold rounded-xl cursor-pointer transition-all text-xs"
                >
                  목록으로 후퇴
                </button>
              </div>
            </motion.div>

          ) : (
            /* ACTIVE GAME PLAY */
            <>
              {/* Outer sky container holding meteor and spaceship */}
              <div className="flex-1 w-full relative">
                
                {/* Laser beam rendering */}
                {gameState === 'laser-firing' && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-12 w-1.5 bg-gradient-to-t from-red-600 via-amber-400 to-white laser-beam z-10" />
                )}

                {/* Meteor Element */}
                <AnimatePresence mode="wait">
                  {gameState === 'explosion' ? (
                    <motion.div 
                      key="explosion"
                      initial={{ scale: 0.8, opacity: 1 }}
                      animate={{ scale: 1.8, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-1/2 -translate-x-1/2 w-16 h-16 flex items-center justify-center"
                      style={{ top: `${meteorY}%` }}
                    >
                      {/* Exploding particles block */}
                      <div className="w-10 h-10 rounded-full bg-amber-400 blur-sm animate-ping" />
                      <div className="absolute w-6 h-6 rounded-full bg-red-500 blur-md" />
                      <span className="text-amber-200 font-bold text-xs animate-pulse">🔥 SHATTER!</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`meteor-${currentQIndex}`}
                      className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-10 ${
                        gameState === 'playing' && meteorY > 55 ? 'rumble-effect' : ''
                      }`}
                      style={{ 
                        top: `${meteorY}%`,
                        transition: 'top 160ms linear'
                      }}
                    >
                      {/* Floating Meteor Visual */}
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        {/* Red tail flame */}
                        <div className="absolute -top-6 w-5 h-8 bg-gradient-to-b from-transparent to-red-500 blur-[2px] rounded-full animate-pulse" />
                        <div className="absolute -top-3 w-3 h-5 bg-gradient-to-b from-transparent to-amber-400 rounded-full" />
                        
                        {/* Outer meteor body */}
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-800 via-slate-700 to-amber-700 border-2 border-amber-600/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center justify-center relative">
                          {/* Inner math formula text */}
                          <span className="font-extrabold text-sm text-yellow-100 select-none drop-shadow-md">
                            {currentQuestion.question}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Ground shields border */}
                <div className="absolute bottom-1 w-full border-t border-dashed border-red-500/20 z-0" />

                {/* Spaceship at the bottom center */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-2 z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-400/20 shadow-inner">
                    🚀
                  </div>
                </div>

              </div>

              {/* Lower Section: Option shields Selection */}
              <div className="mt-4 pt-4 border-t border-white/5 relative z-20">
                <div className="text-center text-[10px] text-slate-400 uppercase tracking-widest mb-3">
                  올바른 숫자의 보호막을 터치하여 광선을 발사하세요
                </div>
                
                <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                  {currentQuestion.options.map((option, idx) => {
                    const isCorrect = option === currentQuestion.answer;
                    const isSelected = selectedOption === option;

                    return (
                      <button
                        key={`${idx}-${option}`}
                        disabled={gameState !== 'playing'}
                        onClick={() => handleOptionClick(option)}
                        className={`py-3.5 px-2 rounded-2xl border text-center transition-all duration-150 relative overflow-hidden flex flex-col items-center gap-1 ${
                          gameState !== 'playing'
                            ? 'opacity-60'
                            : isSelected
                              ? isCorrect
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                : 'bg-rose-500/20 border-rose-400 text-rose-300'
                              : 'bg-slate-900/50 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700/80 hover:scale-103 active:scale-95 cursor-pointer'
                        }`}
                      >
                        <Shield className={`w-5 h-5 ${
                          isSelected && isCorrect ? 'text-emerald-400 animate-bounce' : 'text-slate-400'
                        }`} />
                        <span className="font-black text-sm">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </AnimatePresence>

      </div>

      {/* Tip bar */}
      <div className="text-center text-[10px] text-slate-400 uppercase tracking-widest">
        ✦ 오답은 보호 장치를 닳게 하고 유성 속도를 증가시킵니다 ✦
      </div>
    </div>
  );
}
