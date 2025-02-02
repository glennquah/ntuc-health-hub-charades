import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TopicSelector } from "@/components/TopicSelector";
import { TimerSelector } from "@/components/TimerSelector";
import { GameScreen } from "@/components/GameScreen";
import { Language, Topic, GameSettings, GameState } from "@/types/game";
import { Button } from "@/components/ui/button";

// Temporary word database - replace with actual database later
const wordDatabase = {
  "Singapore Festive": {
    English: ["Chinese New Year", "Hari Raya", "Deepavali"],
    Chinese: ["农历新年", "开斋节", "屠妖节"],
    Hokkien: ["旧年", "开斋节", "屠妖节"],
    Cantonese: ["年三十", "开斋节", "屠妖节"]
  },
  "Local Food and Drinks": {
    English: ["Laksa", "Chicken Rice", "Kopi"],
    Chinese: ["叻沙", "海南鸡饭", "咖啡"],
    Hokkien: ["叻沙", "鸡饭", "咖啡"],
    Cantonese: ["喇沙", "鸡饭", "咖啡"]
  }
  // Add more topics and words as needed
};

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

  const getRandomWord = () => {
    const selectedTopics = gameSettings.topics || [];
    const selectedLanguages = gameSettings.languages || [];
    
    // Get all words from selected topics
    const allWords: { word: string; language: Language }[] = [];
    
    selectedTopics.forEach(topic => {
      selectedLanguages.forEach(language => {
        const wordsForTopic = wordDatabase[topic]?.[language] || [];
        wordsForTopic.forEach(word => {
          allWords.push({ word, language });
        });
      });
    });
    
    // Get a random word from the combined pool
    const randomIndex = Math.floor(Math.random() * allWords.length);
    return allWords[randomIndex]?.word || "No word available";
  };

  const handleTimerSelect = (timer: number) => {
    setGameSettings(prev => ({ ...prev, timer }));
    setStep('game');
    startGame();
  };

  const startGame = () => {
    setGameState({
      score: 0,
      currentWord: getRandomWord(),
      timeLeft: gameSettings.timer || 60,
      isPlaying: true
    });
  };

  const handleCorrect = () => {
    setGameState(prev => prev ? {
      ...prev,
      score: prev.score + 1,
      currentWord: getRandomWord()
    } : null);
  };

  const handlePass = () => {
    setGameState(prev => prev ? {
      ...prev,
      currentWord: getRandomWord()
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
          <TopicSelector
            selectedTopics={gameSettings.topics || []}
            onToggleTopic={handleTopicToggle}
            onNext={() => setStep('timer')}
          />
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