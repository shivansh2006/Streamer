export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded bg-white/10 px-2 py-0.5 text-xs font-medium text-white/90">
      {children}
    </span>
  )
}