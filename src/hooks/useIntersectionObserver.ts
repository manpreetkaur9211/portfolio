'use client'

import { useEffect, useRef } from 'react'

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Called when the element enters the viewport. Observer disconnects after first trigger. */
  onIntersect?: (entry: IntersectionObserverEntry) => void
  /**
   * When true (default), adds the "is-visible" CSS class to the element on intersect.
   * Set to false when using onIntersect for custom behaviour instead.
   */
  addVisibleClass?: boolean
}

export function useIntersectionObserver<T extends Element>(
  options: UseIntersectionObserverOptions = {}
) {
  const { onIntersect, addVisibleClass = true, ...observerInit } = options
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        if (onIntersect) {
          onIntersect(entry)
        } else if (addVisibleClass) {
          entry.target.classList.add('is-visible')
        }

        observer.disconnect()
      },
      { threshold: 0.1, ...observerInit }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return ref
}
