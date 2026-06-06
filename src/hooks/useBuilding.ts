'use client'
import { useState, useCallback } from 'react'
import type { Building } from '@/types/building'

export function useBuilding() {
  const [activeBuilding, setActiveBuilding] = useState<Building | null>(null)

  const openBuilding = useCallback((building: Building | null) => {
    if (!building) return
    setActiveBuilding(prev => prev?.id === building.id ? null : building)
  }, [])

  const closeBuilding = useCallback(() => {
    setActiveBuilding(null)
  }, [])

  return { activeBuilding, openBuilding, closeBuilding }
}
