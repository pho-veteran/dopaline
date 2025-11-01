export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center relative">
      <div className="glass-bg-gradient" />
      <div className="glass-bg-gradient-dark hidden dark:block" />
      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
    </div>
  )
}

