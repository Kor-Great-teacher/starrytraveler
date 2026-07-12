import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Sparkles, Droplet, BookOpen, Coins, Award, ArrowRight, Gift, Shield, Compass, Star 
} from 'lucide-react';
import { PlayerStats, InventoryItem } from '../types';
import { CHAR_DIALOGUES, SHOP_ITEMS } from '../data';
import { playWatering, playChime, playClick, playSuccess, playError } from '../utils/audio';

const BlueRose = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.85)] ${className}`} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="40" fill="rgba(8,145,178,0.2)" stroke="#22d3ee" strokeWidth="6" />
    <circle cx="50" cy="50" r="28" fill="#06b6d4" />
    <circle cx="45" cy="45" r="18" fill="#22d3ee" />
    <circle cx="55" cy="40" r="12" fill="#e0f2fe" />
    <ellipse cx="50" cy="50" rx="6" ry="3" fill="#ffffff" />
  </svg>
);

interface BaseCampProps {
  playerStats: PlayerStats;
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
  inventory: string[];
  setInventory: React.Dispatch<React.SetStateAction<string[]>>;
  completedNodes: string[];
  onStartJourney: () => void;
}

export default function BaseCamp({
  playerStats,
  setPlayerStats,
  inventory,
  setInventory,
  completedNodes,
  onStartJourney
}: BaseCampProps) {
  const [activeSpeech, setActiveSpeech] = useState<{ char: string; text: string } | null>(null);
  const [shopItems, setShopItems] = useState<InventoryItem[]>(() => {
    return SHOP_ITEMS.map(item => ({
      ...item,
      purchased: inventory.includes(item.id)
    }));
  });

  const triggerDialogue = (character: 'prince' | 'rose' | 'fox') => {
    playClick();
    const dialogues = CHAR_DIALOGUES[character];
    const randomText = dialogues[Math.floor(Math.random() * dialogues.length)];
    
    let charName = '';
    if (character === 'prince') charName = '어린 왕자';
    else if (character === 'rose') charName = '장미';
    else if (character === 'fox') charName = '사막여우';

    setActiveSpeech({ char: charName, text: randomText });
  };

  const handleWaterRose = () => {
    if (playerStats.starPieces < 3) {
      playError();
      setActiveSpeech({
        char: '장미',
        text: '물뿌리개에 채워줄 별 조각(3개)이 부족한 것 같아요...'
      });
      return;
    }

    playWatering();
    const hasWateringCan = inventory.includes('watering_can');
    const happinessGained = hasWateringCan ? 15 : 8;
    const finalHappiness = Math.min(100, playerStats.roseHappiness + happinessGained);

    setPlayerStats(prev => ({
      ...prev,
      starPieces: prev.starPieces - 3,
      roseHappiness: finalHappiness
    }));

    setActiveSpeech({
      char: '장미',
      text: finalHappiness === 100 
        ? '말갛고 신선한 이 물 한 잔에 마음 깊이 감사해요! 은하수의 비밀 별자리 지도가 밝아졌어요!'
        : '앗 차가워! 하지만 너무 개운해요. 다정하게 가꾸어 주어 정말 고마워요.'
    });

    // Special bonus for 100% happiness
    if (finalHappiness === 100 && playerStats.roseHappiness < 100) {
      setTimeout(() => {
        playSuccess();
        setPlayerStats(prev => ({
          ...prev,
          starPieces: prev.starPieces + 15,
          exp: prev.exp + 50
        }));
      }, 1000);
    }
  };

  const handlePatFox = () => {
    if (playerStats.starPieces < 3) {
      playError();
      setActiveSpeech({
        char: '사막여우',
        text: '여우 간식(별 조각 3개)을 가져다주면 더 기쁘게 꼬리를 흔들 수 있어!'
      });
      return;
    }

    playChime(440);
    const finalBond = Math.min(100, playerStats.foxBond + 8);

    setPlayerStats(prev => ({
      ...prev,
      starPieces: prev.starPieces - 3,
      foxBond: finalBond
    }));

    setActiveSpeech({
      char: '사막여우',
      text: finalBond === 100
        ? '이제 우린 완전히 길들여진 단 하나의 친구가 되었어! 네가 언제 오든 난 설레는 마음으로 기다릴게.'
        : '꼬리가 꼬물꼬물 기분이 좋아! 너의 따뜻한 손길은 밀밭의 황금 파도보다 마음을 편안하게 해.'
    });

    if (finalBond === 100 && playerStats.foxBond < 100) {
      setTimeout(() => {
        playSuccess();
        setPlayerStats(prev => ({
          ...prev,
          starPieces: prev.starPieces + 15,
          exp: prev.exp + 50
        }));
      }, 1000);
    }
  };

  const handlePurchase = (item: InventoryItem) => {
    if (playerStats.starPieces < item.cost) {
      playError();
      setActiveSpeech({
        char: '상점',
        text: `별 조각이 부족합니다! (필요 수량: ${item.cost}개)`
      });
      return;
    }

    playSuccess();
    setInventory(prev => [...prev, item.id]);
    setPlayerStats(prev => ({
      ...prev,
      starPieces: prev.starPieces - item.cost
    }));

    setShopItems(prev => prev.map(si => si.id === item.id ? { ...si, purchased: true } : si));

    // Instant benefit upon purchase
    if (item.id === 'glass_dome') {
      setPlayerStats(prev => ({ ...prev, roseHappiness: Math.min(100, prev.roseHappiness + 30) }));
    }

    setActiveSpeech({
      char: '탐험 정보',
      text: `[${item.name}] 장비를 장착했습니다! ${item.effectText}`
    });
  };

  // Render proper icon component for items
  const renderItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'Droplet': return <Droplet className="w-5 h-5 text-sky-400" />;
      case 'Gift': return <Gift className="w-5 h-5 text-rose-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-amber-400" />;
      default: return <Sparkles className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div id="base-camp" className="relative w-full min-h-screen z-10 flex flex-col justify-between p-4 md:p-6 select-none text-white">
      {/* Top Banner: Stats Card */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full grid grid-cols-2 lg:grid-cols-5 gap-3 bg-slate-900/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-4 shadow-xl"
      >
        <div className="flex items-center gap-3 px-1">
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.2)]">
            <span className="font-bold text-indigo-300">Lv.{playerStats.level}</span>
          </div>
          <div className="flex-1">
            <div className="text-xs text-slate-400">여행 경험치 (EXP)</div>
            <div className="w-full bg-slate-800/60 rounded-full h-2 mt-1 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
                style={{ width: `${(playerStats.exp % 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-right text-indigo-400/80 mt-0.5">{(playerStats.exp % 100)} / 100</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-1 border-l border-slate-800/80 pl-4">
          <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-400/30 flex items-center justify-center shadow-[0_0_10px_rgba(250,204,21,0.2)]">
            <Coins className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <div className="text-xs text-slate-400">별 조각 (Star Pieces)</div>
            <div className="text-lg font-black text-yellow-300 flex items-center gap-1 mt-0.5">
              {playerStats.starPieces} <span className="text-xs font-normal text-yellow-400/70">개</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-1 border-l border-slate-800/80 pl-4 col-span-1">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-400/30 flex items-center justify-center shadow-[0_0_10px_rgba(244,63,94,0.2)]">
            <Heart className="w-5 h-5 text-rose-400" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-slate-400 flex justify-between">
              <span>장미의 행복도</span>
              <span className="text-[10px] text-rose-400 font-semibold">{playerStats.roseHappiness}%</span>
            </div>
            <div className="w-full bg-slate-800/60 rounded-full h-2 mt-1 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-pink-500 to-rose-400 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(244,63,94,0.5)]" 
                style={{ width: `${playerStats.roseHappiness}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              <button 
                onClick={handleWaterRose}
                className="text-[10px] px-2.5 py-0.5 bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/30 rounded-md text-rose-200 cursor-pointer active:scale-95 transition-transform"
              >
                물주기 💧 3
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-1 border-l border-slate-800/80 pl-4 col-span-1">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-400/30 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <Sparkles className="w-5 h-5 text-orange-400" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-slate-400 flex justify-between">
              <span>여우와의 교감</span>
              <span className="text-[10px] text-orange-400 font-semibold">{playerStats.foxBond}%</span>
            </div>
            <div className="w-full bg-slate-800/60 rounded-full h-2 mt-1 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
                style={{ width: `${playerStats.foxBond}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              <button 
                onClick={handlePatFox}
                className="text-[10px] px-2.5 py-0.5 bg-orange-500/20 hover:bg-orange-500/35 border border-orange-500/30 rounded-md text-orange-200 cursor-pointer active:scale-95 transition-transform"
              >
                쓰다듬기 🦊 3
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 flex items-center justify-center lg:justify-end gap-2 px-1 border-l border-slate-800/80 pl-4">
          <div className="flex gap-1">
            {shopItems.filter(si => si.purchased).map(si => (
              <div 
                key={si.id} 
                title={si.name} 
                className="w-8 h-8 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-center"
              >
                {renderItemIcon(si.id === 'glass_dome' ? 'Shield' : si.id === 'watering_can' ? 'Droplet' : si.id === 'fox_scarf' ? 'Gift' : 'Compass')}
              </div>
            ))}
            {shopItems.filter(si => si.purchased).length === 0 && (
              <span className="text-xs text-slate-500">장착한 장비 없음</span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content: Outer Columns & Interactive Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 flex-1 items-stretch">
        
        {/* Left Column: B612 Shop */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 bg-slate-900/40 backdrop-blur-lg rounded-3xl border border-slate-700/50 p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden"
        >
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800/80 pb-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold tracking-tight">은하 상점</h2>
              <span className="text-xs text-slate-400 font-normal">별빛으로 장비 업그레이드</span>
            </div>

            <div className="space-y-3.5 overflow-y-auto max-h-[350px] pr-1">
              {shopItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-3 rounded-xl border transition-all duration-200 flex gap-3 ${
                    item.purchased 
                      ? 'bg-slate-950/40 border-slate-800/40 opacity-80' 
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-indigo-500/50 shadow-inner'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800">
                    {renderItemIcon(item.id === 'glass_dome' ? 'Shield' : item.id === 'watering_can' ? 'Droplet' : item.id === 'fox_scarf' ? 'Gift' : 'Compass')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-1">
                      <h3 className="text-xs font-bold truncate">{item.name}</h3>
                      {item.purchased ? (
                        <span className="text-[10px] bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded-full border border-slate-800 shrink-0">구매 완료</span>
                      ) : (
                        <span className="text-[10px] bg-amber-500/10 text-amber-300 font-bold px-1.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-0.5 shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                          <Coins className="w-3 h-3" /> {item.cost}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">{item.description}</p>
                    
                    {!item.purchased && (
                      <button 
                        onClick={() => handlePurchase(item)}
                        className="mt-2 w-full text-center text-[10px] py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg cursor-pointer border border-indigo-400/30 transition-all duration-150 active:scale-95"
                      >
                        별 조각 {item.cost}개로 구매
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            🌿 장비들은 우주 미니게임을 수월하게 격파하고 별 조각과 경험치를 더 많이 모을 수 있는 귀중한 조력자입니다.
          </div>
        </motion.div>

        {/* Center Section: Interactive Animated Asteroid B612 */}
        <div className="lg:col-span-4 flex flex-col justify-center items-center min-h-[360px] relative">
          
          {/* Character Speech Bubble Pop-Up */}
          <AnimatePresence mode="wait">
            {activeSpeech && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="absolute top-2 z-30 max-w-[280px] bg-slate-900/95 text-white rounded-2xl border border-slate-700/50 p-3.5 shadow-2xl text-xs leading-relaxed backdrop-blur-md"
              >
                <div className="font-extrabold text-amber-300 mb-1 flex items-center gap-1">
                  🌟 {activeSpeech.char}
                </div>
                <div>{activeSpeech.text}</div>
                <button 
                  onClick={() => setActiveSpeech(null)}
                  className="mt-2 text-[10px] font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  [닫기]
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Planet B612 CSS Render */}
          <div className="relative w-72 h-72 flex items-center justify-center">
            
            {/* Soft Glowing Rings around planet */}
            <div className="absolute w-[290px] h-[290px] rounded-full border border-blue-500/10 animate-ping duration-3000 pointer-events-none" />
            <div className="absolute w-[330px] h-[330px] rounded-full border-2 border-indigo-400/5 rotate-12 pointer-events-none" />

            {/* B612 Base Planet Sphere */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 80, ease: 'linear' }}
              className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-[#090b24] via-[#111646] to-[#182264] border-2 border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.35)] overflow-hidden"
            >
              {/* Soft space clouds inside the planet */}
              <div className="absolute top-4 left-6 w-20 h-20 rounded-full bg-cyan-900/20 blur-md" />
              <div className="absolute top-28 left-20 w-24 h-24 rounded-full bg-blue-900/25 blur-lg" />
              
              {/* Glowing Yellow Cobblestone path looping beautifully across the planet */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 224 224">
                <path 
                  d="M 25,120 Q 112,65 199,120 T 112,190 Z" 
                  fill="none" 
                  stroke="#eab308" 
                  strokeWidth="14" 
                  strokeLinecap="round" 
                  opacity="0.65" 
                  className="drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]"
                />
                <path 
                  d="M 25,120 Q 112,65 199,120 T 112,190 Z" 
                  fill="none" 
                  stroke="#fbbf24" 
                  strokeWidth="10" 
                  strokeLinecap="round" 
                  strokeDasharray="4 4"
                  opacity="0.8" 
                />
              </svg>

              {/* The Cute Storybook Cottage nestling on the planet with warm glowing window */}
              <div className="absolute top-[80px] left-[65px] w-9 h-9 pointer-events-none select-none z-10 flex flex-col items-center rotate-[-12deg]">
                {/* Roof */}
                <div className="w-8 h-4 bg-[#7c2d12] rounded-t-full relative -mb-1 shadow-md">
                  <div className="absolute top-1 right-1.5 w-1.5 h-3 bg-[#451a03] rounded-t-sm" />
                </div>
                {/* Base */}
                <div className="w-7 h-6 bg-[#fef3c7] rounded-sm relative shadow-md border-t border-amber-200/50">
                  <div className="absolute bottom-0 left-1 w-2.5 h-4.5 bg-[#7c2d12] rounded-t-sm" />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-[#f59e0b] rounded-sm shadow-[0_0_6px_#fbbf24] animate-pulse" />
                </div>
              </div>

              {/* Lush garden of beautiful Glowing Neon Blue Roses covering B612 (just like the uploaded image!) */}
              <BlueRose className="absolute top-[35px] left-[45px] scale-110" />
              <BlueRose className="absolute top-[45px] left-[130px] scale-95" />
              <BlueRose className="absolute top-[75px] left-[25px] scale-100" />
              <BlueRose className="absolute top-[135px] left-[35px] scale-105" />
              <BlueRose className="absolute top-[145px] left-[110px] scale-90" />
              <BlueRose className="absolute top-[110px] left-[165px] scale-110" />
              <BlueRose className="absolute top-[55px] left-[160px] scale-100" />
              <BlueRose className="absolute top-[15px] left-[85px] scale-105" />
              <BlueRose className="absolute top-[165px] left-[70px] scale-95" />
              <BlueRose className="absolute top-[105px] left-[85px] scale-100" />
              <BlueRose className="absolute top-[115px] left-[135px] scale-105" />
              <BlueRose className="absolute top-[155px] left-[155px] scale-90" />
              
              {/* Additional small sparkling stars on the planet surface */}
              <div className="absolute top-[25px] left-[115px] w-1 h-1 bg-yellow-200 rounded-full animate-ping" />
              <div className="absolute top-[125px] left-[65px] w-1 h-1 bg-white rounded-full animate-pulse" />
              <div className="absolute top-[70px] left-[185px] w-1 h-1 bg-yellow-200 rounded-full animate-ping" />
            </motion.div>

            {/* VOLCANO: Smoking Volcano on Top */}
            <motion.div 
              onClick={() => triggerDialogue('prince')}
              className="absolute top-2 left-1/2 -translate-x-1/2 z-20 cursor-pointer group flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
            >
              {/* Smoke particle effect simulation */}
              <div className="relative h-6 w-6">
                <span className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-400/40 blur-[1px] rounded-full animate-bounce mt-1" />
                <span className="absolute left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-300/30 rounded-full animate-ping mt-0" />
              </div>
              {/* SVG Volcano shape */}
              <svg className="w-10 h-10 -mt-1 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" viewBox="0 0 100 100">
                <polygon points="50,15 15,90 85,90" fill="#2d3748" stroke="#ef4444" strokeWidth="2" />
                {/* Lava core */}
                <ellipse cx="50" cy="18" rx="10" ry="4" fill="#f87171" />
                <path d="M50,18 L46,60 L54,60 Z" fill="#ef4444" />
              </svg>
            </motion.div>

            {/* ROSE: The Prince's Rose (Center/Right Surface) */}
            <motion.div 
              onClick={() => triggerDialogue('rose')}
              className="absolute bottom-16 right-4 z-20 cursor-pointer flex flex-col items-center group"
              whileHover={{ scale: 1.08 }}
            >
              {/* Glass Dome */}
              {inventory.includes('glass_dome') ? (
                <div className="absolute -top-3 w-12 h-14 bg-blue-300/20 backdrop-blur-[1px] border border-blue-200/40 rounded-t-full rounded-b-lg shadow-[inset_0_0_10px_rgba(147,197,253,0.3)] animate-pulse" />
              ) : null}

              {/* Glowing Red Rose SVG */}
              <div className="w-8 h-8 flex items-center justify-center relative">
                <svg className="w-6 h-6 z-10 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-pulse" viewBox="0 0 100 100">
                  {/* Stem */}
                  <path d="M50,45 L50,90" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
                  <path d="M50,70 Q30,60 40,55" stroke="#10b981" strokeWidth="4" strokeLinecap="round" fill="none" />
                  {/* Rose Flower Bud */}
                  <circle cx="50" cy="35" r="18" fill="#f43f5e" />
                  <circle cx="45" cy="30" r="12" fill="#e11d48" />
                  <circle cx="53" cy="27" r="10" fill="#be123c" />
                  {/* Petals */}
                  <ellipse cx="50" cy="35" rx="8" ry="4" fill="#fda4af" />
                </svg>
                {/* Floating sparkling rose dust */}
                <div className="absolute w-full h-full bg-rose-500/10 blur-sm rounded-full -z-10 group-hover:bg-rose-500/25 transition-all" />
              </div>
              <span className="text-[10px] bg-slate-950/80 border border-slate-800 px-1.5 py-0.5 rounded-md font-semibold text-rose-300 mt-1">
                장미 🌹
              </span>
            </motion.div>

            {/* THE LITTLE PRINCE & THE FOX sitting together on left/bottom surface */}
            <motion.div 
              onClick={() => triggerDialogue('prince')}
              className="absolute bottom-12 left-2 z-20 cursor-pointer flex items-end gap-1.5 group"
              whileHover={{ scale: 1.05 }}
            >
              {/* Little Prince rendering (Custom Vector/SVG style with CSS) */}
              <div className="flex flex-col items-center">
                {/* Hair */}
                <div className="w-6 h-4 bg-yellow-300 rounded-full relative -mb-1 shadow-[0_0_6px_rgba(253,224,71,0.5)]">
                  <div className="absolute top-0 left-1 w-2 h-2 bg-yellow-300 rotate-45" />
                  <div className="absolute top-0 right-1 w-2 h-2 bg-yellow-300 rotate-12" />
                </div>
                {/* Head */}
                <div className="w-5 h-5 bg-orange-100 rounded-full" />
                {/* Green Tunic with yellow scarf */}
                <div className="w-6 h-8 bg-emerald-600 rounded-t-md relative flex justify-center">
                  {/* Scarf flowing to the side */}
                  <div className="absolute -left-3 top-0 w-4 h-1.5 bg-yellow-400 rounded-md transform -rotate-12 animate-pulse" />
                  {/* Belts */}
                  <div className="absolute bottom-1.5 w-full h-1 bg-amber-500" />
                </div>
                <span className="text-[10px] bg-slate-950/80 border border-slate-800 px-1.5 py-0.5 rounded-md font-semibold text-yellow-300 mt-1">
                  어린 왕자 👑
                </span>
              </div>

              {/* Cute little orange Fox */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  triggerDialogue('fox');
                }}
                className="flex flex-col items-center cursor-pointer"
              >
                {/* Fox Head */}
                <div className="relative w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                  {/* Ears */}
                  <div className="absolute -top-1.5 -left-1 w-2 h-3 bg-orange-500 rounded-t-full transform -rotate-12" />
                  <div className="absolute -top-1.5 -right-1 w-2 h-3 bg-orange-500 rounded-t-full transform rotate-12" />
                  {/* White muzzle */}
                  <div className="absolute bottom-0 w-3 h-2 bg-white rounded-b-full" />
                </div>
                {/* Fox Body */}
                <div className="w-5 h-6 bg-orange-500 rounded-t-md relative">
                  {/* Tail */}
                  <div className="absolute -right-2 bottom-1 w-3 h-5 bg-orange-600 rounded-full transform rotate-45 origin-bottom" />
                </div>
                <span className="text-[10px] bg-slate-950/80 border border-slate-800 px-1.5 py-0.5 rounded-md font-semibold text-orange-400 mt-1">
                  사막여우 🦊
                </span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Right Column: Travel Log & Story Quotes */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 bg-slate-900/40 backdrop-blur-lg rounded-3xl border border-slate-700/50 p-5 flex flex-col justify-between shadow-2xl"
        >
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800/80 pb-2">
              <BookOpen className="w-5 h-5 text-sky-400" />
              <h2 className="text-lg font-bold tracking-tight">여행 일지</h2>
              <span className="text-xs text-slate-400 font-normal">나의 우주 정복 기록</span>
            </div>

            {/* Travel stats */}
            <div className="space-y-4 mb-4">
              <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 shadow-inner">
                <div className="text-xs text-slate-400">정복한 은하 구역</div>
                <div className="text-2xl font-extrabold text-sky-400 mt-1 flex items-baseline gap-1">
                  {completedNodes.length} <span className="text-xs font-normal text-slate-400">/ 13 개 도시</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div 
                    className="bg-sky-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(56,189,248,0.4)]" 
                    style={{ width: `${(completedNodes.length / 13) * 100}%` }}
                  />
                </div>
              </div>

              {/* Progress per subject */}
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]" /> 수학의 별
                  </span>
                  <span className="font-semibold text-amber-300">
                    {completedNodes.filter(n => n.startsWith('math-')).length} / 4 단원
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_6px_rgba(56,189,248,0.6)]" /> 언어의 별
                  </span>
                  <span className="font-semibold text-sky-300">
                    {completedNodes.filter(n => n.startsWith('lang-')).length} / 3 단원
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" /> 과학의 별
                  </span>
                  <span className="font-semibold text-emerald-300">
                    {completedNodes.filter(n => n.startsWith('sci-')).length} / 3 단원
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_6px_rgba(139,92,246,0.6)]" /> 예술의 별
                  </span>
                  <span className="font-semibold text-violet-300">
                    {completedNodes.filter(n => n.startsWith('art-')).length} / 3 단원
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Inspirational storybook quote card */}
          <div className="p-4 bg-gradient-to-br from-indigo-950/30 to-slate-950/60 rounded-2xl border border-slate-800 shadow-inner">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-indigo-400 mb-1">
              <Star className="w-3 h-3 animate-spin duration-3000" /> 어린 왕자의 글귀
            </div>
            <p className="text-xs text-slate-200 leading-relaxed italic">
              "사막이 아름다운 건, 어딘가에 우물을 감추고 있기 때문이야. 너의 행성에서 찾은 지혜들이 바로 그 우물의 시원한 물 한 잔이란다."
            </p>
          </div>
        </motion.div>

      </div>

      {/* Start button section with rocket ignition feel */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto flex flex-col items-center gap-2 mt-4"
      >
        <button 
          onClick={() => {
            playClick();
            onStartJourney();
          }}
          className="relative w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl font-black text-lg tracking-wider text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_35px_rgba(79,70,229,0.6)] cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-200 border border-indigo-400/30 overflow-hidden group flex items-center justify-center gap-2"
        >
          {/* Internal flash effect */}
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
          
          <Compass className="w-6 h-6 animate-spin duration-3000 text-yellow-300" />
          <span>우주 여행 시작하기</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </button>
        <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest animate-pulse">
          🚀 우주선에 연료가 가득 찼습니다. 다음 행성으로 도약하세요!
        </p>
      </motion.div>
    </div>
  );
}
