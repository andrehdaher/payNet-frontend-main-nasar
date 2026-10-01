const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createRequire } = require('node:module');

const backendDir = process.env.PAYNET_BACKEND_DIR || path.resolve(__dirname, '../../payNet-main');
const backendRequire = createRequire(path.join(backendDir, 'package.json'));
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const appUrl = process.env.PAYNET_APP_URL || 'http://127.0.0.1:3001';
const staticBuild = process.env.ALRAGHEB_VERIFY_STATIC === 'true' ? path.resolve(__dirname, '../build') : null;
const artifactDir = path.join(os.tmpdir(), 'paynet-alragheb-verification');

(async () => {
  // Only the provider token is used from .env. Authentication and users are isolated test data.
  const env = backendRequire('dotenv').parse(fs.readFileSync(path.join(backendDir, '.env')));
  process.env.ALRAGHEB_API_TOKEN = env.ALRAGHEB_API_TOKEN;
  process.env.ALRAGHEB_CATALOG_ENABLED = 'true';
  process.env.JWT_SECRET = 'isolated-alragheb-browser-verification';
  delete process.env.REDIS_URL;
  const catalog = backendRequire('./services/alraghebCatalog.service');
  const snapshot = await catalog.getCatalog();
  catalog.getCatalog = async () => snapshot;
  const provider = backendRequire('./services/alraghebApi');
  provider.getProfile = async () => ({ balance: '100', email: 'catalog-test@example.invalid' });
  const User = backendRequire('./models/User');
  const mongoose = backendRequire('mongoose');
  const purchaseMode = process.env.ALRAGHEB_VERIFY_PURCHASE === 'true';
  const dbName = `alragheb_ui_${require('crypto').randomUUID().replaceAll('-', '').slice(0, 20)}`;
  let testUser;
  let providerOrders = 0;
  let providerOutcome = 'accept';
  if (purchaseMode) {
    assert.ok(process.env.ALRAGHEB_TEST_MONGO_URI, 'Explicit isolated-test database connection required');
    process.env.ALRAGHEB_PURCHASE_ENABLED = 'true';
    process.env.ALRAGHEB_ROUNDING_POLICY = 'syp_2dp';
    await mongoose.connect(process.env.ALRAGHEB_TEST_MONGO_URI, { dbName });
    assert.equal(mongoose.connection.name, dbName);
    for (const file of ['User', 'Payment', 'AlraghebProductConfig', 'AlraghebPriceQuote', 'AlraghebTransaction', 'AlraghebConfigAudit', 'AlraghebPricingBatch', 'DailyStats']) await backendRequire(`./models/${file}`).init();
    testUser = await User.create({ email: 'browser-test@example.invalid', role: 'admin', balance: 10000 });
    provider.getProduct = async (id) => {
      const p = snapshot.products.find((p) => p.id === id);
      const r = p.quantity_rules;
      return { id: p.id, name: p.name, parent_id: p.category_id, category_name: p.category_name, available: p.available,
        product_type: p.product_type, params: p.params, price: p.provider_price, qty_values: r.mode === 'choices' ? r.values : r.mode === 'fixed' && r.defaultQty === 1 ? null : { min: r.min, max: r.max } };
    };
    provider.newOrder = async () => { providerOrders += 1; return { status: 'OK', data: { order_id: `isolated-${providerOrders}`, status: providerOutcome, replay_api: ['SIMULATED DELIVERY'], price: '313' } }; };
    provider.checkOrder = async () => ({ status: 'OK', data: [] });
  } else {
    User.findById = () => ({ select: () => ({ lean: async () => ({ role: 'admin', card: { cardapplication: true } }) }) });
  }

  const express = backendRequire('express');
  const api = express();
  api.use(express.json());
  let catalogFailure = false;
  let profileFailure = false;
  api.use((req, res, next) => {
    if (!purchaseMode && req.path === '/api/alragheb/orders') return res.json({ success: true, source: 'alragheb', data: [], meta: { total: 0, total_pages: 1, page: 1 } });
    if ((catalogFailure && req.path.includes('/content/')) || (profileFailure && req.path.endsWith('/profile'))) {
      return res.status(502).json({ message: 'Verification service unavailable' });
    }
    next();
  });
  api.use('/api/alragheb', backendRequire('./routes/alraghebRoutes'));
  api.use('/api/admin/alragheb', backendRequire('./routes/alraghebAdminRoutes'));
  const server = api.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const apiUrl = `http://127.0.0.1:${server.address().port}`;
  const token = backendRequire('jsonwebtoken').sign({
    id: testUser ? String(testUser._id) : '507f1f77bcf86cd799439011', role: 'admin', email: 'catalog-test@example.invalid',
  }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const browser = await chromium.launch({ headless: true });
  fs.mkdirSync(artifactDir, { recursive: true });
  let context;

  try {
    context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    if (staticBuild) {
      await context.route(`${new URL(appUrl).origin}/**`, async (route) => {
        const pathname = decodeURIComponent(new URL(route.request().url()).pathname);
        const relative = pathname.replace(/^\/+/, '');
        const file = path.resolve(staticBuild, relative || 'index.html');
        if (file !== staticBuild && !file.startsWith(`${staticBuild}${path.sep}`)) return route.fulfill({ status: 403, body: '' });
        const requestedFile = fs.existsSync(file) && fs.statSync(file).isFile() ? file : path.join(staticBuild, 'index.html');
        const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
        return route.fulfill({ contentType: mime[path.extname(requestedFile)] || 'application/octet-stream', body: fs.readFileSync(requestedFile) });
      });
    }
    await context.addInitScript((value) => {
      localStorage.setItem('token', value);
      sessionStorage.setItem('paynet:new-services-announcement:2026-09-inquiry:dismissed-session', 'true');
    }, token);
    await context.route('**/api/**', async (route) => {
      const url = new URL(route.request().url());
      if (url.pathname.startsWith('/api/alragheb/') || url.pathname.startsWith('/api/admin/alragheb/')) {
        const response = await fetch(`${apiUrl}${url.pathname}${url.search}`, {
          method: route.request().method(), headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: ['GET', 'HEAD'].includes(route.request().method()) ? undefined : route.request().postData(),
        });
        return route.fulfill({ status: response.status, contentType: 'application/json', body: await response.text() });
      }
      if (purchaseMode && url.pathname === '/api/user/balance') return route.fulfill({ json: { balance: (await User.findById(testUser._id)).balance } });
      return route.fulfill({ json: { data: [], balance: 0, daen: 0, cardKey: { cardapplication: true } } });
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const cards = () => page.locator('a[aria-label^="تفاصيل "]');
    const settleImages = () => page.locator('img').evaluateAll(async (images) => {
      images.forEach((image) => { image.loading = 'eager'; });
      await Promise.all(images.map((image) => image.decode().catch(() => {})));
    });
    const assertLayout = async () => {
      const dimensions = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }));
      assert.ok(dimensions.content <= dimensions.width + 1, JSON.stringify(dimensions));
    };
    await page.goto(`${appUrl}/chat-apps`);
    await cards().first().waitFor();
    assert.equal(await cards().count(), 24);
    await assertLayout();
    await settleImages();
    await page.screenshot({ path: path.join(artifactDir, 'catalog-desktop.png'), fullPage: true });

    await page.getByRole('searchbox').fill('AHLAN');
    const ahlan = page.getByRole('link', { name: 'تفاصيل AHLAN CHAT', exact: true });
    await ahlan.waitFor();
    await ahlan.click();
    await page.getByRole('heading', { name: 'AHLAN CHAT', exact: true }).waitFor();
    await page.reload();
    await page.getByRole('heading', { name: 'AHLAN CHAT', exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'شراء', exact: true }).count(), 0);
    await page.screenshot({ path: path.join(artifactDir, 'product-desktop.png'), fullPage: true });

    const Decimal = backendRequire('decimal.js').clone({ precision: 50 });
    for (const [id, qty] of [[4, 2000], [143, 5000], [203, 10000], [25, 1], [817, 340000]]) {
      const product = snapshot.products.find((p) => p.id === id);
      assert.ok(product, `Price verification product ${id} missing`);
      await page.goto(`${appUrl}/chat-apps/products/${id}`);
      const quantity = page.getByLabel('كمية الشحن', { exact: true });
      await quantity.waitFor();
      if (product.quantity_rules.mode === 'choices') await quantity.selectOption(String(qty));
      else if (product.quantity_rules.mode !== 'fixed') await quantity.fill(String(qty));
      const expected = new Decimal(product.provider_price).times(qty).toFixed(2, Decimal.ROUND_HALF_UP);
      assert.equal((await page.getByLabel('الإجمالي التقديري', { exact: true }).innerText()).trim(), `${expected} ل.س`);
      assert.equal(await page.getByRole('button', { name: 'مراجعة السعر' }).isDisabled(), true);
      await assertLayout();
      if (id === 4) {
        await page.setViewportSize({ width: 390, height: 844 });
        await assertLayout();
        await page.screenshot({ path: path.join(artifactDir, 'soulhill-price-mobile.png'), fullPage: true });
        await page.setViewportSize({ width: 1440, height: 1000 });
      }
    }

    await page.goto(`${appUrl}/chat-apps?category=21`);
    await cards().first().waitFor();
    await page.getByRole('button', { name: 'الصفحة التالية', exact: true }).waitFor();
    await page.getByRole('button', { name: 'الصفحة التالية', exact: true }).click();
    await page.waitForURL('**page=2');
    await page.getByRole('navigation', { name: 'صفحات المنتجات' }).getByText(/^2 \/ /).waitFor();
    assert.equal(await cards().count(), 24);

    await page.goto(`${appUrl}/chat-apps?search=IMO%20100`);
    await page.getByRole('link', { name: 'تفاصيل IMO 100', exact: true }).waitFor();
    await page.getByRole('searchbox').fill('no-matching-app-verification');
    await page.getByText('لا توجد منتجات مطابقة', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'مسح التصفية', exact: true }).click();
    await cards().first().waitFor();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${appUrl}/chat-apps`);
    await cards().first().waitFor();
    await assertLayout();
    await settleImages();
    await page.screenshot({ path: path.join(artifactDir, 'catalog-mobile.png'), fullPage: true });
    await page.screenshot({ path: path.join(artifactDir, 'catalog-mobile-viewport.png') });
    await cards().first().click();
    await page.locator('article').waitFor();
    await assertLayout();
    await page.screenshot({ path: path.join(artifactDir, 'product-mobile.png'), fullPage: true });
    const brokenImages = await page.locator('img').evaluateAll((images) => images.filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.getAttribute('src')));
    assert.deepEqual(brokenImages, []);

    await page.goto(`${appUrl}/adminAlraghebPrices`);
    await page.locator('tbody tr').first().waitFor();
    await assertLayout();
    await page.screenshot({ path: path.join(artifactDir, 'admin-mobile.png'), fullPage: true });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({ path: path.join(artifactDir, 'admin-desktop.png'), fullPage: true });
    if (purchaseMode) {
      await page.getByRole('searchbox').fill('AHLAN');
      await page.getByRole('button', { name: 'إعداد المنتج 57', exact: true }).click();
      await page.getByRole('dialog').waitFor();
      await page.getByLabel('وحدة الفوترة', { exact: true }).fill('1');
      await page.getByLabel('كمية المعاينة', { exact: true }).fill('6000');
      const adminExpected = new Decimal(snapshot.products.find((p) => p.id === 57).provider_price).times(6000).toFixed(2, Decimal.ROUND_HALF_UP);
      assert.equal((await page.getByLabel('إجمالي المعاينة', { exact: true }).innerText()).trim(), `${adminExpected} ل.س`);
      await page.getByLabel('مفتاح الحقل 1', { exact: true }).fill('playerId');
      await page.getByLabel('مرجع اعتماد السعر والحقول').fill('Isolated simulated contract for browser verification');
      await page.getByLabel('تمكين شراء المنتج').check();
      await page.screenshot({ path: path.join(artifactDir, 'admin-config-desktop.png'), fullPage: true });
      await page.getByRole('button', { name: 'حفظ الاعتماد' }).click();
      await page.getByRole('dialog').waitFor({ state: 'hidden' });
      await page.getByRole('tab', { name: 'الأرباح', exact: true }).click();
      await page.getByLabel('تحديد المنتج 57', { exact: true }).check();
      await page.getByLabel('نطاق الأرباح', { exact: true }).selectOption('selected');
      await page.getByLabel('نسبة الربح الجماعي', { exact: true }).fill('10');
      await page.getByLabel('الربح الثابت الجماعي', { exact: true }).fill('2.50');
      await page.getByRole('button', { name: 'معاينة الأرباح', exact: true }).click();
      await page.getByRole('table', { name: 'معاينة أسعار البيع' }).waitFor();
      const Config = backendRequire('./models/AlraghebProductConfig');
      assert.equal((await Config.findOne({ productId: 57 })).markupPercent, '0', 'Preview must not save margins');
      await assertLayout();
      await page.screenshot({ path: path.join(artifactDir, 'admin-profits-desktop.png'), fullPage: true });
      await page.setViewportSize({ width: 390, height: 844 });
      await assertLayout();
      await page.getByLabel('نطاق الأرباح', { exact: true }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(artifactDir, 'admin-profits-mobile.png'), fullPage: true });
      await page.screenshot({ path: path.join(artifactDir, 'admin-profits-mobile-viewport.png') });
      await page.getByLabel('سبب تعديل الأرباح', { exact: true }).fill('Isolated browser markup approval');
      await page.getByRole('button', { name: 'تأكيد تعديل 1 منتج', exact: true }).click();
      await page.getByText('تم حفظ الربح لـ 1 منتج', { exact: true }).waitFor();
      assert.equal((await Config.findOne({ productId: 57 })).markupPercent, '10');
      await page.getByRole('button', { name: 'معاينة الأرباح', exact: true }).click();
      await page.getByText('ربح مخصص محفوظ: 1', { exact: true }).waitFor();
      await page.getByRole('button', { name: 'إعداد المنتج 57', exact: true }).click();
      await page.getByRole('dialog').waitFor();
      assert.equal(await page.getByLabel('نسبة ربح المنتج', { exact: true }).inputValue(), '10');
      assert.equal(await page.getByLabel('ربح ثابت للمنتج', { exact: true }).inputValue(), '2.5');
      await assertLayout();
      await page.screenshot({ path: path.join(artifactDir, 'admin-markup-config-mobile.png'), fullPage: true });
      await page.getByRole('button', { name: 'إغلاق إعداد المنتج', exact: true }).click();
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(`${appUrl}/chat-apps/products/57`);
      await page.getByLabel('كمية الشحن', { exact: true }).waitFor();
      await page.getByLabel('كمية الشحن', { exact: true }).fill('2999');
      assert.equal(await page.getByRole('button', { name: 'مراجعة السعر' }).isDisabled(), true);
      await page.getByLabel('كمية الشحن', { exact: true }).fill('6000');
      await page.locator('section[aria-label="شراء المنتج"] input:not([aria-label])').fill('001234');
      const expected = new Decimal(snapshot.products.find((p) => p.id === 57).provider_price).times(6000).times('1.1').plus('2.5').toFixed(2, Decimal.ROUND_HALF_UP);
      assert.equal((await page.getByLabel('الإجمالي التقديري', { exact: true }).innerText()).trim(), `${expected} ل.س`);
      await page.getByRole('button', { name: 'مراجعة السعر' }).click();
      await page.getByRole('button', { name: 'تأكيد الدفع' }).waitFor();
      await page.getByText(`الإجمالي: ${expected} ل.س`, { exact: true }).waitFor();
      await page.setViewportSize({ width: 390, height: 844 });
      await assertLayout();
      await page.screenshot({ path: path.join(artifactDir, 'purchase-mobile.png'), fullPage: true });
      await page.getByRole('button', { name: 'تأكيد الدفع' }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(artifactDir, 'purchase-mobile-viewport.png') });
      await page.getByRole('button', { name: 'تأكيد الدفع' }).click();
      await page.getByRole('button', { name: 'طلب جديد', exact: true }).waitFor();
      assert.equal(providerOrders, 1);
      assert.equal((await User.findById(testUser._id)).balance, new Decimal(10000).minus(expected).toNumber());
      providerOutcome = 'reject';
      await page.getByRole('button', { name: 'طلب جديد', exact: true }).click();
      await page.getByRole('button', { name: 'مراجعة السعر' }).click();
      await page.getByRole('button', { name: 'تأكيد الدفع' }).click();
      await page.getByRole('button', { name: 'طلب جديد', exact: true }).waitFor();
      assert.equal(providerOrders, 2);
      assert.equal((await User.findById(testUser._id)).balance, new Decimal(10000).minus(expected).toNumber());
      await page.reload();
      await page.locator('section[aria-label="طلباتي"] tbody tr').first().waitFor();
      assert.equal(await page.locator('section[aria-label="طلباتي"] tbody tr').count(), 2);
      await page.goto(`${appUrl}/adminAlraghebPrices?view=orders`);
      await page.locator('section[aria-label="إدارة طلبات Alragheb"] tbody tr').first().waitFor();
      await assertLayout();
      await page.screenshot({ path: path.join(artifactDir, 'admin-orders-mobile.png'), fullPage: true });
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.screenshot({ path: path.join(artifactDir, 'admin-orders-desktop.png'), fullPage: true });
      await page.goto(`${appUrl}/adminAlraghebPrices`);
    }
    profileFailure = true;
    await page.reload();
    await page.getByRole('alert').waitFor();
    assert.ok(await page.locator('tbody tr').count() > 1);

    catalogFailure = true;
    await page.goto(`${appUrl}/chat-apps`);
    await page.getByRole('alert').waitFor();
    catalogFailure = false;
    await page.getByRole('button', { name: 'إعادة المحاولة', exact: true }).click();
    await cards().first().waitFor();
    await page.goto(`${appUrl}/chat-apps/products/99999999`);
    await page.getByRole('alert').waitFor();

    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ passed: true, products: snapshot.products.length, categories: snapshot.categories.length - 1, simulatedProviderOrders: providerOrders, liveProviderOrders: 0,
      checks: ['search', 'nested categories', 'pagination', 'deep-link reload', 'empty state', 'provider error recovery', 'profile/catalog isolation', 'missing product', 'mobile/desktop overflow', 'images', ...(purchaseMode ? ['admin configuration', 'bulk markup preview and save', 'preserve custom markup', 'individual markup editor', 'SYP quote including markup', 'quantity bounds', 'simulated successful purchase', 'simulated rejection/refund including markup', 'customer/admin history'] : [])], artifactDir }));
  } catch (error) {
    console.error('Browser verification failed: ' + error.message);
    throw error;
  } finally {
    if (context) await context.unrouteAll({ behavior: 'wait' });
    await browser.close();
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    if (purchaseMode) {
      try {
        if (mongoose.connection.name === dbName) for (const model of Object.values(mongoose.models)) await model.deleteMany({});
      } finally { await mongoose.disconnect(); }
    }
  }
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
