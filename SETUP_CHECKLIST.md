# Setup Checklist — Sevens Cleaners MVP

## Before First Launch

### Services to Create Accounts For
- [ ] [Clerk](https://clerk.com) — Auth
- [ ] [Supabase](https://supabase.com) — Database + Storage
- [ ] [Square Developer](https://developer.squareup.com) — Payments
- [ ] [Twilio](https://twilio.com) — SMS
- [ ] [SendGrid](https://sendgrid.com) — Email
- [ ] [Google Cloud Console](https://console.cloud.google.com) — Maps

### Environment Variables to Fill In
Copy from `.env.local` and fill each value:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=     # From Clerk dashboard
CLERK_SECRET_KEY=                      # From Clerk dashboard
DATABASE_URL=                          # From Supabase project settings
DIRECT_URL=                            # Same as DATABASE_URL for Supabase
NEXT_PUBLIC_SUPABASE_URL=              # From Supabase project settings
SUPABASE_SERVICE_ROLE_KEY=             # From Supabase project settings (service_role)
NEXT_PUBLIC_SQUARE_APP_ID=             # From Square developer dashboard
NEXT_PUBLIC_SQUARE_LOCATION_ID=        # From Square developer dashboard
SQUARE_ACCESS_TOKEN=                   # From Square developer dashboard
SQUARE_WEBHOOK_SIGNATURE_KEY=          # From Square webhook subscription
TWILIO_ACCOUNT_SID=                    # From Twilio console
TWILIO_AUTH_TOKEN=                     # From Twilio console
TWILIO_PHONE_NUMBER=                   # Your Twilio phone number
SENDGRID_API_KEY=                      # From SendGrid API Keys
SENDGRID_FROM_EMAIL=                   # Verified sender email in SendGrid
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=       # From Google Cloud Console
NEXT_PUBLIC_APP_URL=                   # Your production URL
ADMIN_EMAIL=                           # Your admin email
```

### Supabase Storage Setup
1. Create bucket named `cleaner-ids`
2. Set to PRIVATE
3. Add RLS policy: service role can read/write

### Square Webhook Setup
1. Go to Square Developer → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/square`
3. Subscribe to: `payment.completed`
4. Copy signature key to `SQUARE_WEBHOOK_SIGNATURE_KEY`

### First Admin User
After deploying, sign up with your admin email, then run:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```
In Supabase: Go to Table Editor → User → find your row → edit role to ADMIN

### Database Setup Commands
```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to Supabase
```
