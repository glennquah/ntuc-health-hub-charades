import CustomButton from '@/components/CustomButton'
import Header from '@/components/Header'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
const octo = '/octo.svg'

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
          <div className="flex flex-col justify-center items-center gap-8">
            <img
              src={octo}
              alt="Jamboree"
              width={200}
              height={200}
            />
            <CustomButton words={'Play Now'} route={'/game'} />
            <div className="text-md text-center text-gray-500 pb-4">
              View our champions at our
              <a
                href="/leaderboard"
                className="ml-2 text-blue-500 underline hover:text-blue-700 transition-colors"
              >
                Leaderboard
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
