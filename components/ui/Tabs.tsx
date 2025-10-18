'use client'
import { useState } from 'react'

export function Tabs({
  tabs,
  initial = 0
}: {
  tabs: { label: string; content: React.ReactNode }[]
  initial?: number
}) {
  const [idx, setIdx] = useState(initial)
  return (
    <div>
      <div className="mb-3 flex items-center gap-6 text-sm">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            className={i === idx ? 'text-white font-semibold' : 'text-white/70 hover:text-white'}
            onClick={() => setIdx(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>{tabs[idx]?.content}</div>
    </div>
  )
}