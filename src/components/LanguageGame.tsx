import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle, ArrowRight, RefreshCw, Star, Trophy, ChevronLeft, Coins } from 'lucide-react';
import { LanguagePuzzle, LANGUAGE_PUZZLES } from '../data';
import { playChime, playSuccess, playError } from '../utils/audio';

interface LanguageGameProps {
  nodeId: string;
  nodeName: string;
  onGameComplete: (starPiecesEarned: number, expEarned: number) => void;
  onExit: () => void;
}

interface LetterNode {
  letter: string;
  x: number; // percentage
  y: number; // percentage
  index: number;
}

export default function LanguageGame({
  nodeId,
  nodeName,
  onGameComplete,
  onExit
}: LanguageGameProps) {
  const puzzles = LANGUAGE_PUZZLES[nodeId] || LANGUAGE_PUZZLES['lang-1'];
  const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<{ letter: string; nodeIndex: number }[]>([]);
  const [letterNodes, setLetterNodes] = useState<LetterNode[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'word-success' | 'completed'>('playing');

  const currentPuzzle = puzzles[currentPuzzleIdx];

  // Set up floating node coordinates for each puzzle once loaded
  useEffect(() => {
    if (!currentPuzzle) return;
    
    // Distribute letters in a beautiful circular constellation format
    const count = currentPuzzle.letters.length;
    const radius = 32; // percent radius from center
    const centerX = 50;
    const centerY = 45;

    const nodes: LetterNode[] = currentPuzzle.letters.map((letter, i) => {
      const angle = (i * 2 * Math.PI) / count + (Math.random() * 0.4 - 0.2); // slight random rotation jitter
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return {
        letter,
        x: Math.min(85, Math.max(15, x)),
        y: Math.min(80, Math.max(15, y)),
        index: i
      };
    });

    setLetterNodes(nodes);
    setSelectedLetters([]);
    setGameState('playing');
  }, [currentPuzzleIdx, nodeId]);

  const handleNodeClick = (node: LetterNode) => {
    if (gameState !== 'playing') return;

    // Prevent clicking the exact same node twice in a row
    const isAlreadySelected = selectedLetters.some(sl => sl.nodeIndex === node.index);
    if (isAlreadySelected) {
      playError();
      return;
    }

    // Play pitch based on selected index
    const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88];
    const chimeFreq = scale[selectedLetters.length % scale.length];
    playChime(chimeFreq, 0.8);

    const nextSelected = [...selectedLetters, { letter: node.letter, nodeIndex: node.index }];
    setSelectedLetters(nextSelected);

    // Build current spelled word
    const spelled = nextSelected.map(sl => sl.letter).join('');
    
    // Check if correct
    if (spelled === currentPuzzle.answer) {
      playSuccess();
      setGameState('word-success');
      
      setTimeout(() => {
        if (currentPuzzleIdx >= puzzles.length - 1) {
          setGameState('completed');
        } else {
          setCurrentPuzzleIdx(prev => prev + 1);
        }
      }, 1500);
    } else if (!currentPuzzle.answer.startsWith(spelled)) {
      // Wrong spelling trajectory
      playError();
      // Flash red and clear selection
      setSelectedLetters([]);
    }
  };

  const handleResetSpelling = () => {
    playChime(220, 0.4);
    setSelectedLetters([]);
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

        <h1 className="text-sm md:text-base font-black text-sky-300 tracking-wide uppercase">
          {nodeName} • 별자리 단어
        </h1>

        <div className="bg-sky-500/10 border border-sky-500/30 px-3 py-1 rounded-xl text-xs font-bold text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.15)]">
          복원 성도: {currentPuzzleIdx + 1} / {puzzles.length}
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 my-6 bg-slate-950/40 border border-slate-800/80 rounded-3xl p-4 md:p-5 relative overflow-hidden flex flex-col justify-between min-h-[440px]">
        
        {/* Sky Background with star grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <AnimatePresence mode="wait">
          {gameState === 'completed' ? (
            /* MISSION COMPLETED VIEW */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col justify-center items-center p-6 text-center"
            >
              <div className="w-20 h-20 bg-sky-500/10 border border-sky-400/30 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(56,189,248,0.25)] animate-pulse">
                <Trophy className="w-12 h-12 text-sky-400 animate-bounce" />
              </div>
              <h2 className="text-2xl font-black text-sky-300 tracking-wider">단어 별자리 완성!</h2>
              <p className="text-xs text-slate-300 mt-2 max-w-sm leading-relaxed">
                성공적으로 모든 한글 조각들을 이어 별자리들을 밝혀냈습니다! 당신의 다정한 지혜가 장미와 은하 전체를 환히 미소 짓게 합니다.
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
                  <div className="text-xl font-bold text-sky-400 mt-0.5">
                    +25 EXP
                  </div>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-slate-950 font-extrabold rounded-2xl cursor-pointer shadow-lg shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all text-xs"
              >
                별빛의 열매 보상 수령하기
              </button>
            </motion.div>

          ) : (
            /* ACTIVE PUZZLE VIEW */
            <>
              {/* Question/Clue Banner */}
              <div className="bg-slate-900/40 border border-slate-700/50 p-4 rounded-2xl relative z-10 flex gap-3 shadow-md max-w-xl mx-auto backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5 text-sky-300 animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-sky-400">별나라 퀴즈 단서</span>
                  <p className="text-xs text-slate-100 font-medium leading-relaxed mt-0.5">
                    {currentPuzzle.clue}
                  </p>
                </div>
              </div>

              {/* Central Floating Star Nodes Area */}
              <div className="flex-1 w-full relative min-h-[220px]">
                
                {/* SVG lines between selected stars */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  {selectedLetters.map((sel, idx) => {
                    if (idx === 0) return null;
                    const prevNode = letterNodes[selectedLetters[idx - 1].nodeIndex];
                    const currNode = letterNodes[sel.nodeIndex];
                    if (!prevNode || !currNode) return null;

                    return (
                      <line
                        key={`line-${idx}`}
                        x1={`${prevNode.x}%`}
                        y1={`${prevNode.y}%`}
                        x2={`${currNode.x}%`}
                        y2={`${currNode.y}%`}
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="animate-pulse shadow-2xl"
                        style={{
                          filter: 'drop-shadow(0 0 5px rgba(56,189,248,0.8))'
                        }}
                      />
                    );
                  })}
                </svg>

                {/* Star Nodes */}
                {letterNodes.map((node) => {
                  const selectionIndex = selectedLetters.findIndex(sl => sl.nodeIndex === node.index);
                  const isSelected = selectionIndex !== -1;

                  return (
                    <motion.div
                      key={`node-${node.index}`}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNodeClick(node)}
                    >
                      {/* Floating outer stardust ring */}
                      <div className={`absolute -inset-2 rounded-full border border-dashed transition-all duration-300 ${
                        isSelected 
                          ? 'border-sky-400/40 rotate-45 animate-spin' 
                          : 'border-white/5 group-hover:border-white/10'
                      }`} 
                        style={{ animationDuration: '6s' }}
                      />

                      {/* Sparkle Node Sphere */}
                      <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center relative transition-all duration-300 border ${
                        isSelected
                          ? 'bg-gradient-to-tr from-sky-600 to-sky-400 border-white shadow-[0_0_15px_#38bdf8] text-slate-950 scale-105'
                          : 'bg-slate-900/50 hover:bg-slate-800/80 hover:border-slate-600/80 border-slate-800/80 text-slate-200'
                      }`}>
                        {/* Star icon badge when selected */}
                        {isSelected && (
                          <Star className="w-3.5 h-3.5 text-white fill-current absolute -top-1.5 -right-1" />
                        )}
                        <span className="font-extrabold text-sm">{node.letter}</span>
                        {/* Step number on selection */}
                        {isSelected && (
                          <span className="text-[8px] opacity-80 mt-0.5 font-bold">({selectionIndex + 1})</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Animated Constellation success overlay */}
                {gameState === 'word-success' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-sky-950/20 backdrop-blur-[1px] flex justify-center items-center pointer-events-none"
                  >
                    <div className="bg-slate-950 border border-sky-500/30 px-6 py-3 rounded-2xl flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                      <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
                      <span className="font-black text-sky-300 tracking-wider">
                        별자리 연결 완료! "{currentPuzzle.answer}" ✨
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Bottom control panel: Answer Box & Reset button */}
              <div className="mt-4 pt-4 border-t border-white/5 relative z-20">
                <div className="flex flex-col items-center max-w-sm mx-auto">
                  
                  {/* Spelled Output Row */}
                  <div className="flex justify-center items-center gap-1.5 bg-slate-950/40 border border-slate-800/60 py-3 px-6 rounded-2xl w-full min-h-[48px] shadow-inner mb-3">
                    {selectedLetters.map((sl, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center font-extrabold text-sky-200"
                      >
                        {sl.letter}
                      </motion.div>
                    ))}
                    {selectedLetters.length === 0 && (
                      <span className="text-xs text-slate-500 font-semibold tracking-wide uppercase">
                        단어 조각을 연결하세요...
                      </span>
                    )}
                  </div>

                  {/* Reset Actions */}
                  {selectedLetters.length > 0 && (
                    <button
                      onClick={handleResetSpelling}
                      className="px-4 py-2 bg-slate-900 border border-white/10 hover:border-rose-500/30 hover:text-rose-300 text-slate-300 rounded-xl cursor-pointer text-[10px] font-bold flex items-center gap-1.5 transition-all duration-150 active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>다시 잇기 (리셋)</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </AnimatePresence>

      </div>

      {/* Footer warning */}
      <div className="text-center text-[10px] text-slate-400 uppercase tracking-widest">
        ✦ 틀린 철자를 선택하면 궤도가 풀려 초기화됩니다 ✦
      </div>
    </div>
  );
}
