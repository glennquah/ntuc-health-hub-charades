import { GameScreen } from '@/components/GameScreen'
import Header from '@/components/Header'
import { LanguageSelector } from '@/components/LanguageSelector'
import { TimerSelector } from '@/components/TimerSelector'
import { TopicSelector } from '@/components/TopicSelector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { GameSettings, GameState, Language, Topic, Word } from '@/types/game'
import { useMutation, useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Index() {
  const navigate = useNavigate()
  const [gameSettings, setGameSettings] = useState<Partial<GameSettings>>({
    languages: [],
    topic: '',
  })
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [step, setStep] = useState<
    'language' | 'topics' | 'timer' | 'game' | 'results'
  >('language')
  const [playerName, setPlayerName] = useState('')
  const [usedWordIds, setUsedWordIds] = useState<Array<string | number>>([])

  const { data: words } = useQuery({
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

  const submitScoreMutation = useMutation({
    mutationFn: async ({ name, score }: { name: string; score: number }) => {
      const { data, error } = await supabase
        .from('leaderboard')
        .insert([{ name, score, deck: gameSettings.topic }])
        .select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast({
        title: 'Score submitted!',
        description: 'Your score has been added to the leaderboard.',
      })
      navigate('/leaderboard')
    },
  })

  const handleLanguageToggle = (language: Language) => {
    setGameSettings((prev) => ({
      ...prev,
      languages: prev.languages?.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...(prev.languages || []), language],
    }))
  }

  const handleTopicSelect = (topic: Topic) => {
    setGameSettings((prev) => ({ ...prev, topic }))
  }

  // This function picks a random word from the available ones and updates the used list.
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

  const handleTimerSelect = (timer: number) => {
    setGameSettings((prev) => ({ ...prev, timer }))
    setUsedWordIds([]) // Reset used words for new game
    const firstWord = getAndStoreRandomWord()
    setStep('game')
    setGameState({
      score: 0,
      currentWord: firstWord,
      timeLeft: timer,
      isPlaying: true,
    })
  }

  const startGame = () => {
    setUsedWordIds([])
    const firstWord = getAndStoreRandomWord()
    setGameState({
      score: 0,
      currentWord: firstWord,
      timeLeft: gameSettings.timer || 60,
      isPlaying: true,
    })
  }

  const handleCorrect = () => {
    const newWord = getAndStoreRandomWord()
    if (newWord) {
      setGameState((prev) =>
        prev ? { ...prev, score: prev.score + 1, currentWord: newWord } : null
      )
    } else {
      setGameState((prev) =>
        prev ? { ...prev, score: prev.score + 1, currentWord: null } : null
      )
      setStep('results')
    }
  }

  const handlePass = () => {
    const newWord = getAndStoreRandomWord()
    if (newWord) {
      setGameState((prev) => (prev ? { ...prev, currentWord: newWord } : null))
    } else {
      setGameState((prev) => (prev ? { ...prev, currentWord: null } : null))
      setStep('results')
    }
  }

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault()
    if (!gameState || !playerName.trim()) return
    submitScoreMutation.mutate({
      name: playerName,
      score: gameState.score,
    })
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameState?.isPlaying && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState((prev) =>
          prev ? { ...prev, timeLeft: prev.timeLeft - 1 } : null
        )
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameState?.isPlaying, gameState?.timeLeft])

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          {step !== 'game' && <Header />}

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
              onSelectTopic={handleTopicSelect}
              onNext={() => setStep('timer')}
            />
          )}

          {step === 'timer' && (
            <TimerSelector
              selectedTime={gameSettings.timer || 60}
              onSelect={handleTimerSelect}
              selectedTopic={gameSettings.topic || ''}
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
              <h2 className="text-3xl font-bold text-coffee-dark">
                Game Over!
              </h2>
              <p className="text-2xl">Your Score: {gameState.score}</p>

              <form onSubmit={handleSubmitScore} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="max-w-xs mx-auto py-6 px-4"
                />
                <div className="space-x-4 py-4">
                  <Button
                    type="submit"
                    disabled={
                      !playerName.trim() || submitScoreMutation.isPending
                    }
                    className="text-lg px-12 py-4"
                    variant="outline"
                  >
                    Submit Score
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      </main>
      <p className="text-md text-center text-gray-500 pb-4">
        © 2025 Glenn Quah
      </p>
    </div>
  )
}
