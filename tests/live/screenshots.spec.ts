import { test, expect } from '@playwright/test'

test('capture Jamboree and its public word-management portal', async ({ page }) => {
  const databaseUrl = process.env.VITE_SUPABASE_URL!
  // Permit real reads, block all writes. Never fetch participant records.
  await page.route(`${databaseUrl}/**`, async route => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(route.request().method()) ||
      new URL(route.request().url()).pathname.includes('/leaderboard')) {
      await route.abort('blockedbyclient')
      return
    }
    await route.continue()
  })
  const response = await page.request.get(`${databaseUrl}/rest/v1/topics?select=id,name,words(id)&order=id`, {
    headers: { apikey: process.env.VITE_SUPABASE_ANON_KEY! },
  })
  expect(response.ok(), `Database is unavailable (HTTP ${response.status()})`).toBeTruthy()
  const topics = await response.json() as { id: number; name: string; words: { id: number }[] }[]
  const topic = topics.find(item => item.words.length > 0)
  expect(topic, 'At least one deck with words is needed for screenshots').toBeTruthy()
  const capture = async (name: string, fullPage = true) => {
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1000)
    await page.screenshot({ path: `docs/screenshots/${name}.png`, fullPage })
  }
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Play Now' })).toBeVisible()
  await capture('home')
  await page.getByRole('button', { name: 'Play Now' }).click()
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await page.getByRole('button', { name: 'Chinese', exact: true }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: topic!.name, exact: true }).click()
  await capture('setup')
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByRole('button', { name: 'Correct', exact: true })).toBeVisible()
  await capture('game')
  // Let the real round finish without submitting a score.
  await expect(page.getByText('Game Over!', { exact: true })).toBeVisible({ timeout: 70_000 })
  await capture('results')
  await page.goto('/admin')
  await expect(page.getByRole('heading', { name: 'Admin Panel' })).toBeVisible()
  await capture('admin')
  const deck = page.locator('div.bg-white').filter({ has: page.getByRole('heading', { name: topic!.name, exact: true }) }).first()
  await deck.getByRole('button', { name: 'Show Words', exact: true }).click()
  await deck.evaluate(element => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY + 180))
  await capture('admin-words', false)
  await page.getByRole('button', { name: `Edit word ${topic!.words[0].id}`, exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Edit Word', exact: true })).toBeVisible()
  await capture('admin-edit-word', false)
  await page.getByRole('button', { name: 'Cancel', exact: true }).click()
  await page.getByRole('button', { name: `Edit deck ${topic!.name}`, exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Edit Topic / Decks' })).toBeVisible()
  await capture('admin-edit-deck', false)
})
