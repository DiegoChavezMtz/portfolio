'use client'
import { useState, useEffect, useRef } from 'react'
import type { IntroPhase } from './useIsometricCity'

const PHASE_DURATIONS: Record<IntroPhase, number> = {
  idle: 300,
  ground: 900,       // ground lasts 900ms before blueprint starts
  blueprint: 1200,   // blueprint lasts 1200ms
  build: 1200,       // build lasts 1200ms
  complete: Infinity,
}

const PHASE_ORDER: IntroPhase[] = ['idle', 'ground', 'blueprint', 'build', 'complete']

const BUILDING_COUNT = 5

export function useIntroAnimation() {
  const [phase, setPhase] = useState<IntroPhase>('idle')
  const [buildingProgress, setBuildingProgress] = useState<number[]>(
    Array(BUILDING_COUNT).fill(0)
  )

  const phaseStartRef = useRef<number>(performance.now())
  const rafRef = useRef<number>(0)
  const phaseRef = useRef<IntroPhase>('idle')

  useEffect(() => {
    phaseRef.current = phase
    phaseStartRef.current = performance.now()
  }, [phase])

  // Advance phase via timeouts
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    let elapsed = 0
    for (let i = 0; i < PHASE_ORDER.length - 1; i++) {
      const currentPhase = PHASE_ORDER[i]
      const duration = PHASE_DURATIONS[currentPhase]
      elapsed += duration
      const nextPhase = PHASE_ORDER[i + 1]
      const timer = setTimeout(() => {
        setPhase(nextPhase)
      }, elapsed)
      timers.push(timer)
    }

    return () => timers.forEach(clearTimeout)
  }, [])

  // Animate building progress values via rAF
  useEffect(() => {
    if (phase === 'idle' || phase === 'ground' || phase === 'complete') {
      if (phase === 'complete') {
        setBuildingProgress(Array(BUILDING_COUNT).fill(1))
      }
      return
    }

    const stagger = phase === 'blueprint' ? 0.18 : 0.15

    function animate() {
      const elapsed = (performance.now() - phaseStartRef.current) / PHASE_DURATIONS[phaseRef.current]

      const progress = PHASE_ORDER.map((_, i) => {
        if (phaseRef.current !== 'blueprint' && phaseRef.current !== 'build') return 0
        const start = i * stagger
        const t = Math.max(0, Math.min(1, (elapsed - start) / (1 - start)))
        return t
      })

      setBuildingProgress(progress)

      if (phaseRef.current === 'blueprint' || phaseRef.current === 'build') {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [phase])

  return { introPhase: phase, buildingProgress }
}
