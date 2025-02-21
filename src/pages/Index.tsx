import CustomButton from '@/components/CustomButton'
import Header from '@/components/Header'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import octo from '../../public/octo.svg'

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
              alt="Lai Lai Guess Guess!"
              width={200}
              height={200}
            />
            <CustomButton words={'Play Now'} route={'/game'} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
