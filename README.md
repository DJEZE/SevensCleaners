# Sevens Cleaners

An on-demand apartment cleaning marketplace. Customers book and prepay online, cleaners accept jobs via a dedicated dashboard, and admins dispatch and manage everything from a central control panel.

**Stack:** Next.js 14 · TypeScript · TailwindCSS · Prisma · Supabase Postgres · Clerk Auth · Stripe Payments · Twilio SMS · SendGrid Email · Google Maps

---

## Features

- **Customers** — Book and prepay for cleaning services online, receive SMS/email status updates throughout the job
- **Cleaners** — Accept or decline job offers, update job status in real time, manage availability and view earnings
- **Admins** — View all bookings, manually assign cleaners, approve/deactivate cleaner accounts, and access configuration

---

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd sevens-cleaners
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in all values — see the full list in `.env.local.example`.

### 3. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Storage → Create bucket** → name it `cleaner-ids`
3. Set the bucket to **private** (not public)
4. Go to **Storage → Policies** → add a policy allowing service role full access (for server-side uploads)
5. Copy your project URL and service role key into `.env.local`

### 4. Set Up Clerk

1. Create an app at [clerk.com](https://clerk.com)
2. Enable **Email/Password** sign-in
3. Copy the publishable key and secret key into `.env.local`

**First Admin Setup:** After deploying, sign up normally, then promote your account via Prisma Studio or SQL:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

### 5. Set Up Stripe

1. Create an account at [stripe.com](https://stripe.com)
2. Copy the publishable key and secret key into `.env.local`
3. For local webhook testing, install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Subscribe to the `payment_intent.succeeded` event
5. Copy the webhook signing secret into `.env.local`

**Stripe Webhook URL (production):** `https://yourdomain.com/api/webhooks/stripe`

### 6. Set Up Twilio

1. Create an account at [twilio.com](https://twilio.com)
2. Get a phone number
3. Copy your Account SID, Auth Token, and phone number into `.env.local`

### 7. Set Up SendGrid

1. Create an account at [sendgrid.com](https://sendgrid.com)
2. Create an API key with Full Access
3. Verify your sender email address
4. Copy the API key and sender email into `.env.local`

### 8. Set Up Google Maps

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable the **Maps JavaScript API** and **Places API**
3. Create an API key and restrict it to your domain
4. Add it to `.env.local`

### 9. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or use migrations
npm run db:migrate
```

### 10. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel + Supabase)

1. Push code to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel domain
5. Deploy

### Post-Deployment Checklist

- [ ] Set `NEXT_PUBLIC_APP_URL` to your production domain
- [ ] Switch Stripe to live mode keys
- [ ] Update the Stripe webhook URL to your production domain
- [ ] Verify the Supabase storage bucket is private
- [ ] Confirm Clerk sign-in URLs match your production domain
- [ ] Set the first admin user role in the database
- [ ] Test the full booking flow end-to-end
- [ ] Test the cleaner onboarding flow
- [ ] Test the admin dashboard

---

## Architecture

```
/app
  /(public)            # Public marketing pages
    /page.tsx          # Homepage
    /pricing           # Pricing page
    /faq               # FAQ
    /terms             # Terms of Service
    /privacy           # Privacy Policy
  /book                # Multi-step booking form
    /confirmation      # Booking confirmation page
  /dashboard           # Customer portal
    /bookings/[id]     # Booking detail
  /cleaner             # Cleaner portal
    /onboarding        # Cleaner signup
    /dashboard         # Available & active jobs
    /availability      # Set availability
    /earnings          # Earnings history
  /admin               # Admin portal (role-gated)
    /bookings          # All bookings with filters
    /bookings/[id]     # Booking detail + assign cleaner
    /cleaners          # Cleaner list
    /cleaners/[id]     # Cleaner detail + approve/deactivate
    /settings          # Config reference
  /api                 # API routes
    /bookings          # Create booking, update status, assign cleaner
    /cleaners          # Onboard, update availability
    /assignments       # Cleaner job status updates
    /webhooks/stripe   # Stripe payment webhook
    /admin             # Admin utilities (suggest cleaners)
    /auth              # Admin/cleaner login + logout
/lib
  prisma.ts            # Prisma client singleton
  stripe.ts            # Stripe SDK client
  twilio.ts            # SMS helper
  sendgrid.ts          # Email helper
  supabase.ts          # Storage client + upload helpers
  pricing.ts           # Pricing constants + calculateTotal
  notifications.ts     # SMS + email notification dispatchers
  auth.ts              # Session management + role guards
/prisma
  schema.prisma        # Database schema
/components
  /booking             # Booking form step components
  /layout              # Header, Footer
  /ui                  # Badge, StatusTimeline, etc.
```

---

## Pricing

| Service | Price | Duration |
|---------|-------|----------|
| 1 Bedroom | $120 | ~90 min |
| 2 Bedroom | $160 | ~120 min |

| Add-On | Price | Extra Time |
|--------|-------|------------|
| Deep Clean | +$50 | +45 min |
| Inside Oven | +$25 | +20 min |
| Inside Fridge | +$25 | +20 min |
| Move In/Out | +$75 | +60 min |
| Pet Hair | +$30 | +20 min |

---

## Booking Flow

1. Customer selects service and add-ons, sees total price
2. Customer enters address, date/time window, and any notes
3. Customer reviews order and clicks Pay
4. API creates booking record and initiates Stripe payment
5. Customer completes payment via Stripe
6. Stripe fires a webhook on successful payment
7. Webhook confirms payment and sends SMS + email confirmation
8. Admin sees the new booking in the dashboard and assigns a cleaner
9. Cleaner receives a job offer in their dashboard and accepts or declines
10. Cleaner marks job: **In Route → Started → Finished**
11. Customer receives SMS/email notifications at each status change

---

## Security

- All admin routes require `role = ADMIN` in the database
- Cleaner routes require `role = CLEANER` or `ADMIN`
- ID images stored in a private Supabase bucket (no public access)
- Signed URLs generated server-side for admin-only ID viewing
- File upload validation: type (JPEG/PNG/WebP/PDF) and size (5 MB max)
- Stripe webhook signature verification in production
- Input validation with Zod on all API routes
- Clerk handles authentication — no passwords stored in the app database

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes to the database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |
