export function IconButton({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button aria-label={label} title={label} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white/90 hover:bg-white/20">
      {children}
    </button>
  )
}