import { ReactNode } from 'react'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#E0F0F3]">
      <main className="flex flex-col flex-grow items-center justify-center w-full">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
