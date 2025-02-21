import React from 'react'
import { useNavigate } from 'react-router-dom'

interface CustomButtonProps {
  color?: string
  words: string
  route?: string
  onClick?: () => void
  disabled?: boolean
}

const CustomButton: React.FC<CustomButtonProps> = ({
  color = 'bg-yellow-500',
  words,
  route,
  onClick,
  disabled,
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (!disabled) {
      if (onClick) onClick()
      if (route) navigate(route)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={` ${color} text-white font-bold py-3 px-24 rounded-full text-lg shadow-md transition-opacity 
        ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:opacity-80'}`}
    >
      {words}
    </button>
  )
}

export default CustomButton
