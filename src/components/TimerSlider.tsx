// TimerSlider.tsx
import React from 'react'

interface TimerSliderProps {
  // The currently selected time in seconds (e.g. 60, 120, etc.)
  selectedTime: number
  // A callback to update the time in the parent
  onTimeSelect: (timeInSeconds: number) => void
}

// Maps slider positions (1..4) to seconds
const sliderMap = {
  1: 60,
  2: 120,
  3: 180,
  4: 240,
}

export function TimerSlider({ selectedTime, onTimeSelect }: TimerSliderProps) {
  // Figure out which slider position matches the passed-in `selectedTime`
  // If none matches, default to "1" (i.e. 60s)
  const currentSliderValue =
    Object.keys(sliderMap).find(
      (key) =>
        sliderMap[key as unknown as keyof typeof sliderMap] === selectedTime
    ) ?? '1'

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSliderValue = Number(e.target.value) // 1..4
    const newTime = sliderMap[newSliderValue as keyof typeof sliderMap] // 60..240
    onTimeSelect(newTime)
  }

  return (
    <div className="flex flex-col items-center space-y-4 max-w-md mx-auto p-4">
      {/* The slider itself */}
      <input
        aria-label="Round duration in minutes"
        type="range"
        min="1"
        max="4"
        step="1"
        value={currentSliderValue}
        onChange={handleSliderChange}
        className="
          timer-range
          w-full
          accent-blue-500
          cursor-pointer
          appearance-none
          h-1
          rounded-full
          outline-none
          ring-0
          focus:ring-0
          py-4
        "
      />

      {/* The minute markers */}
      <div className="flex w-full justify-between text-lg text-black">
        <span>1m</span>
        <span>2m</span>
        <span>3m</span>
        <span>4m</span>
      </div>
    </div>
  )
}
