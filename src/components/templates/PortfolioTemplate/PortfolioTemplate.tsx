'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { IsometricCity } from '@/components/organisms/IsometricCity/IsometricCity'
import { FloatingPanel } from '@/components/organisms/FloatingPanel/FloatingPanel'
import { IntroSequence } from '@/components/organisms/IntroSequence/IntroSequence'
import { ProjectPopup } from '@/components/organisms/ProjectPopup/ProjectPopup'
import { Cursor } from '@/components/atoms/Cursor/Cursor'
import { useIntroAnimation } from '@/hooks/useIntroAnimation'
import { useBuilding } from '@/hooks/useBuilding'
import { useCursor } from '@/hooks/useCursor'
import { useProjectPopup } from '@/hooks/useProjectPopup'
import type { Building } from '@/types/building'
import { HudTopLeft, HudName, HudRole, HudBottom } from './PortfolioTemplate.styled'

export function PortfolioTemplate() {
  const { introPhase, buildingProgress } = useIntroAnimation()
  const { activeBuilding, openBuilding, closeBuilding } = useBuilding()
  const { cursor, setHoveredBuilding } = useCursor()
  const { popupState, openPopup, closePopup, navigateProject } = useProjectPopup()
  const [isMobile, setIsMobile] = useState(false)
  const [hintVisible, setHintVisible] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  function handleBuildingClick(building: Building | null) {
    if (building) {
      openBuilding(building)
      setHintVisible(false)
    }
  }

  // Active project index: only relevant when popup is open for the current building
  const activeProjectIndex =
    popupState.isOpen && popupState.building?.id === activeBuilding?.id
      ? popupState.projectIndex
      : null

  const isComplete = introPhase === 'complete'
  const hudVisible = isComplete

  return (
    <>
      <IsometricCity
        introPhase={introPhase}
        buildingProgress={buildingProgress}
        activeBuilding={activeBuilding}
        isMobile={isMobile}
        onBuildingClick={handleBuildingClick}
        onBuildingHover={setHoveredBuilding}
      />

      <IntroSequence phase={introPhase} />

      <FloatingPanel
        activeBuilding={activeBuilding}
        isVisible={isComplete}
        isMobile={isMobile}
        onClose={closeBuilding}
        hintVisible={hintVisible}
        onProjectClick={openPopup}
        activeProjectIndex={activeProjectIndex}
      />

      <AnimatePresence>
        {popupState.isOpen && popupState.building && (
          <ProjectPopup
            key={popupState.building.id}
            building={popupState.building}
            projectIndex={popupState.projectIndex}
            onClose={closePopup}
            onNavigate={navigateProject}
          />
        )}
      </AnimatePresence>

      <HudTopLeft
        initial={{ opacity: 0 }}
        animate={{ opacity: hudVisible ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <HudName>Diego Chávez</HudName>
        <HudRole>Full-Stack Engineer & DevOps</HudRole>
      </HudTopLeft>

      <HudBottom
        $visible={hintVisible && isComplete}
        initial={{ opacity: 0 }}
        animate={{ opacity: hudVisible && hintVisible ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {isMobile ? 'tap a building to explore' : 'click a building to explore'}
      </HudBottom>

      {!isMobile && (
        <Cursor
          x={cursor.x}
          y={cursor.y}
          isHovering={cursor.isHovering}
          color={cursor.hoveredColor}
        />
      )}
    </>
  )
}
