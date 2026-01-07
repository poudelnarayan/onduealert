export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
        <div className="mb-8">
          <div className="text-lg font-semibold tracking-tight text-brand-900">
            OnDueAlert
          </div>
          <div className="mt-1 text-sm text-brand-600">
            Compliance enforcement for deadlines that matter.
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}


