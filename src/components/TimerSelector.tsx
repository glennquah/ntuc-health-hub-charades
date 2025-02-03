import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TimerSelectorProps {
  selectedTime: number
  onSelect: (time: number) => void
}

const times = [60, 120, 180, 240]

export function TimerSelector({ selectedTime, onSelect }: TimerSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-coffee-dark text-center">
        Select Timer
      </h2>
      <div className="flex flex-wrap justify-center gap-8 max-w-2xl mx-auto py-8">
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
