import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'

interface TimerSelectorProps {
  selectedTime: number
  onSelect: (time: number) => void
  selectedTopic: string
}

const times = [60, 120, 180, 240]

export function TimerSelector({
  selectedTime,
  onSelect,
  selectedTopic,
}: TimerSelectorProps) {
  const { data: topicDetails, isLoading } = useQuery({
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
        <p className="text-gray-500">Loading topic details...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Topic Details */}
      <div className="text-center space-y-4 p-6 border-2 rounded-lg space-y-2 border border-gray-400 shadow-lg">
        <h3 className="text-2xl font-semibold text-coffee-dark">
          Deck Picked: {topicDetails?.name}
        </h3>

        {/* Description Section */}
        <div className="space-y-2">
          <h4 className="text-lg font-bold text-coffee-dark">Description</h4>
          <p className="text-black">{topicDetails?.description}</p>
        </div>

        {/* Instructions Section */}
        <div className="space-y-2">
          <h4 className="text-lg font-bold text-coffee-dark">Instructions</h4>
          <p className="text-black">{topicDetails?.instructions}</p>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-coffee-dark text-center">
        Select Timer
      </h2>

      <div className="flex flex-wrap justify-center gap-8 max-w-2xl mx-auto py-2">
        {times.map((time) => (
          <Button
            key={time}
            onClick={() => onSelect(time)}
            variant="outline"
            className={cn(
              'h-12 w-32 text-lg border-2',
              selectedTime === time && 'border-coffee bg-coffee/10'
            )}
          >
            {time / 60} min
          </Button>
        ))}
      </div>
    </div>
  )
}
