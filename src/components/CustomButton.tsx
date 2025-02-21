import React from 'react'
import { useNavigate } from 'react-router-dom'

interface CustomButtonProps {
  color?: string
  words: string
  route?: string
  onClick?: () => void
}

const CustomButton: React.FC<CustomButtonProps> = ({
  color = 'bg-yellow-500',
  words,
  route,
  onClick,
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) onClick()
    if (route) navigate(route)
  }

  return (
    <button
      onClick={handleClick}
      className={` ${color} text-white font-bold py-3 px-24 rounded-full text-lg shadow-md hover:opacity-80 transition-opacity`}
    >
      {words}
    </button>
  )
}

export default CustomButton
