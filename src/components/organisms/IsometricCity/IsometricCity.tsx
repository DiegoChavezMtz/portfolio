'use client'
import { useRef } from 'react'
import type { Building } from '@/types/building'
import { useIsometricCity, type IntroPhase } from '@/hooks/useIsometricCity'
import { Canvas } from './IsometricCity.styled'

interface IsometricCityProps {
  introPhase: IntroPhase
  buildingProgress: number[]
  activeBuilding: Building | null
  isMobile: boolean
  onBuildingClick?: (building: Building | null) => void
  onBuildingHover?: (building: Building | null) => void
}

export function IsometricCity({
  introPhase,
  buildingProgress,
  activeBuilding,
  isMobile,
  onBuildingClick,
  onBuildingHover,
}: IsometricCityProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { hoveredBuilding } = useIsometricCity({
    canvasRef,
    introPhase,
    buildingProgress,
    activeBuilding,
    isMobile,
    onBuildingHover,
  })

  function handleClick() {
    onBuildingClick?.(hoveredBuilding.current)
  }

  return <Canvas ref={canvasRef} onClick={handleClick} />
}
