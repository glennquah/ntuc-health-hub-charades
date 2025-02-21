import { supabase } from '@/integrations/supabase/client'
import { Topic } from '@/types/game'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import CustomButton from './CustomButton'
import { TimerSlider } from './TimerSlider'

interface TopicSelectorProps {
  selectedTopic: Topic | null
  selectedTime: number
  onTimeSelect: (time: number) => void
  onTopicSelect: (topic: Topic) => void
  onNext?: () => void
}

const times = [60, 120, 180, 240]

export function TopicSelector({
  selectedTopic,
  selectedTime,
  onTimeSelect,
  onTopicSelect,
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

  // Not strictly necessary, but in case you need topic details:
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

      <TimerSlider selectedTime={selectedTime} onTimeSelect={onTimeSelect} />

      <p
        className="text-2xl text-center mb-8 font-bold"
        style={{ color: '#40C0DF' }}
      >
        Select A Deck
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {allTopics.map((topic) => (
          <motion.div
            key={topic.id}
            onClick={() => onTopicSelect(topic.name)}
            whileHover={{ scale: 1.02 }}
            className={`px-8 py-3 rounded-full cursor-pointer text-center transition-all ${
              selectedTopic === topic.name
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-white text-red-500'
            }`}
          >
            <p className="text-lg font-semibold">{topic.name}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <CustomButton
          words="Continue"
          onClick={onNext}
          disabled={!selectedTime || !selectedTopic}
        />
      </div>
    </div>
  )
}
