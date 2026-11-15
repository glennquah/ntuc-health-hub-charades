import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const isConfigured = Boolean(url && key)

// Placeholders allow the setup screen to render without contacting a database.
export const supabase = createClient<Database>(
  url || 'https://example.supabase.co',
  key || 'setup-required',
)
