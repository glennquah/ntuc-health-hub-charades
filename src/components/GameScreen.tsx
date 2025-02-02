import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GameState } from "@/types/game";
import { motion } from "framer-motion";
import { Timer, Check, X } from "lucide-react";

interface GameScreenProps {
  word: string;
  timeLeft: number;
  score: number;
  onCorrect: () => void;
  onPass: () => void;
  onTimeUp: () => void;
}

export function GameScreen({ 
  word, 
  timeLeft, 
  score, 
  onCorrect, 
  onPass, 
  onTimeUp 
}: GameScreenProps) {
  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  return (
    <div className="space-y-8 text-center">
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <Timer className="w-6 h-6" />
          <span className="text-2xl font-bold">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
        </div>
        <div className="text-2xl font-bold">Score: {score}</div>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-8 bg-cream rounded-xl shadow-lg"
      >
        <h1 className="text-4xl font-bold text-coffee-dark">{word}</h1>
      </motion.div>

      <div className="flex justify-center gap-4">
        <Button
          onClick={onCorrect}
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
    </div>
  );
}