# Sevens Cleaners — MVP

On-demand apartment cleaning marketplace. Customers book and prepay online, cleaners accept jobs via dashboard, admin manually dispatches.

**Stack:** Next.js 14 · TypeScript · TailwindCSS · Prisma · Supabase Postgres · Clerk Auth · Square Payments · Twilio SMS · SendGrid Email

---

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd sevens-cleaners
npm install
```

### 2. Configure Environment Variables

Copy `.env.local` and fill in all values:

```bash
cp .env.local .env.local
```

Required variables — see full list in `.env.local`.

### 3. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Storage → Create bucket** → name it `cleaner-ids`
3. Set bucket to **private** (NOT public)
4. Go to **Storage → Policies** → Add policy:
   - Allow service role full access (for server-side uploads)
5. Copy your project URL and service role key to `.env.local`

### 4. Set Up Clerk

1. Create app at [clerk.com](https://clerk.com)
2. Enable **Email/Password** sign-in
3. Copy publishable key and secret key to `.env.local`
4. In Clerk dashboard → **Roles & Permissions**, you don't need custom roles — roles are managed in your DB

**First Admin Setup:**
After deploying, sign up normally, then run this in Prisma Studio or via SQL:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

### 5. Set Up Square (Sandbox)

1. Create account at [developer.squareup.com](https://developer.squareup.com)
2. Create a new application
3. Go to **Sandbox** → copy App ID, Location ID, and Access Token
4. Add to `.env.local`
5. For webhooks (local dev): use [Square Webhook CLI](https://developer.squareup.com/docs/webhooks/overview) or ngrok
6. Subscribe to events: `payment.completed`

**Square Webhook URL:** `https://yourdomain.com/api/webhooks/square`

### 6. Set Up Twilio

1. Create account at [twilio.com](https://twilio.com)
2. Get a phone number
3. Copy Account SID, Auth Token, and phone number to `.env.local`

### 7. Set Up SendGrid

1. Create account at [sendgrid.com](https://sendgrid.com)
2. Create an API key (Full Access)
3. Verify your sender email address
4. Copy API key and sender email to `.env.local`

### 8. Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Maps JavaScript API** and **Places API**
3. Create an API key and restrict it to your domain
4. Add to `.env.local`

### 9. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

### 10. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel + Supabase)

### Deploy to Vercel

1. Push code to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel domain
5. Deploy

### Post-Deployment Checklist

- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Switch Square to Production mode (`SQUARE_ENVIRONMENT=production`)
- [ ] Update Square webhook URL to production domain
- [ ] Verify Supabase storage bucket is private
- [ ] Verify Clerk sign-in URLs match production domain
- [ ] Set first admin user role in database
- [ ] Test full booking flow end-to-end
- [ ] Test cleaner onboarding flow
- [ ] Test admin dashboard

---

## Architecture

```
/app
  /(public)          # Public marketing pages
    /page.tsx        # Home
    /pricing         # Pricing page
    /faq             # FAQ
    /terms           # Terms of Service
    /privacy         # Privacy Policy
  /book              # Booking flow (multi-step form)
    /confirmation    # Booking confirmation page
  /dashboard         # Customer portal
    /bookings/[id]   # Booking detail
  /cleaner           # Cleaner portal
    /onboarding      # Cleaner signup
    /dashboard       # Available & active jobs
    /availability    # Set availability
    /earnings        # Earnings history
  /admin             # Admin portal (role-gated)
    /bookings        # All bookings with filters
    /bookings/[id]   # Booking detail + assign cleaner
    /cleaners        # Cleaner list
    /cleaners/[id]   # Cleaner detail + approve/deactivate
    /settings        # Config reference
  /api               # API routes
    /bookings        # Create booking, update status, assign
    /cleaners        # Onboard, update availability
    /assignments     # Cleaner status updates
    /webhooks/square # Square payment webhook
    /admin           # Admin utilities (suggest cleaners)
/lib
  prisma.ts          # Prisma client singleton
  square.ts          # Square SDK client
  twilio.ts          # SMS helper
  sendgrid.ts        # Email helper
  supabase.ts        # Storage client + upload helpers
  pricing.ts         # Pricing constants + calculateTotal
  notifications.ts   # SMS + email notification helpers
  auth.ts            # Clerk auth helpers + role guard
/prisma
  schema.prisma      # Database schema
/components
  /booking           # Booking form components
  /layout            # Header, Footer
  /ui                # Badge, StatusTimeline
```

---

## Pricing

| Service | Price | Duration |
|---------|-------|----------|
| 1 Bedroom | $120 | ~90 min |
| 2 Bedroom | $160 | ~120 min |

| Add-On | Price | Extra Time |
|--------|-------|-----------|
| Deep Clean | +$50 | +45 min |
| Inside Oven | +$25 | +20 min |
| Inside Fridge | +$25 | +20 min |
| Move In/Out | +$75 | +60 min |
| Pet Hair | +$30 | +20 min |

---

## Booking Flow

1. Customer selects service + add-ons → sees total price
2. Customer enters address + date/time window + notes
3. Customer reviews order and clicks Pay
4. API creates booking record + Square payment link
5. Customer completes payment on Square hosted page
6. Square fires `payment.completed` webhook
7. Webhook confirms payment, sends SMS + email confirmation
8. Admin sees new booking in dashboard, assigns cleaner
9. Cleaner receives job offer in dashboard, accepts/declines
10. Cleaner marks: In Route → Started → Finished
11. Customer receives SMS/email at each status change

---

## Security

- All admin routes require `role = ADMIN` in database
- Cleaner routes require `role = CLEANER` or `ADMIN`
- ID images stored in private Supabase bucket
- Admin-only signed URL generation for ID viewing
- File upload validation: type (JPEG/PNG/WebP/PDF) + size (5MB max)
- Square webhook signature verification in production
- Input validation with Zod on all API routes
- Clerk handles authentication (no password storage)
