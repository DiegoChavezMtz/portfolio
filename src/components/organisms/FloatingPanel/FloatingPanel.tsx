'use client'
import { AnimatePresence } from 'framer-motion'
import type { Transition } from 'framer-motion'
import type { Building } from '@/types/building'
import { BioContent } from '@/components/molecules/BioContent/BioContent'
import { BuildingLabel } from '@/components/molecules/BuildingLabel/BuildingLabel'
import { PanelOuter, PanelWrapper, ContentWrapper } from './FloatingPanel.styled'

interface FloatingPanelProps {
  activeBuilding: Building | null
  isVisible: boolean
  isMobile: boolean
  hintVisible: boolean
  onClose: () => void
  onProjectClick?: (building: Building, index: number) => void
  activeProjectIndex?: number | null
}

export function FloatingPanel({
  activeBuilding,
  isVisible,
  isMobile,
  hintVisible,
  onClose,
  onProjectClick,
  activeProjectIndex,
}: FloatingPanelProps) {
  const panelInitial = isMobile ? { opacity: 0, y: 20 } : { opacity: 0, x: -40 }
  const panelAnimate = !isVisible
    ? panelInitial
    : isMobile ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }

  const springTransition: Transition = { type: 'spring', stiffness: 300, damping: 35 }
  const desktopTransition: Transition = { duration: 0.5, ease: 'easeOut' as const }

  const contentExit = isMobile ? { opacity: 0 } : { opacity: 0, x: -16 }
  const contentEnter = isMobile ? { opacity: 1 } : { opacity: 1, x: 0 }
  const contentTransition: Transition = isMobile
    ? { duration: 0.25 }
    : { duration: 0.3, ease: 'easeOut' as const, delay: 0.08 }

  return (
    <PanelOuter>
      <PanelWrapper
        initial={panelInitial}
        animate={isMobile
          ? { ...panelAnimate, height: activeBuilding ? '55vh' : '42vh' }
          : panelAnimate
        }
        transition={isMobile ? springTransition : desktopTransition}
      >
        <AnimatePresence mode="wait">
          {activeBuilding ? (
            <ContentWrapper
              key={activeBuilding.id}
              initial={contentExit}
              animate={contentEnter}
              exit={contentExit}
              transition={contentTransition}
            >
              <BuildingLabel
                building={activeBuilding}
                onClose={onClose}
                onProjectClick={onProjectClick ? (i) => onProjectClick(activeBuilding, i) : undefined}
                activeProjectIndex={activeProjectIndex}
              />
            </ContentWrapper>
          ) : (
            <ContentWrapper
              key="bio"
              initial={contentExit}
              animate={contentEnter}
              exit={contentExit}
              transition={contentTransition}
            >
              <BioContent hintVisible={hintVisible} isMobile={isMobile} />
            </ContentWrapper>
          )}
        </AnimatePresence>
      </PanelWrapper>
    </PanelOuter>
  )
}
