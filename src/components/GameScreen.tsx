import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface GameScreenProps {
  word: {
    translations: Record<string, string>
  }
  timeLeft: number
  score: number
  onCorrect: () => void
  onPass: () => void
  onTimeUp: () => void
  selectedLanguages: string[]
  totalTime: number
}

export function GameScreen({
  word,
  timeLeft,
  score,
  onCorrect,
  onPass,
  onTimeUp,
  selectedLanguages,
  totalTime,
}: GameScreenProps) {
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false)
  const [showPassAnimation, setShowPassAnimation] = useState(false)

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp()
    }
  }, [timeLeft, onTimeUp])

  const handleCorrect = () => {
    setShowCorrectAnimation(true)
    setTimeout(() => {
      setShowCorrectAnimation(false)
      onCorrect()
    }, 800)
  }

  const handlePass = () => {
    setShowPassAnimation(true)
    setTimeout(() => {
      setShowPassAnimation(false)
      onPass()
    }, 800)
  }

  return (
    <div className="flex items-center justify-center">
      <div className="space-y-8 text-center max-w-3xl w-full px-4">
        <div className="w-full h-4 bg-gray-300 rounded-full mb-4">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${(timeLeft / totalTime) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold">
            {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-3xl font-bold">Score: {score}</div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={Object.values(word.translations).join('-')}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="space-y-4 pb-8"
          >
            <div className="space-y-4">
              {selectedLanguages.map(
                (lang) =>
                  word.translations[lang] && (
                    <div key={lang} className="text-5xl font-bold">
                      {word.translations[lang]}
                    </div>
                  )
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between gap-4">
          <Button
            onClick={handleCorrect}
            className="h-14 w-48 text-lg bg-green-600 hover:bg-green-700  border-2"
          >
            Correct
            <Check className="ml-2" />
          </Button>
          <Button
            onClick={handlePass}
            className="h-14 w-48 text-lg text-white bg-red-600 hover:bg-red-700 border-2"
          >
            Skip
            <X className="ml-2" />
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
  )
}
