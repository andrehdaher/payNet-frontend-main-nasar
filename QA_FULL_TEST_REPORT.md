# QA Full Test Report

Date: 2026-07-29

## 1. Executive Summary

Verdict: FAIL - FINANCIAL RISK, partially mitigated during this session.

The project can run locally when the frontend points to `https://paynet-1.onrender.com`. Login with the provided PayNet test account succeeds, ProWave read endpoints work locally, and ProWave availability returns successfully for at least one product.

Critical financial risk found: the ProWave purchase endpoint originally trusted the amount sent by the frontend for PayNet balance deduction. This allowed a tampered client request to attempt a purchase while deducting a manipulated SYP amount. This was fixed by calculating the PayNet SYP amount on the backend from the ProWave item price and backend exchange rate.

Live ProWave purchase was not executed because it may deduct real ProWave balance and issue a real digital code.

## 2. Environment

| Item | Value |
| --- | --- |
| OS | Windows |
| Node.js | v22.19.0 |
| npm | 10.9.3 |
| Frontend URL | http://127.0.0.1:3000 |
| Backend URL | https://paynet-1.onrender.com |
| Production backend checked | https://paynet-1.onrender.com |
| Test account | Provided by user; password omitted from report |
| External provider | ProWave |

Important environment finding:

- `localhost:5000` resolves to a different Node service on IPv6 and returns `404` for PayNet routes.
- `127.0.0.1:5000` reaches PayNet backend correctly.
- `.env.local` was pointing to `http://127.0.0.1:5001`; it was changed to `https://paynet-1.onrender.com`.

## 3. Architecture Summary

Frontend:

- React app in `C:\andreh\payNet-frontend-main`.
- API base URL is centralized in `src/config/api.js`.
- ProWave client API is in `src/api/prowaveApi.js`.
- ProWave product and purchase flow is in `src/pages/PayApp.jsx`.
- Customer financial statement is in `src/pages/FinancialStatement.jsx`.

Backend:

- Express app in `C:\andreh\payNet-main`.
- ProWave routes are mounted at `/api/prowave`.
- ProWave controller is `controllers/proWave.js`.
- Customer balance model is `models/User.js`.
- Financial operation model is `models/Payment.js`.

## 4. Routes Inventory Snapshot

Frontend pages observed:

- `/login` via `src/pages/Login.jsx`
- Home/services via `src/pages/Home.jsx`
- Pay app/products via `src/pages/PayApp.jsx`
- Financial statement via `src/pages/FinancialStatement.jsx`
- Admin pending/financial/payment statement pages
- Product upload, user management, balance, point, and payment pages

Backend route groups observed:

| Base | Route File |
| --- | --- |
| `/api` | `routes/authRoutes.js` |
| `/api/user` | `routes/userRoutes.js` |
| `/api/payment` | `routes/paymentRoutes.js` |
| `/api/admin` | `routes/admin.js` |
| `/api/prowave` | `routes/proWave.js` |
| `/api/productonline` | `routes/productOnline.js` |
| `/api/product` | `routes/product.js` |
| `/api/saveBalance` | `routes/saveBalance.js` |
| `/api/point` | `routes/point.js` |
| `/api/invoice` | `routes/invoice.js` |
| `/api/backup` | `routes/backup.js` |

ProWave endpoints:

| Method | Endpoint | Auth | Result |
| --- | --- | --- | --- |
| GET | `/api/prowave/balance` | No | PASS locally |
| GET | `/api/prowave/items` | No | PASS locally |
| GET | `/api/prowave/check-availability` | No | PASS locally |
| POST | `/api/prowave/purchase-digital-card` | Yes | Validation/auth tested; live purchase not executed |
| GET | `/api/prowave/codes` | No | Not live-tested |
| GET | `/api/prowave/invoices` | No | Not live-tested |

## 5. Test Results

| ID | Test | Expected | Actual | Result |
| --- | --- | --- | --- | --- |
| AUTH-001 | Login with provided test account via `POST /api/login` | 200 + token | 200 + token | PASS |
| AUTH-002 | Login with wrong body field `username` | 401 | 401 | PASS |
| USER-001 | `GET /api/user/balance` with token | Balance returned | Balance returned: `9194.849499999997` | PASS |
| USER-002 | `GET /api/user/get-user-by-email?email=and` | Card permissions returned | Card permissions returned | PASS |
| PW-001 | `GET /api/prowave/balance` on `127.0.0.1:5000` | 200 | 200 | PASS |
| PW-002 | `GET /api/prowave/items` for Roblox USA Cards | Product list | 8 items; first `Roblox Card USA 10$`, USD price `9.6` | PASS |
| PW-003 | `GET /api/prowave/check-availability` for first Roblox item | Availability payload | `available=True` | PASS |
| PW-004 | `POST /api/prowave/purchase-digital-card` without token | 401 | 401 | PASS |
| PW-005 | `POST /api/prowave/purchase-digital-card` with missing `item_code` | 400 | 400 | PASS |
| PW-006 | Tampered request with invalid item and fake SYP amount | Fail before deduction/purchase | 404: product not found | PASS |
| BUILD-001 | `npm run build` frontend | Successful build | Successful with existing warnings | PASS WITH WARNINGS |
| BE-001 | `node --check` backend ProWave files | No syntax errors | No syntax errors | PASS |
| DEPLOY-001 | Render `/api/prowave/balance` | Route exists | 404 | FAIL |

