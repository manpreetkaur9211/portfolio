'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    const ring = ringRef.current
    if (!ring) return

    const onMove = (e: MouseEvent) => {
      ring.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`
    }

    const onEnter = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('a, button, [role="button"], input, textarea, select, label')) {
        setHovering(true)
      }
    }

    const onLeave = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('a, button, [role="button"], input, textarea, select, label')) {
        setHovering(false)
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
    }
  }, [])

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-2 transition-[width,height,opacity] duration-300 ${
        hovering
          ? 'cursor-hovering w-8 h-8 opacity-90'
          : 'w-5 h-5 border-slate-400 dark:border-slate-300 shadow-[0_0_10px_3px_rgba(100,116,139,0.4),inset_0_0_4px_1px_rgba(148,163,184,0.25)] opacity-70'
      }`}
    />
  )
}
