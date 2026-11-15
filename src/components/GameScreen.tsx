import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import CustomButton from './CustomButton'

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
  const actionPending = useRef(false)
  const actionTimer = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => () => clearTimeout(actionTimer.current), [])
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false)
  const [showPassAnimation, setShowPassAnimation] = useState(false)

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp()
    }
  }, [timeLeft, onTimeUp])

  const handleCorrect = () => {
    if (actionPending.current || timeLeft <= 0) return
    actionPending.current = true
    setShowCorrectAnimation(true)
    actionTimer.current = setTimeout(() => {
      setShowCorrectAnimation(false)
      actionPending.current = false
      onCorrect()
    }, 800)
  }

  const handlePass = () => {
    if (actionPending.current || timeLeft <= 0) return
    actionPending.current = true
    setShowPassAnimation(true)
    actionTimer.current = setTimeout(() => {
      setShowPassAnimation(false)
      actionPending.current = false
      onPass()
    }, 800)
  }

  return (
    <div className="flex items-center justify-center">
      <div className="space-y-8 text-center max-w-4xl w-full px-4">
        <div className="w-full h-4 bg-gray-300 rounded-full mb-4">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${(timeLeft / totalTime) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold" style={{ color: 'red' }}>
            {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-3xl font-bold" style={{ color: '#40C0DF' }}>
            Score: {score}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={Object.values(word.translations).join('-')}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex justify-center items-center w-full bg-white rounded-xl"
          >
            <div
              className="
            w-full min-w-0
            min-h-[18rem] md:min-h-[20rem] lg:min-h-[22rem]
            flex flex-col justify-center items-center text-center"
            >
              {selectedLanguages.map(
                (lang) =>
                  word.translations[lang] && (
                    <div
                      key={lang}
                      className="
                text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl 
                font-bold w-full break-words px-6 py-4"
                    >
                      {word.translations[lang]}
                    </div>
                  )
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4 w-full max-w-[900px]">
          <CustomButton
            words="Correct"
            onClick={handleCorrect}
            stretch={true}
            color="bg-green-500"
          />
          <CustomButton
            words="Skip"
            onClick={handlePass}
            stretch={true}
            color="bg-red-500"
          />
        </div>

        <AnimatePresence>
          {showCorrectAnimation && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none"
            >
              <Check className="w-48 h-48 text-green-500" />
            </motion.div>
          )}
          {showPassAnimation && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none"
            >
              <X className="w-48 h-48 text-red-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
