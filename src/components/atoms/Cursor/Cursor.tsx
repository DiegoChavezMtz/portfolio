'use client'
import { useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'
import { CursorDot, CursorRing } from './Cursor.styled'

interface CursorProps {
  x: number
  y: number
  isHovering: boolean
  color: string
}

export function Cursor({ x, y, isHovering, color }: CursorProps) {
  // Dot follows mouse directly
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)

  // Ring lags behind with spring
  const springX = useSpring(dotX, { stiffness: 500, damping: 40 })
  const springY = useSpring(dotY, { stiffness: 500, damping: 40 })

  useEffect(() => {
    dotX.set(x - 5)
    dotY.set(y - 5)
  }, [x, y, dotX, dotY])

  const dotSize = isHovering ? 18 : 10
  const ringSize = isHovering ? 48 : 32

  return (
    <>
      <CursorDot
        style={{
          x: dotX,
          y: dotY,
          backgroundColor: color,
          width: dotSize,
          height: dotSize,
          marginLeft: isHovering ? -4 : 0,
          marginTop: isHovering ? -4 : 0,
        }}
        animate={{ width: dotSize, height: dotSize }}
        transition={{ duration: 0.15 }}
      />
      <CursorRing
        style={{
          x: springX,
          y: springY,
          color,
          marginLeft: -(ringSize / 2) + 5,
          marginTop: -(ringSize / 2) + 5,
        }}
        animate={{ width: ringSize, height: ringSize }}
        transition={{ duration: 0.15 }}
      />
    </>
  )
}
