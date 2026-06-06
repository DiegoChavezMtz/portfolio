'use client'
import { useState, useEffect, useRef } from 'react'
import type { Building } from '@/types/building'

interface CursorState {
  x: number
  y: number
  isHovering: boolean
  hoveredColor: string
}

export function useCursor() {
  const [cursor, setCursor] = useState<CursorState>({
    x: -100,
    y: -100,
    isHovering: false,
    hoveredColor: '#f5a623',
  })
  const hoveredBuildingRef = useRef<Building | null>(null)

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const building = hoveredBuildingRef.current
      setCursor({
        x: e.clientX,
        y: e.clientY,
        isHovering: !!building,
        hoveredColor: building?.col ?? '#f5a623',
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  function setHoveredBuilding(building: Building | null) {
    hoveredBuildingRef.current = building
  }

  return { cursor, setHoveredBuilding }
}
