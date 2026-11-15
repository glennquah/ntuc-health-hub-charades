import { test, expect } from '@playwright/test'

const topic = { id: 1, name: 'Everyday Life', description: 'Familiar activities to act out together.', instructions: 'Act out the prompt without saying the word.' }
const words = ['Drinking tea', 'Taking a walk', 'Cooking rice'].map((word, index) => ({
  id: index + 1, topic_id: 1, created_at: '2025-01-01T00:00:00Z', topics: topic,
  translations: { English: word, Chinese: ['喝茶', '散步', '煮饭'][index] },
}))

test('play a full round with sample data', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  // All database traffic is intercepted: screenshots never use participant data.
  await page.route('http://127.0.0.1:54321/**', async route => {
    const url = new URL(route.request().url())
    const data = url.pathname.endsWith('/topics')
      ? (route.request().headers().accept?.includes('object') ? topic : [{ ...topic, words }])
      : url.pathname.endsWith('/words') ? words : []
    await route.fulfill({ json: data })
  })
  const screenshot = async (name: string) => {
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1000)
    if (testInfo.project.name === 'desktop') await page.screenshot({ path: testInfo.outputPath(`${name}.png`), fullPage: true })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Play Now' })).toBeVisible()
  await screenshot('home')
  await page.getByRole('button', { name: 'Play Now' }).click()
  await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled()
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await page.getByRole('button', { name: 'Chinese', exact: true }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Everyday Life' }).click()
  await screenshot('setup')
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByText('Score: 0', { exact: true })).toBeVisible()
  await screenshot('game')
  await page.getByRole('button', { name: 'Correct', exact: true }).click()
  await expect(page.getByText('Score: 1', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Skip', exact: true }).click()
  await page.waitForTimeout(900)
  await page.getByRole('button', { name: 'Correct', exact: true }).click()
  await expect(page.getByText('Your Score: 2')).toBeVisible()
  await screenshot('results')
  await page.goto('/admin')
  await expect(page.getByRole('heading', { name: 'Admin Panel' })).toBeVisible()
  await expect(page.getByRole('button', { name: /delete/i })).toHaveCount(0)
  await page.getByRole('button', { name: 'Show Words', exact: true }).click()
  await expect(page.getByRole('button', { name: /delete/i })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Edit word 1', exact: true })).toBeVisible()
  expect(errors).toEqual([])
})
