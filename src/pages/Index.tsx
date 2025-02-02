import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TopicSelector } from "@/components/TopicSelector";
import { TimerSelector } from "@/components/TimerSelector";
import { GameScreen } from "@/components/GameScreen";
import { Language, Topic, GameSettings, GameState } from "@/types/game";
import { Button } from "@/components/ui/button";

export default function Index() {
  const [gameSettings, setGameSettings] = useState<Partial<GameSettings>>({
    languages: [],
    topics: [],
  });
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [step, setStep] = useState<'language' | 'topics' | 'timer' | 'game' | 'results'>('language');

  const handleLanguageToggle = (language: Language) => {
    setGameSettings(prev => ({
      ...prev,
      languages: prev.languages?.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...(prev.languages || []), language]
    }));
  };

  const handleTopicToggle = (topic: Topic) => {
    setGameSettings(prev => ({
      ...prev,
      topics: prev.topics?.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...(prev.topics || []), topic]
    }));
  };

  const handleTimerSelect = (timer: number) => {
    setGameSettings(prev => ({ ...prev, timer }));
    setStep('game');
    startGame();
  };

  const startGame = () => {
    setGameState({
      score: 0,
      currentWord: "Laksa",
      timeLeft: gameSettings.timer || 60,
      isPlaying: true
    });
  };

  const handleCorrect = () => {
    setGameState(prev => prev ? {
      ...prev,
      score: prev.score + 1,
      currentWord: "Merlion"
    } : null);
  };

  const handlePass = () => {
    setGameState(prev => prev ? {
      ...prev,
      currentWord: "Chope"
    } : null);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState?.isPlaying && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => prev ? {
          ...prev,
          timeLeft: prev.timeLeft - 1
        } : null);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState?.isPlaying]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-center text-coffee-dark mb-8">
          Lai Lai Guess Guess!
        </h1>

        {step === 'language' && (
          <LanguageSelector
            selectedLanguages={gameSettings.languages || []}
            onToggleLanguage={handleLanguageToggle}
            onNext={() => setStep('topics')}
          />
        )}

        {step === 'topics' && (
          <div className="space-y-6">
            <TopicSelector
              selectedTopics={gameSettings.topics || []}
              onToggleTopic={handleTopicToggle}
            />
            <div className="flex justify-center">
              <Button
                onClick={() => setStep('timer')}
                disabled={!gameSettings.topics?.length}
                className="text-lg px-8"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 'timer' && (
          <TimerSelector
            selectedTime={gameSettings.timer || 60}
            onSelect={handleTimerSelect}
          />
        )}

        {step === 'game' && gameState && (
          <GameScreen
            word={gameState.currentWord}
            timeLeft={gameState.timeLeft}
            score={gameState.score}
            onCorrect={handleCorrect}
            onPass={handlePass}
            onTimeUp={() => setStep('results')}
            imageUrl="/placeholder.svg"
          />
        )}

        {step === 'results' && gameState && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-6"
          >
            <h2 className="text-3xl font-bold text-coffee-dark">Game Over!</h2>
            <p className="text-2xl">Your Score: {gameState.score}</p>
            <Button
              onClick={() => {
                setGameSettings({ languages: [], topics: [] });
                setGameState(null);
                setStep('language');
              }}
              className="text-lg px-8"
            >
              Play Again
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}