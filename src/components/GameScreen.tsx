import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Check, X } from "lucide-react";

interface GameScreenProps {
  word: string;
  timeLeft: number;
  score: number;
  onCorrect: () => void;
  onPass: () => void;
  onTimeUp: () => void;
  imageUrl?: string;
}

export function GameScreen({ 
  word, 
  timeLeft, 
  score, 
  onCorrect, 
  onPass, 
  onTimeUp,
  imageUrl = "/placeholder.svg"
}: GameScreenProps) {
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);

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

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-8 text-center max-w-xl w-full px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Timer className="w-6 h-6" />
            <span className="text-2xl font-bold">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="text-2xl font-bold">Score: {score}</div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={word}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="p-8 bg-cream rounded-xl shadow-lg space-y-4"
          >
            <motion.img
              src={imageUrl}
              alt={word}
              className="w-48 h-48 object-cover rounded-lg mx-auto"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
            <h1 className="text-4xl font-bold text-coffee-dark mt-4">{word}</h1>
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
            onClick={onPass}
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
        </AnimatePresence>
      </div>
    </div>
  );
}