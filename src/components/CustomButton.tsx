import React from 'react'
import { useNavigate } from 'react-router-dom'

interface CustomButtonProps {
  color?: string
  words: string
  route?: string
  onClick?: () => void
  disabled?: boolean
  stretch?: boolean
}

const CustomButton: React.FC<CustomButtonProps> = ({
  color = 'bg-yellow-500',
  words,
  route,
  onClick,
  disabled,
  stretch = false,
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (!disabled) {
      if (onClick) onClick()
      if (route) navigate(route)
    }
  }

  const stretchStyle = stretch && 'w-full py-4'

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={` ${color} ${stretchStyle} text-white font-bold py-3 px-12 sm:px-24 rounded-full text-lg shadow-md transition-opacity
        ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:opacity-80'}`}
    >
      {words}
    </button>
  )
}

export default CustomButton
