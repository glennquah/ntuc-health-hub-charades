import { Toaster as Sonner } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Admin from './pages/Admin'
import { isConfigured } from './integrations/supabase/client'
import Game from './pages/Game'
import Index from './pages/Index'
import Leaderboard from './pages/Leaderboard'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient()

const App = () => !isConfigured ? (
  <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
    <h1 className="text-3xl font-bold">Set up Jamboree</h1>
    <p>Copy .env.example to .env.local and add your Supabase URL and public anon key.</p>
    <p>See the README for database setup, then restart the development server.</p>
  </main>
) : (
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
