export default function AdminSettingsPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Environment Configuration</h2>
        <p className="text-slate-500 text-sm">
          All application settings are managed via environment variables. Update your <code className="bg-slate-100 px-1 rounded">.env.local</code> file or Vercel environment settings.
        </p>
        <div className="space-y-2 text-sm">
          {[
            ["Auth", "CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"],
            ["Database", "DATABASE_URL, DIRECT_URL"],
            ["Storage", "NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"],
            ["Payments", "SQUARE_ACCESS_TOKEN, NEXT_PUBLIC_SQUARE_APP_ID"],
            ["SMS", "TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN"],
            ["Email", "SENDGRID_API_KEY, SENDGRID_FROM_EMAIL"],
            ["Maps", "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"],
          ].map(([service, vars]) => (
            <div key={service} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="font-medium w-20 shrink-0">{service}</div>
              <code className="text-xs text-slate-500">{vars}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
