'use client'
import { AnimatePresence } from 'framer-motion'
import type { IntroPhase } from '@/hooks/useIsometricCity'
import { BlueprintOverlay } from './IntroSequence.styled'

interface IntroSequenceProps {
  phase: IntroPhase
}

export function IntroSequence({ phase }: IntroSequenceProps) {
  const showOverlay = phase === 'blueprint'

  return (
    <AnimatePresence>
      {showOverlay && (
        <BlueprintOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </AnimatePresence>
  )
}
