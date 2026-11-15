import { GameScreen } from '@/components/GameScreen'
import { LanguageSelector } from '@/components/LanguageSelector'
import { TopicSelector } from '@/components/TopicSelector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { GameSettings, GameState, Language, Word } from '@/types/game'
import { useMutation, useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
const endIcon = '/endicon.svg'
const logo = '/icons.svg'

export default function Game() {
  const navigate = useNavigate()
  const [gameSettings, setGameSettings] = useState<Partial<GameSettings>>({
    languages: [],
    topic: '',
    timer: 60,
  })
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [step, setStep] = useState<'language' | 'topics' | 'game' | 'results'>(
    'language'
  )
  const [playerName, setPlayerName] = useState('')
  const [usedWordIds, setUsedWordIds] = useState<Array<string | number>>([])

  const handleTopicSelect = (topic: string) => {
    setGameSettings((prev) => ({ ...prev, topic }))
  }

  // Get words from supabase
  const { data: words, isLoading: wordsLoading, isError: wordsError } = useQuery({
    queryKey: ['words', gameSettings.topic],
    enabled: !!gameSettings.topic,
    queryFn: async () => {
      if (gameSettings.topic === 'Rojak') {
        const { data, error } = await supabase
          .from('words')
          .select('*, topics!inner(*)')
        if (error) throw error
        return data as Word[]
      } else {
        const { data, error } = await supabase
          .from('words')
          .select('*, topics!inner(*)')
          .eq('topics.name', gameSettings.topic)
        if (error) throw error
        return data as Word[]
      }
    },
  })

  // Submit score to supabase
  const submitScoreMutation = useMutation({
    mutationFn: async ({ name, score }: { name: string; score: number }) => {
      const { data, error } = await supabase
        .from('leaderboard')
        .insert([{ name, score, deck: gameSettings.topic }])
        .select()
      if (error) throw error
      return data
    },
    onError: () => toast({ title: 'Could not submit score', description: 'Please try again.', variant: 'destructive' }),
    onSuccess: () => {
      toast({
        title: 'Score submitted!',
        description: 'Your score has been added to the leaderboard.',
      })
      navigate('/leaderboard')
    },
  })

  // Toggle language
  const handleLanguageToggle = (language: Language) => {
    setGameSettings((prev) => ({
      ...prev,
      languages: prev.languages?.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...(prev.languages || []), language],
    }))
  }

  // Get random word from the available list
  const getAndStoreRandomWord = (): Word | null => {
    if (!words || words.length === 0) return null
    const availableWords = words.filter(
      (word) => !usedWordIds.includes(word.id)
    )
    if (availableWords.length === 0) return null
    const randomIndex = Math.floor(Math.random() * availableWords.length)
    const word = availableWords[randomIndex]
    setUsedWordIds((prev) => [...prev, word.id])
    return word
  }

  // Select the timer
  const handleTimerSelect = (timer: number) => {
    setGameSettings((prev) => ({ ...prev, timer }))
  }

  // Start the game
  const startGame = () => {
    // Clear out used words and set the first word
    if (!words?.length) return
    const firstWord = words[Math.floor(Math.random() * words.length)]
    setUsedWordIds([firstWord.id])
    setGameState({
      score: 0,
      currentWord: firstWord,
      timeLeft: gameSettings.timer || 60,
      isPlaying: true,
    })
  }

  // Called when user clicks "Continue" on the topics step
  const goToGame = () => {
    if (wordsLoading || !words?.length) {
      toast({ title: wordsError ? 'Unable to load words' : 'No words available', description: 'Wait for the deck to load or choose another deck.', variant: 'destructive' })
      return
    }
    startGame()
    setStep('game')
  }

  // If user guesses correctly
  const handleCorrect = () => {
    const newWord = getAndStoreRandomWord()
    if (newWord) {
      setGameState((prev) =>
        prev ? { ...prev, score: prev.score + 1, currentWord: newWord } : null
      )
    } else {
      // No more words
      setGameState((prev) =>
        prev ? { ...prev, score: prev.score + 1, currentWord: null } : null
      )
      setStep('results')
    }
  }

  // If user passes
  const handlePass = () => {
    const newWord = getAndStoreRandomWord()
    if (newWord) {
      setGameState((prev) => (prev ? { ...prev, currentWord: newWord } : null))
    } else {
      setGameState((prev) => (prev ? { ...prev, currentWord: null } : null))
      setStep('results')
    }
  }

  // Submit score
  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault()
    if (!gameState || !playerName.trim()) return
    submitScoreMutation.mutate({
      name: playerName.trim(),
      score: gameState.score,
    })
  }

  // Countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (step === 'game' && gameState?.isPlaying && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState((prev) =>
          prev ? { ...prev, timeLeft: Math.max(0, prev.timeLeft - 1) } : null
        )
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [step, gameState?.isPlaying, gameState?.timeLeft])

  return (
    <div>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          {step !== 'game' && (
            <div className="flex flex-col items-center justify-center py-8">
              <img
                src={logo}
                alt="Lai Lai Guess Guess!"
                width={400}
                height={200}
              />
            </div>
          )}

          {step === 'language' && (
            <LanguageSelector
              selectedLanguages={gameSettings.languages || []}
              onToggleLanguage={handleLanguageToggle}
              onNext={() => setStep('topics')}
            />
          )}

          {step === 'topics' && (
            <TopicSelector
              selectedTopic={gameSettings.topic || ''}
              selectedTime={gameSettings.timer || 0}
              onTimeSelect={handleTimerSelect}
              onTopicSelect={handleTopicSelect}
              onNext={goToGame}
            />
          )}

          {step === 'game' && gameState && gameState.currentWord && (
            <GameScreen
              word={gameState.currentWord}
              timeLeft={gameState.timeLeft}
              score={gameState.score}
              onCorrect={handleCorrect}
              onPass={handlePass}
              onTimeUp={() => setStep('results')}
              selectedLanguages={gameSettings.languages || []}
              totalTime={gameSettings.timer || 60}
            />
          )}

          {step === 'results' && gameState && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6"
            >
              <div className="flex flex-col items-center justify-center">
                <img
                  src={endIcon}
                  alt="Lai Lai Guess Guess!"
                  width={200}
                  height={200}
                />
              </div>
              <p className="text-3xl font-bold" style={{ color: '#40C0DF' }}>
                Game Over!
              </p>
              <p className="text-2xl">Your Score: {gameState.score}</p>

              <form onSubmit={handleSubmitScore} className="space-y-4">
                <Input
                  maxLength={80}
                  aria-label="Player name"
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="max-w-xs mx-auto py-6 px-4 rounded-2xl bg-transparent border-2 border-gray-500"
                />
                <div className="space-x-4 py-4">
                  <Button
                    type="submit"
                    disabled={
                      !playerName.trim() || submitScoreMutation.isPending
                    }
                    className={`
                      bg-yellow-500 text-white font-bold py-3 px-24 rounded-full text-lg shadow-md transition-opacity
                      ${
                        !playerName.trim() || submitScoreMutation.isPending
                          ? 'cursor-not-allowed opacity-50 opacity-50'
                          : 'hover:opacity-80'
                      }
                    `}
                  >
                    Submit Score
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
