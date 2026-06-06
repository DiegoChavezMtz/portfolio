'use client'
import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { Transition } from 'framer-motion'
import type { Building } from '@/types/building'
import { Pill } from '@/components/atoms/Pill/Pill'
import {
  Backdrop,
  PopupOuter,
  PopupCard,
  CloseButton,
  ProjectTag,
  ProjectTitle,
  PillRow,
  Divider,
  ScreenshotPlaceholder,
  ScreenshotStrip,
  ScreenshotThumb,
  Description,
  Navigation,
  NavButton,
  ContentMotion,
  DeliverablesSection,
  DeliverablesSectionTitle,
  DeliverableCard,
  DeliverableTitle,
  DeliverableDesc,
} from './ProjectPopup.styled'

interface ProjectPopupProps {
  building: Building
  projectIndex: number
  onClose: () => void
  onNavigate: (direction: 'prev' | 'next') => void
}

const popupVariants = {
  initial: { opacity: 0, scale: 0.96, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 8 },
}

const contentVariants = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
}

const contentEnterTransition: Transition = { duration: 0.2, ease: 'easeOut' as const }

export function ProjectPopup({ building, projectIndex, onClose, onNavigate }: ProjectPopupProps) {
  const items = building.items
  const item = items[projectIndex]
  const total = items.length
  const hasPrev = total > 1
  const hasNext = total > 1
  const prevItem = hasPrev ? items[(projectIndex - 1 + total) % total] : null
  const nextItem = hasNext ? items[(projectIndex + 1) % total] : null

  const [orientations, setOrientations] = useState<Record<string, 'portrait' | 'landscape'>>({})

  const handleImageLoad = (src: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget
    setOrientations(prev => ({
      ...prev,
      [src]: naturalHeight > naturalWidth ? 'portrait' : 'landscape',
    }))
  }

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate('next')
      if (e.key === 'ArrowLeft') onNavigate('prev')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onNavigate])

  if (!item) return null

  return (
    <>
      <Backdrop
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />
      <PopupOuter>
      <PopupCard
        variants={popupVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: 'easeOut' as const }}
      >
        <CloseButton onClick={onClose}>✕</CloseButton>

        <AnimatePresence mode="wait">
          <ContentMotion
            key={`${building.id}-${projectIndex}`}
            initial={contentVariants.initial}
            animate={contentVariants.animate}
            exit={contentVariants.exit}
            transition={contentEnterTransition}
          >
            <ProjectTag>
              PROJECT {String(projectIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </ProjectTag>

            <ProjectTitle>{item.title}</ProjectTitle>

            {item.stack.length > 0 && (
              <PillRow>
                {item.stack.map(s => <Pill key={s} label={s} />)}
              </PillRow>
            )}

            <Divider />

            {building.id !== 'experience' && (
              <>
                {item.screenshots && item.screenshots.length > 0 ? (
                  <ScreenshotStrip>
                    {item.screenshots.map((src, i) => {
                      const orientation = orientations[src] ?? 'landscape'
                      return (
                        <ScreenshotThumb key={i} orientation={orientation}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={`${item.title} screenshot ${i + 1}`}
                            onLoad={(e) => handleImageLoad(src, e)}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: orientation === 'portrait' ? 'contain' : 'cover',
                              background: '#0a0806',
                            }}
                          />
                        </ScreenshotThumb>
                      )
                    })}
                  </ScreenshotStrip>
                ) : (
                  <ScreenshotPlaceholder>
                    <span>screenshots coming soon</span>
                  </ScreenshotPlaceholder>
                )}
              </>
            )}

            <Description>{item.desc}</Description>

            {item.deliverables && item.deliverables.length > 0 && (
              <DeliverablesSection>
                <DeliverablesSectionTitle>Systems & Deliverables</DeliverablesSectionTitle>
                {item.deliverables.map((deliverable, i) => (
                  <DeliverableCard key={i}>
                    <DeliverableTitle>{deliverable.title}</DeliverableTitle>
                    <DeliverableDesc>{deliverable.desc}</DeliverableDesc>
                    <PillRow>
                      {deliverable.stack.map(s => <Pill key={s} label={s} />)}
                    </PillRow>
                    {deliverable.screenshots && deliverable.screenshots.length > 0 && (
                      <ScreenshotStrip>
                        {deliverable.screenshots.map((src, j) => {
                          const orientation = orientations[src] ?? 'landscape'
                          return (
                            <ScreenshotThumb key={j} orientation={orientation}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={src}
                                alt={`${deliverable.title} ${j + 1}`}
                                onLoad={(e) => handleImageLoad(src, e)}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: orientation === 'portrait' ? 'contain' : 'cover',
                                  background: '#0a0806',
                                }}
                              />
                            </ScreenshotThumb>
                          )
                        })}
                      </ScreenshotStrip>
                    )}
                  </DeliverableCard>
                ))}
              </DeliverablesSection>
            )}
          </ContentMotion>
        </AnimatePresence>

        {total > 1 && (
          <Navigation>
            <NavButton
              $hidden={!prevItem}
              onClick={() => prevItem && onNavigate('prev')}
            >
              ← {prevItem?.title ?? ''}
            </NavButton>
            <NavButton
              $hidden={!nextItem}
              style={{ textAlign: 'right' }}
              onClick={() => nextItem && onNavigate('next')}
            >
              {nextItem?.title ?? ''} →
            </NavButton>
          </Navigation>
        )}
      </PopupCard>
      </PopupOuter>
    </>
  )
}
