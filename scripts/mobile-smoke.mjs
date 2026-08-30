import { chromium } from 'playwright'

const base = process.env.BASE_URL || 'http://127.0.0.1:3000'
const routes = ['/', '/opportunities', '/market', '/signin', '/onboarding', '/support', '/qa', '/subscribe', '/about', '/purpose', '/trust', '/trust/data-sources', '/trust/data-accuracy', '/trust/translation', '/legal/terms', '/legal/privacy', '/legal/disclaimer', '/legal/third-party', '/procurement-guide']

function ok(condition, message) { if (!condition) throw new Error(message) }

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
const page = await context.newPage()
page.on('pageerror', err => console.error('PAGE ERROR:', err.message))

try {
  await page.addInitScript(() => {
    localStorage.setItem('borneo-public-tour-v2', 'done')
    localStorage.setItem('borneo-member-tour-v2', 'done')
    localStorage.setItem('borneo-lang', 'zh')
  })

  for (const route of routes) {
    const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' })
    ok(response && response.status() < 500, `${route} returned ${response?.status()}`)
    ok(await page.locator('body').innerText(), `${route} rendered an empty body`)
    console.log('PASS route', route)
  }

  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  const hamburger = page.locator('.hamburger:visible').first()
  const menu = page.locator('.mobile-menu:visible').first()
  await hamburger.click()
  ok(await menu.evaluate(el => el.classList.contains('open')), 'Hamburger menu did not open')
  await menu.locator('.language-toggle').click()
  const languageOptions = menu.locator('.language-options')
  ok((await languageOptions.boundingBox())?.height > 1, 'Language submenu did not expand')
  await menu.getByRole('button', { name: /简体中文/ }).click()
  ok(((await languageOptions.boundingBox())?.height || 0) <= 1, 'Collapsed language submenu still reserves visible space')
  await hamburger.click()
  ok(!(await menu.evaluate(el => el.classList.contains('open'))), 'Hamburger menu did not close')
  console.log('PASS mobile hamburger + language collapse')

  await page.goto(`${base}/signin`, { waitUntil: 'networkidle' })
  ok((await page.locator('h1').innerText()).includes('登录'), 'Sign-in page did not follow Chinese language setting')
  await page.getByPlaceholder('工作邮箱').fill('mobile-smoke@example.invalid')
  await page.getByPlaceholder('密码').fill('invalid-password')
  await page.getByRole('button', { name: '登录' }).click()
  await page.waitForTimeout(700)
  ok(await page.locator('.form-message').count(), 'Invalid sign-in did not show feedback')
  console.log('PASS sign-in interaction')

  await page.goto(`${base}/onboarding`, { waitUntil: 'networkidle' })
  ok((await page.locator('h1').innerText()).includes('公司'), 'Join page did not follow Chinese language setting')
  const choices = page.locator('.choice')
  ok(await choices.count(), 'Join page has no selectable options')
  await choices.first().click()
  ok(await choices.first().evaluate(el => el.classList.contains('selected')), 'Join page option did not toggle')
  console.log('PASS join interaction without creating an account')

  await page.goto(`${base}/qa`, { waitUntil: 'networkidle' })
  const qa = page.locator('.qa-item').first()
  await qa.locator('summary').click()
  ok(await qa.evaluate(el => el.hasAttribute('open')), 'Q&A item did not expand')
  await qa.locator('summary').click()
  ok(!(await qa.evaluate(el => el.hasAttribute('open'))), 'Q&A item did not collapse')
  console.log('PASS Q&A expand/collapse')

  await page.goto(`${base}/support`, { waitUntil: 'networkidle' })
  await page.locator('select').first().selectOption('bug')
  await page.getByPlaceholder('简短说明问题').fill('mobile smoke test')
  await page.getByPlaceholder('发生了什么？你原本预期应该怎样？').fill('interaction test only; form intentionally not submitted')
  console.log('PASS support form interaction without submission')

  await page.goto(`${base}/opportunities`, { waitUntil: 'networkidle' })
  const firstOpportunity = page.locator('.op-main a[href^="/opportunities/"]').first()
  ok(await firstOpportunity.count(), 'No opportunity row available to open')
  const href = await firstOpportunity.getAttribute('href')
  ok(href && /^\/opportunities\/[^/]+$/.test(href), `Invalid opportunity href: ${href}`)
  const response = await page.goto(`${base}${href}`, { waitUntil: 'networkidle' })
  ok(response && response.status() < 500, `Opportunity detail returned ${response?.status()}`)
  ok(page.url().includes('/opportunities/'), 'Opportunity detail route did not load')
  const info = page.locator('.context-info-button:visible').first()
  if (await info.count()) {
    await info.click()
    const drawer=page.locator('.context-info-drawer.open').first()
    ok(await drawer.count(), 'Information drawer did not open')
    await drawer.locator('.context-drawer-close').click()
    ok(!(await drawer.evaluate(el => el.classList.contains('open'))), 'Information drawer did not close')
  }
  const disclosure = page.locator('.detail-disclosure:visible').first()
  if (await disclosure.count()) {
    await disclosure.locator('summary').click()
    ok(await disclosure.evaluate(el => el.hasAttribute('open')), 'Tender disclosure did not expand')
    await disclosure.locator('summary').click()
    ok(!(await disclosure.evaluate(el => el.hasAttribute('open'))), 'Tender disclosure did not collapse')
  }
  console.log('PASS opportunity detail interactions')

  for (const route of ['/dashboard', '/pipeline', '/network', '/profile', '/guide']) {
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    ok(page.url().includes('/signin'), `${route} did not protect unauthenticated access`)
    console.log('PASS protected redirect', route)
  }

  console.log('MOBILE SMOKE PASS')
} finally {
  await browser.close()
}
