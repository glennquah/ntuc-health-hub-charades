import { supabase } from '@/integrations/supabase/client'
import { Topic } from '@/types/game'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface TopicSelectorProps {
  selectedTopic: Topic | null
  onSelectTopic: (topic: Topic) => void
  onNext?: () => void
}

export function TopicSelector({
  selectedTopic,
  onSelectTopic,
  onNext,
}: TopicSelectorProps) {
  const { data: topics, isLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('topics')
        .select('id, name, description')
      if (error) throw error
      return data
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-coffee-dark" />
      </div>
    )
  }

  // Add the "Rojak" deck manually
  const allTopics = [
    ...topics,
    {
      id: 'rojak',
      name: 'Rojak',
      description: 'A mix of all decks for an ultimate charades experience!',
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-coffee-dark text-center">
        Select A Deck
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {allTopics.map((topic) => (
          <motion.div
            key={topic.id}
            className={`p-6 border-2 rounded-lg cursor-pointer space-y-2 shadow-lg transition-all ${
              selectedTopic === topic.name
                ? 'bg-blue-200 border-blue-500'
                : 'hover:bg-cream/50'
            }`}
            onClick={() => {
              onSelectTopic(topic.name)
              if (onNext) onNext()
            }}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-semibold text-center">{topic.name}</h3>
            <p className="text-gray-700 text-center">{topic.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
