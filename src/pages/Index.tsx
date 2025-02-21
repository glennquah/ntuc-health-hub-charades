import Header from '@/components/Header'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Index() {
  const navigate = useNavigate()

  return (
    <div>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          {<Header />}
        </motion.div>
      </div>
    </div>
  )
}
