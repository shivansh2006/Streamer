export function Stars({ value = 0, outOf = 10 }: { value?: number; outOf?: number }) {
  const pct = Math.max(0, Math.min(1, value / outOf))
  const five = pct * 5
  const full = Math.floor(five)
  const half = five - full >= 0.5
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < full ? '★' : i === full && half ? '☆' : '☆'
  )
  return (
    <span className="text-yellow-400" aria-label={`Rating ${value}/${outOf}`}>
      {stars.join(' ')} <span className="text-white/60 text-xs">{value?.toFixed?.(1) ?? value}/{outOf}</span>
    </span>
  )
}