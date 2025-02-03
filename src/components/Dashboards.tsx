/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/integrations/supabase/client'
import { useQuery } from '@tanstack/react-query'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function Dashboards() {
  // Query: Get games played over the past few days
  const { data: gamesPlayedData, isLoading: gamesLoading } = useQuery({
    queryKey: ['gamesPlayed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('created_at')
      if (error) throw error

      // Group by date and count games played
      const gamesByDate = data.reduce((acc: Record<string, number>, game) => {
        const date = new Date(game.created_at).toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {})

      return Object.entries(gamesByDate).map(([date, count]) => ({
        date,
        count,
      }))
    },
  })

  // Query: Get total games played
  const { data: totalGamesData, isLoading: totalGamesLoading } = useQuery({
    queryKey: ['totalGames'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('leaderboard')
        .select('*', { count: 'exact' })
      if (error) throw error
      return count
    },
  })

  // Query: Get game scores with count of occurrences
  const { data: scoresData, isLoading: scoresLoading } = useQuery({
    queryKey: ['gameScores'],
    queryFn: async () => {
      const { data, error } = await supabase.from('leaderboard').select('score')
      if (error) throw error

      // Group by score and count occurrences
      const scoresCount = data.reduce((acc: Record<number, number>, entry) => {
        acc[entry.score] = (acc[entry.score] || 0) + 1
        return acc
      }, {})

      return Object.entries(scoresCount).map(([score, count]) => ({
        score: Number(score),
        count,
      }))
    },
  })

  // Query: Get attempts per topic from the leaderboard's `deck` field
  const { data: topicAttemptsData, isLoading: topicAttemptsLoading } = useQuery(
    {
      queryKey: ['topicAttempts'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('leaderboard')
          .select('deck')
        if (error) throw error

        // Group by deck and count attempts
        const attemptsByDeck = data.reduce(
          (acc: Record<string, number>, entry) => {
            acc[entry.deck] = (acc[entry.deck] || 0) + 1
            return acc
          },
          {}
        )

        return Object.entries(attemptsByDeck).map(([name, attempts]) => ({
          name,
          attempts,
        }))
      },
    }
  )

  if (
    gamesLoading ||
    scoresLoading ||
    topicAttemptsLoading ||
    totalGamesLoading
  ) {
    return <p>Loading dashboards...</p>
  }

  // Prepare data for charts
  const gamesPlayedChartData = {
    labels: gamesPlayedData?.map((item: any) => item.date),
    datasets: [
      {
        label: 'Games Played',
        data: gamesPlayedData?.map((item: any) => item.count),
        backgroundColor: '#4CAF50',
      },
    ],
  }

  const scoresChartData = {
    labels: scoresData?.map((item: any) => `Score ${item.score}`),
    datasets: [
      {
        label: 'Score Count',
        data: scoresData?.map((item: any) => item.count),
        backgroundColor: '#FF9800',
      },
    ],
  }

  const topicAttemptsChartData = {
    labels: topicAttemptsData?.map((item: any) => item.name),
    datasets: [
      {
        label: 'Attempts',
        data: topicAttemptsData?.map((item: any) => item.attempts),
        backgroundColor: '#2196F3',
      },
    ],
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
      {/* Total Games Played */}
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <h3 className="text-xl font-semibold mb-4">Total Games Played</h3>
        <p className="text-9xl font-bold text-green-600 items-center">
          {totalGamesData}
        </p>
      </div>

      {/* Games Played Over Time Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Games Played Over Time
        </h3>
        <Bar data={gamesPlayedChartData} />
      </div>

      {/* Scores Distribution Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Scores Distribution
        </h3>
        <Bar data={scoresChartData} />
      </div>

      {/* Topic Attempts Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Topic Attempts
        </h3>
        <Bar data={topicAttemptsChartData} />
      </div>
    </div>
  )
}
