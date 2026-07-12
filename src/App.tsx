import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Award, Star, Volume2, VolumeX } from 'lucide-react';
import { ScreenType, PlayerStats, Planet, PlanetNode } from './types';
import { PLANETS } from './data';
import { playLevelUp, playClick, playSuccess } from './utils/audio';

// Components
import BackgroundStars from './components/BackgroundStars';
import BaseCamp from './components/BaseCamp';
import SpaceWorldmap from './components/SpaceWorldmap';
import PlanetEntryMap from './components/PlanetEntryMap';
import MathGame from './components/MathGame';
import LanguageGame from './components/LanguageGame';
import ScienceGame from './components/ScienceGame';
import ArtGame from './components/ArtGame';

const LOCAL_STORAGE_KEY = 'star_traveler_save_state_v1';

export default function App() {
  // Game state
  const [screen, setScreen] = useState<ScreenType>('base-camp');
  const [activePlanetId, setActivePlanetId] = useState<string | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  // Player state
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    level: 1,
    exp: 0,
    starPieces: 10, // start with 10 star pieces for early purchases
    roseHappiness: 30,
    foxBond: 10,
  });

  const [inventory, setInventory] = useState<string[]>([]);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  
  // Custom Level up overlay popup
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState({ oldLevel: 1, newLevel: 2 });

  // 1. LOAD GAME DATA ON MOUNT
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.playerStats) setPlayerStats(parsed.playerStats);
        if (parsed.inventory) setInventory(parsed.inventory);
        if (parsed.completedNodes) setCompletedNodes(parsed.completedNodes);
        if (parsed.screen) setScreen(parsed.screen);
        if (parsed.activePlanetId) setActivePlanetId(parsed.activePlanetId);
        if (parsed.activeNodeId) setActiveNodeId(parsed.activeNodeId);
      }
    } catch (e) {
      console.warn('Could not load saved game state:', e);
    }
  }, []);

  // 2. SAVE GAME DATA ON CHANGES
  useEffect(() => {
    try {
      const stateToSave = {
        playerStats,
        inventory,
        completedNodes,
        screen,
        activePlanetId,
        activeNodeId
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Could not save game state:', e);
    }
  }, [playerStats, inventory, completedNodes, screen, activePlanetId, activeNodeId]);

  // 3. EXP GAIN & LEVEL UP FORMULA
  const gainExp = (amount: number) => {
    setPlayerStats((prev) => {
      // Calculate scarf bonus if purchased (20% bonus)
      const hasScarf = inventory.includes('fox_scarf');
      const finalAmount = hasScarf ? Math.round(amount * 1.2) : amount;

      const totalExp = prev.exp + finalAmount;
      const targetExp = prev.level * 100;

      if (totalExp >= targetExp) {
        // Level Up!
        const extraExp = totalExp - targetExp;
        const nextLevel = prev.level + 1;

        // Trigger level up modal
        setTimeout(() => {
          playLevelUp();
          setLevelUpInfo({ oldLevel: prev.level, newLevel: nextLevel });
          setShowLevelUpModal(true);
        }, 300);

        return {
          ...prev,
          level: nextLevel,
          exp: extraExp,
          starPieces: prev.starPieces + 15, // reward 15 star pieces
        };
      }

      return {
        ...prev,
        exp: totalExp,
      };
    });
  };

  const handleStartJourney = () => {
    setScreen('world-map');
  };

  const handleSelectPlanet = (planetId: string) => {
    setActivePlanetId(planetId);
    setScreen('planet-map');
  };

  const handleBackToBase = () => {
    setScreen('base-camp');
    setActivePlanetId(null);
    setActiveNodeId(null);
  };

  const handleBackToWorldMap = () => {
    setScreen('world-map');
    setActivePlanetId(null);
    setActiveNodeId(null);
  };

  const handleSelectNode = (nodeId: string) => {
    setActiveNodeId(nodeId);
    setScreen('game');
  };

  // 4. GAME COMPLETION ROUTER
  const handleGameComplete = (starPiecesEarned: number, expEarned: number) => {
    if (!activeNodeId) return;

    // Add completed node ID
    if (!completedNodes.includes(activeNodeId)) {
      setCompletedNodes((prev) => [...prev, activeNodeId]);
    }

    // Award rewards
    setPlayerStats((prev) => ({
      ...prev,
      starPieces: prev.starPieces + starPiecesEarned,
    }));

    gainExp(expEarned);

    // Return to planet map
    setScreen('planet-map');
    setActiveNodeId(null);
  };

  const handleExitGame = () => {
    playClick();
    setScreen('planet-map');
    setActiveNodeId(null);
  };

  // Resolve current active objects
  const activePlanet = PLANETS.find((p) => p.id === activePlanetId);
  const activeNode = activePlanet?.nodes.find((n) => n.id === activeNodeId);

  return (
    <div className="relative min-h-screen bg-[#020617] overflow-x-hidden font-sans select-none antialiased">
      {/* 1. Magical interactive particle background */}
      <BackgroundStars />

      {/* 2. Audio Control Header Indicator (For visual feedback only) */}
      <div className="absolute top-4 right-4 z-50 pointer-events-auto flex items-center gap-2">
        <span className="text-[9px] text-indigo-400 font-bold bg-slate-900/60 border border-white/5 px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm shadow-md">
          <Volume2 className="w-3 h-3 text-indigo-300 animate-pulse" />
          <span>우주 오디오 켬</span>
        </span>
      </div>

      {/* 3. Screen Router Layout with Fade transitions */}
      <main className="relative min-h-screen w-full flex flex-col justify-between max-w-7xl mx-auto z-10">
        <AnimatePresence mode="wait">
          {screen === 'base-camp' && (
            <motion.div
              key="base-camp"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full flex-1"
            >
              <BaseCamp
                playerStats={playerStats}
                setPlayerStats={setPlayerStats}
                inventory={inventory}
                setInventory={setInventory}
                completedNodes={completedNodes}
                onStartJourney={handleStartJourney}
              />
            </motion.div>
          )}

          {screen === 'world-map' && (
            <motion.div
              key="world-map"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full flex-1"
            >
              <SpaceWorldmap
                playerStats={playerStats}
                completedNodes={completedNodes}
                onSelectPlanet={handleSelectPlanet}
                onBackToBase={handleBackToBase}
              />
            </motion.div>
          )}

          {screen === 'planet-map' && activePlanet && (
            <motion.div
              key="planet-map"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full flex-1"
            >
              <PlanetEntryMap
                planet={activePlanet}
                playerStats={playerStats}
                completedNodes={completedNodes}
                onBackToWorldMap={handleBackToWorldMap}
                onSelectNode={handleSelectNode}
              />
            </motion.div>
          )}

          {screen === 'game' && activePlanet && activeNode && (
            <motion.div
              key="minigame"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full flex-1"
            >
              {activePlanet.gameType === 'math' && (
                <MathGame
                  nodeId={activeNode.id}
                  nodeName={activeNode.name}
                  onGameComplete={handleGameComplete}
                  onExit={handleExitGame}
                />
              )}
              {activePlanet.gameType === 'language' && (
                <LanguageGame
                  nodeId={activeNode.id}
                  nodeName={activeNode.name}
                  onGameComplete={handleGameComplete}
                  onExit={handleExitGame}
                />
              )}
              {activePlanet.gameType === 'science' && (
                <ScienceGame
                  nodeId={activeNode.id}
                  nodeName={activeNode.name}
                  onGameComplete={handleGameComplete}
                  onExit={handleExitGame}
                />
              )}
              {activePlanet.gameType === 'art' && (
                <ArtGame
                  nodeId={activeNode.id}
                  nodeName={activeNode.name}
                  onGameComplete={handleGameComplete}
                  onExit={handleExitGame}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 4. Magical Glowing Level Up Modal Overlay Popup */}
      <AnimatePresence>
        {showLevelUpModal && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4 select-none">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-400/40 rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(139,92,246,0.3)] relative overflow-hidden"
            >
              {/* Internal flashing elements */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none" />
              <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="w-20 h-20 bg-amber-500/10 border-2 border-amber-400/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Sparkles className="w-11 h-11 text-amber-400 animate-pulse" />
              </div>

              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold uppercase px-2.5 py-1 rounded-full border border-amber-400/30 tracking-widest">
                레벨 업 (Level Up)
              </span>

              <h2 className="text-2xl font-black text-white mt-4 tracking-tight">
                우주 여행가 레벨 상승!
              </h2>

              <div className="flex justify-center items-center gap-6 my-6">
                <div className="text-slate-400">
                  <div className="text-xs">기존 레벨</div>
                  <div className="text-2xl font-black">{levelUpInfo.oldLevel}</div>
                </div>
                <div className="w-8 h-0.5 bg-indigo-500/30 rounded" />
                <div className="text-amber-300 font-bold">
                  <div className="text-xs text-slate-400">새로운 레벨</div>
                  <div className="text-3xl font-black drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                    {levelUpInfo.newLevel}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                레벨업 축하 보상으로 <span className="font-bold text-yellow-300">별 조각 15개</span>가 우주 수하물창으로 자동 지급되었습니다!
              </p>

              <button
                onClick={() => {
                  playSuccess();
                  setShowLevelUpModal(false);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black rounded-2xl cursor-pointer shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-widest"
              >
                고마워! 탐험 계속하기
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
