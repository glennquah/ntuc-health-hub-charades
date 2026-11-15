import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import Admin from '@/pages/Admin'

export default function AdminAccess() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])
  if (loading) return <p>Checking session…</p>
  if (session?.user.app_metadata.role === 'admin') return <>
    <button className="underline p-4" onClick={() => supabase.auth.signOut()}>Sign out</button>
    <Admin />
  </>
  if (session) return <div className="p-8 text-center"><p>This account does not have administrator access.</p>
    <button className="underline" onClick={() => supabase.auth.signOut()}>Sign out</button></div>
  return <form className="flex flex-col gap-4 p-8" onSubmit={async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get('email')), password: String(form.get('password')),
    })
    setError(error?.message || '')
  }}>
    <h1 className="text-2xl font-bold">Administrator sign in</h1>
    <label>Email <input className="border p-2" name="email" type="email" autoComplete="username" required /></label>
    <label>Password <input className="border p-2" name="password" type="password" autoComplete="current-password" required /></label>
    <button type="submit" className="bg-yellow-500 rounded-full p-3">Sign in</button>
    {error && <p role="alert">{error}</p>}
  </form>
}
