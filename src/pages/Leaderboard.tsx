import { supabase } from '@/integrations/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Loader2, Medal, Star, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../../public/JamboreeIcon.svg'

export default function Leaderboard() {
  // Fetch overall leaderboard data
  const { data: overallScores, isLoading: isLoadingOverall } = useQuery({
    queryKey: ['leaderboard', 'overall'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(10)
      if (error) throw error
      return data
    },
  })

  // Fetch deck-specific leaderboard data
  const { data: deckScores, isLoading: isLoadingDecks } = useQuery({
    queryKey: ['leaderboard', 'byDeck'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
      if (error) throw error
      return data
    },
  })

  if (isLoadingOverall || isLoadingDecks) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-coffee-dark" />
      </div>
    )
  }

  // Group scores by deck name
  const scoresByDeck = deckScores?.reduce(
    (acc, score) => {
      if (!acc[score.deck]) {
        acc[score.deck] = []
      }
      acc[score.deck].push(score)
      return acc
    },
    {} as Record<string, typeof deckScores>
  )

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 2:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <Star className="w-6 h-6 text-coffee-light" />
    }
  }

  const renderLeaderboardSection = (scores, title) => (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-coffee-dark text-center mb-6">
        {title}
      </h2>
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        {scores?.map((score, index) => (
          <motion.div
            key={score.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-6 ${
              index !== scores.length - 1 ? 'border-b border-gray-100' : ''
            } hover:bg-gray-50 transition-colors`}
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cream">
                {getRankIcon(index)}
              </div>
              <div>
                <h3 className="font-bold text-xl text-coffee-dark">
                  {score.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(score.created_at), 'MMM d, yyyy')}
                </p>
                <p className="text-sm text-coffee-medium">Deck: {score.deck}</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-coffee-dark">
              {score.score}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Overall Leaderboard */}
        <div className="text-center mb-6">
          <div className="flex flex-col items-center justify-center py-4">
            <Link to="/">
              <img
                src={logo}
                alt="Lai Lai Guess Guess!"
                width={250}
                height={250}
                className="cursor-pointer"
              />
            </Link>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-coffee-dark mb-4 flex items-center justify-center gap-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-coffee-medium text-lg">
            Top 10 Overall Players for Kampong Klash
          </p>
        </div>
        <hr className="border-t border-gray-400 py-2" />

        {renderLeaderboardSection(overallScores, 'Overall Leaderboard')}

        {/* Deck-Specific Leaderboards */}
        {scoresByDeck &&
          Object.entries(scoresByDeck).map(([deck, scores]) => (
            <div key={deck}>
              {renderLeaderboardSection(scores, `${deck} Deck Leaderboard`)}
            </div>
          ))}
      </div>
    </div>
  )
}
