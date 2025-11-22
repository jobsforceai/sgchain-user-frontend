"use client"

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  children: React.ReactNode
  className?: string
  y?: number
  duration?: number
  stagger?: number
  start?: string
}

export default function AnimateGSAP({ children, className = '', y = 30, duration = 0.9, stagger = 0.08, start = 'top 80%' }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = Array.from(el.querySelectorAll('[data-gsap]'))

    // if no marked targets, animate all direct children
    const elems = targets.length ? targets : Array.from(el.children)

    const ctx = gsap.context(() => {
      gsap.from(elems, {
        y,
        opacity: 0,
        duration,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none reverse',
        },
      })
    }, el)

    return () => ctx.revert()
  }, [y, duration, stagger, start])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
