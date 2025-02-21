import { Toaster as Sonner } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Admin from './pages/Admin'
import Game from './pages/Game'
import Index from './pages/Index'
import Leaderboard from './pages/Leaderboard'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/game" element={<Game />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
