import { supabase } from '@/integrations/supabase/client'
import { cn } from '@/lib/utils'
import { Topic } from '@/types/game'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import CustomButton from './CustomButton'
import { Button } from './ui/button'

interface TopicSelectorProps {
  selectedTopic: Topic | null
  onSelectTopic: (topic: Topic) => void
  selectedTime: number
  onSelect: (time: number) => void
  onNext?: () => void
}

const times = [60, 120, 180, 240]

export function TopicSelector({
  selectedTopic,
  onSelectTopic,
  selectedTime,
  onSelect,
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

  const { data: topicDetails } = useQuery({
    queryKey: ['topicDetails', selectedTopic],
    queryFn: async () => {
      if (selectedTopic === 'Rojak') {
        return {
          name: 'Rojak',
          description:
            'A mix of all decks for an ultimate charades experience!',
          instructions:
            'Act out or say simple clues to describe any word from all decks.',
        }
      }

      const { data, error } = await supabase
        .from('topics')
        .select('name, description, instructions')
        .eq('name', selectedTopic)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!selectedTopic,
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
    },
  ]

  return (
    <div className="space-y-6">
      <p
        className="text-2xl text-center mb-8 font-bold"
        style={{ color: '#40C0DF' }}
      >
        Select Timer
      </p>

      <div className="flex flex-wrap justify-center gap-8 max-w-2xl mx-auto py-2">
        {times.map((time) => (
          <Button
            key={time}
            onClick={() => onSelect(time)}
            variant="outline"
            className={cn('h-12 w-32 text-lg border-2', selectedTime === time)}
          >
            {time / 60} min
          </Button>
        ))}
      </div>

      <p
        className="text-2xl text-center mb-8 font-bold"
        style={{ color: '#40C0DF' }}
      >
        Select A Deck
      </p>
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
            }}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-semibold text-center">{topic.name}</h3>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <CustomButton
          words={'Continue'}
          onClick={onNext}
          disabled={!selectedTime || !selectedTopic}
        />
      </div>
    </div>
  )
}
