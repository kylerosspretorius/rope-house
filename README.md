# The Rope House

E-commerce site for handcrafted natural jute rope homewares, built for the South African market.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org) — App Router, TypeScript, `src/` directory |
| Styling | [Tailwind CSS](https://tailwindcss.com) — stone palette |
| CMS / Database | [Sanity.io](https://sanity.io) — products, orders, customers, auth, settings |
| Authentication | [NextAuth.js v4](https://next-auth.js.org) + [next-auth-sanity](https://github.com/fedeya/next-auth-sanity) adapter |
| Email | [Resend](https://resend.com) — magic links, refund notifications, stock alerts |
| Payments | [PayFast](https://payfast.io) — South African payment gateway |
| Cart state | [Zustand](https://zustand-demo.pmnd.rs) — persisted in localStorage |
| Hosting | [Vercel](https://vercel.com) |

---

## Service Dashboards

| Service | URL | Purpose |
|---|---|---|
| Sanity Studio (local) | http://localhost:3000/studio | Manage all content |
| Sanity Manage | https://sanity.io/manage/personal/project/9fa2kqd4 | API tokens, CORS, webhooks |
| Google Cloud Console | https://console.cloud.google.com | OAuth credentials |
| Resend | https://resend.com | API keys, email logs, domain verification |
| PayFast Sandbox | https://sandbox.payfast.co.za | Test payments |
| PayFast Live | https://payfast.co.za | Live merchant account |
| Vercel | https://vercel.com/dashboard | Deployments, env vars, domain |

---

## Environment Variables

All secrets live in `.env.local` (not committed). Copy and fill in:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=        # sanity.io/manage → project ID
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_WRITE_TOKEN=               # sanity.io/manage → API → Tokens (Editor role)

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Auth
NEXTAUTH_SECRET=                      # generate: npx auth secret
NEXTAUTH_URL=http://localhost:3000    # set to production URL on Vercel

# Google OAuth — console.cloud.google.com → APIs & Services → Credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Resend — resend.com → API Keys
RESEND_API_KEY=
AUTH_EMAIL_FROM=noreply@yourdomain.com

# Admin notifications (refund requests, etc.)
ADMIN_EMAIL=                          # Sally-Anne's email address

# PayFast — payfast.co.za → merchant account
PAYFAST_MERCHANT_ID=
PAYFAST_MERCHANT_KEY=
PAYFAST_PASSPHRASE=
PAYFAST_SANDBOX=true                  # set false for live payments

# Sanity webhook secret — used by /api/notify-stock/send
SANITY_WEBHOOK_SECRET=                # any strong random string
```

---

## Key Routes

| Route | Description |
|---|---|
| `/` | Homepage — hero, craft section, product grid, care instructions, contact, footer |
| `/products/[slug]` | Product detail page — gallery, description, add to cart or notify me |
| `/checkout` | Full billing/address form + PayFast redirect |
| `/checkout/success` | Post-payment confirmation |
| `/checkout/cancel` | Cancelled payment page |
| `/account` | Customer dashboard — active orders, order history, refund requests |
| `/account/login` | Sign in with Google or email magic link |
| `/faq` | FAQ accordion — ordering, delivery, products, returns, care |
| `/studio` | Embedded Sanity Studio |
| `/api/auth/[...nextauth]` | NextAuth.js handler |
| `/api/payfast` | Initiates payment, creates pending order in Sanity |
| `/api/payfast/notify` | PayFast ITN webhook — marks order complete, decrements stock |
| `/api/refund` | Submits a refund request — patches Sanity, emails admin + customer |
| `/api/notify-stock` | Saves a back-in-stock notification request to Sanity |
| `/api/notify-stock/send` | Webhook trigger — sends emails to waitlist when product restocks |

---

## Sanity Studio

Access at **http://localhost:3000/studio** while the dev server is running.

### Sidebar structure

| Section | Purpose |
|---|---|
| **Site Settings** | Delivery type (fixed / free / flexible), delivery amount, delivery note |
| **Products** | Add/edit products — name, slug, images, price, stock, active toggle |
| **Orders** | View all orders — status, items, billing address, refund status |
| **Stock Waitlist** | Customers waiting for out-of-stock items |
| **Customers** | NextAuth user accounts |
| **Auth Accounts / Sessions / Verification Tokens** | Auth internals |

### Adding a product

1. Studio → **Products** → click **+**
2. Fill in name (slug auto-generates), description, images, price, stock
3. Ensure **Active** is ticked
4. Click **Publish** — appears on the site within 60 seconds

### Configuring delivery

Studio → **Site Settings** → choose delivery type:
- **Fixed amount** — set the ZAR amount; added to order total at checkout
- **Free delivery** — shown as "Free" in the checkout summary
- **Flexible** — write a delivery note (e.g. "Arranged personally after payment")

---

## Local Development

```bash
npm run dev       # http://localhost:3000 (port pinned — will error if 3000 is in use)
npm run build     # production build
npm run studio    # standalone Sanity Studio on http://localhost:3333
```

> `NEXTAUTH_URL` must match the running port. Port 3000 is pinned in the dev script to stay consistent with the Google OAuth redirect URI.

---

## Authentication

- **Google OAuth** — one-click sign in, profile image shown in navbar
- **Email magic link** — sent via Resend, no password required
- Sessions use JWT strategy (stored in cookies); Sanity stores user/account documents only
- Unauthenticated visitors can still checkout as guests — email is the primary identifier

### Google OAuth Setup

1. [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create **OAuth 2.0 Client ID** (Web application, External)
3. Add authorised redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-production-domain.com/api/auth/callback/google`
4. OAuth consent screen → Test users → add emails while in Testing mode

---

## PayFast Integration

- Checkout form POSTs to `/api/payfast` which creates a **pending** order in Sanity and returns signed PayFast fields
- Customer is redirected to the PayFast hosted payment page
- PayFast sends an ITN (Instant Transaction Notification) to `/api/payfast/notify`
- The webhook verifies the MD5 signature, updates order status to **complete/failed/cancelled**, and decrements stock
- Signature rules: payment initiation uses **insertion order**; ITN verification uses **alphabetical sort** (matching PayFast's PHP SDK `ksort`)

### Sandbox credentials (for testing)

```
Merchant ID:  10000100
Merchant Key: 46f0cd694581a
Passphrase:   jt7NOE43FZPn
URL:          https://sandbox.payfast.co.za/eng/process
```

Set `PAYFAST_SANDBOX=true` in `.env.local` to use these automatically.

---

## Refund Requests

Customers with completed orders can request a refund from their account dashboard (`/account`).

1. Customer clicks **Request refund** → confirmation prompt
2. `POST /api/refund` patches the order in Sanity (`refundStatus: requested`)
3. Notification email sent to `ADMIN_EMAIL`
4. Confirmation email sent to the customer via Resend
5. Sally-Anne updates `refundStatus` to `approved` or `rejected` in Sanity Studio → customer sees the status on their next dashboard visit

---

## Back-in-Stock Notifications

When a product is out of stock, the product detail page (`/products/[slug]`) shows a **Notify Me** form.

1. Customer submits email → saved to Sanity as a `stockNotification` document
2. When Sally-Anne restocks a product in Studio, a Sanity webhook fires `POST /api/notify-stock/send`
3. All pending notifications for that product receive a back-in-stock email and are marked notified

### Setting up the Sanity webhook

1. [sanity.io/manage](https://sanity.io/manage/personal/project/9fa2kqd4) → API → Webhooks → **Add webhook**
2. **URL:** `https://your-domain.com/api/notify-stock/send?secret=<SANITY_WEBHOOK_SECRET>`
3. **Dataset:** production
4. **Trigger on:** Update
5. **Filter:** `_type == "product" && stock > 0`
6. **Projection:** `{_id, name, slug, stock}`
7. Save

---

## Sanity Write Token

Required for order creation, stock decrements, refund updates, and notification saves.

1. [sanity.io/manage](https://sanity.io/manage/personal/project/9fa2kqd4) → API → Tokens
2. **Add API token** → name it `write-token` → role: **Editor**
3. Copy into `.env.local` as `SANITY_API_WRITE_TOKEN`

---

## Deployment (Vercel)

1. Push to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add all `.env.local` variables under **Settings → Environment Variables**
4. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your production domain
5. Set `PAYFAST_SANDBOX=false` and update PayFast credentials for live payments
6. Add production callback URL to Google OAuth credentials
7. Add production domain to Sanity CORS origins → [sanity.io/manage](https://sanity.io/manage/personal/project/9fa2kqd4) → API → CORS Origins
8. Update Sanity webhook URL to the production domain
9. Change `ADMIN_EMAIL` to Sally-Anne's email address
