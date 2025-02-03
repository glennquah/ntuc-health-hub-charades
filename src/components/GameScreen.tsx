import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

interface GameScreenProps {
  word: {
    translations: Record<string, string>;
  };
  timeLeft: number;
  score: number;
  onCorrect: () => void;
  onPass: () => void;
  onTimeUp: () => void;
  selectedLanguages: string[];
}

export function GameScreen({ 
  word, 
  timeLeft, 
  score, 
  onCorrect, 
  onPass, 
  onTimeUp,
  selectedLanguages
}: GameScreenProps) {
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  const [showPassAnimation, setShowPassAnimation] = useState(false);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  const handleCorrect = () => {
    setShowCorrectAnimation(true);
    setTimeout(() => {
      setShowCorrectAnimation(false);
      onCorrect();
    }, 800);
  };

  const handlePass = () => {
    setShowPassAnimation(true);
    setTimeout(() => {
      setShowPassAnimation(false);
      onPass();
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-8 text-center max-w-xl w-full px-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-2xl font-bold">Score: {score}</div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={Object.values(word.translations).join('-')}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="p-8 bg-cream rounded-xl shadow-lg space-y-4"
          >
            <div className="space-y-4">
              {selectedLanguages.map((lang) => (
                word.translations[lang] && (
                  <div key={lang} className="text-3xl font-bold">
                    {word.translations[lang]}
                  </div>
                )
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-4">
          <Button
            onClick={handleCorrect}
            className="h-16 w-32 text-lg bg-green-600 hover:bg-green-700"
          >
            <Check className="mr-2" /> Correct
          </Button>
          <Button
            onClick={handlePass}
            variant="outline"
            className="h-16 w-32 text-lg border-2"
          >
            <X className="mr-2" /> Pass
          </Button>
        </div>

        <AnimatePresence>
          {showCorrectAnimation && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none"
            >
              <Check className="w-24 h-24 text-green-500" />
            </motion.div>
          )}
          {showPassAnimation && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none"
            >
              <X className="w-24 h-24 text-red-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}