## 6. Financial Verification

| Operation | Initial Balance | Amount | Expected Balance | Actual Balance | Statement Entry | Result |
| --- | --- | --- | --- | --- | --- | --- |
| ProWave live purchase | Not executed | Not executed | Not executed | Not executed | Not executed | BLOCKED |
| ProWave invalid item request | No purchase expected | Fake `1 SYP` ignored | No deduction expected | Not DB-verified directly | No save expected before product lookup | PASS by API behavior |

Live purchase was intentionally skipped because the current ProWave integration uses real provider credentials and may deduct real provider balance.

Backend now calculates PayNet deduction as:

`ceil(ProWave unit USD price * backend exchange rate) * qty`

Stored fields include:

- `amount`
- `calculatedAmount`
- `extra.paynet_amount_syp`
- `extra.paynet_currency`
- `extra.prowave_unit_price_usd`
- `extra.paynet_exchange_rate`

## 7. Bugs

### BUG-001: Frontend local API URL pointed to wrong port

Severity: High

Location:

- `C:\andreh\payNet-frontend-main\.env.local`

Expected:

- Frontend should call PayNet backend at `https://paynet-1.onrender.com`.

Actual:

- `.env.local` pointed to `http://127.0.0.1:5001`.

Fix applied:

- Changed `.env.local` to `REACT_APP_API_URL=https://paynet-1.onrender.com`.
- Restarted React dev server.

### BUG-002: `localhost:5000` can hit the wrong server

Severity: High

Evidence:

- `http://localhost:5000/api/prowave/balance` returned `404`.
- `https://paynet-1.onrender.com/api/prowave/balance` returned `200`.
- Another Node service was listening on IPv6 `::5000`.

Suggested fix:

- Use `127.0.0.1` for local frontend configuration, or move the unrelated service to another port.

### BUG-003: ProWave routes are not deployed to Render

Severity: High

Evidence:

- `https://paynet-1.onrender.com/api/prowave/balance` returned `404`.

Expected:

- Render backend should expose `/api/prowave/*` after deployment.

Suggested fix:

- Commit and deploy backend files `controllers/proWave.js`, `routes/proWave.js`, updated `server.js`, and dependency changes.

### BUG-004: ProWave purchase originally trusted frontend SYP amount

Severity: Critical

Location:

- `C:\andreh\payNet-main\controllers\proWave.js`

Risk:

- A user could tamper with `paynet_amount_syp` / `amount_syp` / `calculatedAmount` in the browser and underpay for a ProWave purchase.

Fix applied:

- Backend now fetches the ProWave item, calculates SYP amount server-side, and ignores frontend amount for deduction.

### BUG-005: Several admin and financial routes lack authentication

Severity: Critical

Examples:

- `PATCH /api/admin/confirm/:id`
- `PATCH /api/admin/start/:id`
- `PUT /api/admin/payment/:id`
- `POST /api/admin/reject/:id`
- Several invoice/product/point mutation routes

Suggested fix:

- Add `authMiddleware` and role-based admin authorization to all admin-only and mutating routes.

### BUG-006: Passwords are compared as plaintext

Severity: Critical

Location:

- `C:\andreh\payNet-main\controllers\authController.js`

Actual:

- `const isMatch = user.password === password`

Suggested fix:

- Hash passwords with bcrypt/argon2 and compare hashes.

## 8. Security Findings

| Finding | Severity | Status |
| --- | --- | --- |
| Missing auth on multiple admin mutation routes | Critical | Open |
| Plaintext password comparison | Critical | Open |
| CORS allows all origins | High | Open |
| Frontend stores JWT in localStorage | Medium | Open |
| ProWave read endpoints expose provider data without auth | Medium | Open |
| Render missing ProWave deployment | High | Open |

## 9. Automated Tests Added

No automated test files were added in this pass.

Recommended next tests:

- Supertest API tests for ProWave purchase success/failure with mocked provider.
- Unit tests for server-side SYP price calculation.
- Concurrency tests for duplicate purchase and double spending.
- Playwright E2E test for login and ProWave confirm modal without real purchase by mocking backend.

## 10. Final Verdict

FAIL - FINANCIAL RISK

Reason:

- Critical financial/security issues remain open in admin authorization and password storage.
- ProWave live purchase cannot be marked passed without a safe staging/mocked provider.
- The most direct ProWave underpayment risk was fixed during this session.

