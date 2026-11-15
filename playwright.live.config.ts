import { defineConfig } from '@playwright/test'
import { existsSync } from 'node:fs'
import { loadEnvFile } from 'node:process'

if (existsSync('.env.local')) loadEnvFile('.env.local')
if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Set your Supabase URL and public anon key in .env.local before capturing live screenshots.')
}

export default defineConfig({
  testDir: './tests/live',
  workers: 1,
  timeout: 120_000,
  use: { baseURL: 'http://127.0.0.1:8080', viewport: { width: 1440, height: 1000 } },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:8080',
  },
})
