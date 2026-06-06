'use client'
import { useState, useCallback } from 'react'
import type { Building } from '@/types/building'

export interface ProjectPopupState {
  isOpen: boolean
  building: Building | null
  projectIndex: number
}

export function useProjectPopup() {
  const [popupState, setPopupState] = useState<ProjectPopupState>({
    isOpen: false,
    building: null,
    projectIndex: 0,
  })

  const openPopup = useCallback((building: Building, index: number) => {
    setPopupState(prev => {
      // Same building already open — just update index
      if (prev.isOpen && prev.building?.id === building.id) {
        return { ...prev, projectIndex: index }
      }
      return { isOpen: true, building, projectIndex: index }
    })
  }, [])

  const closePopup = useCallback(() => {
    setPopupState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const navigateProject = useCallback((direction: 'prev' | 'next') => {
    setPopupState(prev => {
      if (!prev.building || prev.building.items.length === 0) return prev
      const count = prev.building.items.length
      const next = direction === 'next'
        ? (prev.projectIndex + 1) % count
        : (prev.projectIndex - 1 + count) % count
      return { ...prev, projectIndex: next }
    })
  }, [])

  return { popupState, openPopup, closePopup, navigateProject }
}
