import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Award, HelpCircle, Music, Radio, Volume2, Coins, Play, Star, CheckCircle2 
} from 'lucide-react';
import { ART_NOTES, ART_SEQUENCES } from '../data';
import { playChime, playSuccess, playError } from '../utils/audio';

interface ArtGameProps {
  nodeId: string;
  nodeName: string;
  onGameComplete: (starPiecesEarned: number, expEarned: number) => void;
  onExit: () => void;
}

export default function ArtGame({
  nodeId,
  nodeName,
  onGameComplete,
  onExit
}: ArtGameProps) {
  const sequences = ART_SEQUENCES[nodeId] || ART_SEQUENCES['art-1'];
  
  const [roundIdx, setRoundIdx] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'playing-sequence' | 'user-turn' | 'success-round' | 'completed'>('intro');
  const [userInput, setUserInput] = useState<number[]>([]);
  const [activeLitNote, setActiveLitNote] = useState<number | null>(null);

  const currentSequence = sequences[roundIdx];

  const playSequence = async () => {
    setGameState('playing-sequence');
    setUserInput([]);
    
    // Tiny pre-delay
    await new Promise(resolve => setTimeout(resolve, 800));

    for (let i = 0; i < currentSequence.length; i++) {
      const noteId = currentSequence[i];
      const note = ART_NOTES[noteId];
      
      // Light up and play sound
      setActiveLitNote(noteId);
      playChime(note.freq, 0.6);
      
      await new Promise(resolve => setTimeout(resolve, 450));
      setActiveLitNote(null);
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    setGameState('user-turn');
  };

  const handleCrystalClick = (noteId: number) => {
    if (gameState !== 'user-turn') return;

    const note = ART_NOTES[noteId];
    // Play note chime instantly
    playChime(note.freq, 0.6);
    setActiveLitNote(noteId);
    setTimeout(() => setActiveLitNote(null), 300);

    const nextInput = [...userInput, noteId];
    setUserInput(nextInput);

    // Verify input index match
    const currentStep = nextInput.length - 1;
    if (noteId !== currentSequence[currentStep]) {
      // Mistake!
      playError();
      setUserInput([]);
      // Force user to listen to sequence again
      setGameState('playing-sequence');
      setTimeout(() => {
        playSequence();
      }, 1000);
      return;
    }

    // Complete current round check
    if (nextInput.length === currentSequence.length) {
      playSuccess();
      setGameState('success-round');

      setTimeout(() => {
        if (roundIdx >= sequences.length - 1) {
          setGameState('completed');
        } else {
          setRoundIdx(prev => prev + 1);
          setGameState('intro');
        }
      }, 1500);
    }
  };

  const handleStartRound = () => {
    playSequence();
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

        <h1 className="text-sm md:text-base font-black text-violet-300 tracking-wide uppercase">
          {nodeName} • 예술의 소리 오르골
        </h1>

        <div className="bg-violet-500/10 border border-violet-500/30 px-3 py-1 rounded-xl text-xs font-bold text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.15)]">
          오르골 단 단계: {roundIdx + 1} / {sequences.length}
        </div>
      </div>

      {/* Game box */}
      <div className="flex-1 my-6 bg-slate-950/40 border border-slate-800/80 rounded-3xl p-4 md:p-5 relative overflow-hidden flex flex-col justify-between min-h-[440px]">
        
        {/* Particle circles background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(139,92,246,0.015)_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none" />

        <AnimatePresence mode="wait">
          {gameState === 'completed' ? (
            /* MISSION COMPLETED VIEW */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col justify-center items-center p-6 text-center"
            >
              <div className="w-20 h-20 bg-violet-500/10 border border-violet-400/30 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(139,92,246,0.25)] animate-pulse">
                <Music className="w-12 h-12 text-violet-400 animate-bounce" />
              </div>
              <h2 className="text-2xl font-black text-violet-300 tracking-wider">은하 대합창 완성!</h2>
              <p className="text-xs text-slate-300 mt-2 max-w-sm leading-relaxed">
                축하합니다! 빛나는 5음계 별자리 크리스탈들의 조화로운 선율을 완벽히 복원하였습니다. 행성이 아름다운 멜로디로 가득 차며 행복한 리듬을 뿜어냅니다!
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
                  <div className="text-xl font-bold text-violet-400 mt-0.5">
                    +25 EXP
                  </div>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="px-8 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-slate-950 font-extrabold rounded-2xl cursor-pointer shadow-lg shadow-violet-500/30 hover:scale-105 active:scale-95 transition-all text-xs"
              >
                조화로운 소리 복원 보상 받기
              </button>
            </motion.div>

          ) : (
            /* ACTIVE SIMON SAYS PUZZLE */
            <>
              {/* Clue/Instructions board */}
              <div className="bg-slate-900/40 border border-slate-700/50 p-4 rounded-2xl relative z-10 flex gap-3 shadow-md max-w-sm mx-auto backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center shrink-0">
                  <Radio className="w-5 h-5 text-violet-300" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-violet-400">오르골 마법 지침</span>
                  <p className="text-xs text-slate-100 font-medium leading-relaxed mt-0.5">
                    {gameState === 'intro' 
                      ? '멜로디 가동 준비 완료. 아래 재생 버튼을 탭하고 흘러나오는 선율을 귀 기울여 들으세요.'
                      : gameState === 'playing-sequence'
                        ? '멜로디 조화 조율선이 청취 모드로 재생되는 중입니다...👂'
                        : `당신의 오르골 연주 차례! 들으셨던 순서대로 크리스탈을 누르세요 🎹 (${userInput.length} / ${currentSequence.length})`
                    }
                  </p>
                </div>
              </div>

              {/* Central Glowing Star Crystals Area */}
              <div className="flex-1 w-full flex items-center justify-center relative min-h-[180px]">
                
                <AnimatePresence mode="wait">
                  {gameState === 'intro' ? (
                    <motion.button
                      key="play-btn"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      onClick={handleStartRound}
                      className="px-6 py-4 bg-violet-600 hover:bg-violet-500 rounded-2xl font-black text-xs tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)] cursor-pointer hover:scale-105 active:scale-95 transition-all border border-white/15"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>별자리 멜로디 연주 듣기</span>
                    </motion.button>
                  ) : gameState === 'success-round' ? (
                    <motion.div
                      key="success-round-banner"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-2.5">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-bounce" />
                      </div>
                      <h3 className="font-black text-sm text-emerald-400 tracking-wider">
                        단계 완료! 오르골 조화 조율 완료 ✨
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase">다음 멜로디 공명 상태로 전이합니다...</p>
                    </motion.div>
                  ) : (
                    /* The 5 Glowing Musical Crystals */
                    <motion.div 
                      key="crystals-panel"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-center items-end gap-3.5 px-2 py-4"
                    >
                      {ART_NOTES.map((note) => {
                        const isLit = activeLitNote === note.id;

                        return (
                          <motion.button
                            key={note.id}
                            disabled={gameState !== 'user-turn'}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleCrystalClick(note.id)}
                            className={`w-12 md:w-16 h-36 md:h-44 rounded-2xl transition-all duration-150 border flex flex-col items-center justify-between py-4 ${
                              gameState !== 'user-turn' ? 'cursor-default' : 'cursor-pointer hover:scale-103'
                            } ${
                              isLit
                                ? `${note.color} border-white shadow-[0_0_25px_var(--tw-shadow-color)] ${note.glowColor} scale-105 translate-y-[-6px]`
                                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700/80'
                            }`}
                          >
                            <div className={`w-3.5 h-3.5 rounded-full ${
                              isLit ? 'bg-white' : 'bg-slate-800'
                            }`} />
                            
                            <Star className={`w-5 h-5 ${
                              isLit ? 'text-white fill-current animate-spin' : 'text-slate-600'
                            }`} style={{ animationDuration: '3s' }} />

                            <span className="font-extrabold text-[9px] uppercase tracking-wider">
                              {note.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              {/* Footnotes status indicators */}
              <div className="mt-4 pt-4 border-t border-white/5 relative z-20">
                <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest">
                  {gameState === 'user-turn' ? '조율 크리스탈 건반 연주 활성화됨' : '은하 크리스탈 선율 주파수 스캔 중...'}
                </div>
              </div>
            </>
          )}
        </AnimatePresence>

      </div>

      {/* Footer advice */}
      <div className="text-center text-[10px] text-slate-400 uppercase tracking-widest">
        ✦ 오답 시 현재 단계의 멜로디 시퀀스를 다시 들어야 복구됩니다 ✦
      </div>
    </div>
  );
}
