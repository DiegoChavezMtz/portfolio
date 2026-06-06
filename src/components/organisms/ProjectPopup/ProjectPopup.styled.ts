import styled from 'styled-components'
import { motion } from 'framer-motion'
import { theme } from '@/styles/theme'

export const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 399;
  pointer-events: all;
`

/* Full-viewport flex wrapper — centers the card vertically, passes clicks through */
export const PopupOuter = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 460px;
  pointer-events: none;
  z-index: 400;

  @media (max-width: calc(${theme.breakpoints.mobile} - 1px)) {
    display: block;
    padding-left: 0;
  }
`

/* The visual card — interactive, no top/transform/margin overrides */
export const PopupCard = styled(motion.div)`
  pointer-events: all;
  position: relative;
  background: rgba(8, 6, 8, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(245, 166, 35, 0.2);
  border-radius: 2px;
  overflow-y: auto;

  @media (min-width: ${theme.breakpoints.mobile}) {
    width: min(680px, calc(100vw - 500px));
    max-height: 85vh;
    padding: 40px 44px;
  }

  @media (max-width: calc(${theme.breakpoints.mobile} - 1px)) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-height: 85vh;
    border-top: 1px solid rgba(245, 166, 35, 0.2);
    border-radius: 12px 12px 0 0;
    border-left: none;
    border-right: none;
    border-bottom: none;
    padding: 24px 20px;
  }
`

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: ${theme.fonts.mono};
  font-size: 12px;
  color: ${theme.colors.textMuted};
  padding: 4px;
  line-height: 1;

  &:hover {
    color: ${theme.colors.amber};
  }
`

export const ProjectTag = styled.span`
  display: block;
  font-family: ${theme.fonts.mono};
  font-size: 9px;
  color: ${theme.colors.amberDark};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 10px;
`

export const ProjectTitle = styled.h2`
  font-family: ${theme.fonts.display};
  font-size: 28px;
  font-weight: 900;
  color: ${theme.colors.textPrimary};
  line-height: 1.1;
  margin-bottom: 14px;
`

export const PillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
`

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: linear-gradient(to right, rgba(245, 166, 35, 0.15), transparent);
  margin-bottom: 20px;
`

export const ScreenshotPlaceholder = styled.div`
  width: 100%;
  height: 260px;
  border: 1px dashed rgba(245, 166, 35, 0.2);
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;

  span {
    font-family: ${theme.fonts.mono};
    font-size: 10px;
    color: rgba(245, 166, 35, 0.3);
    letter-spacing: 0.06em;
  }
`

export const ScreenshotStrip = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  margin-bottom: 20px;
  padding-bottom: 4px;

  &::-webkit-scrollbar { height: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(245, 166, 35, 0.4); }
`

export const ScreenshotThumb = styled.div<{ orientation?: 'portrait' | 'landscape' }>`
  position: relative;
  flex-shrink: 0;
  scroll-snap-align: start;
  border: 1px solid rgba(245, 166, 35, 0.15);
  border-radius: 2px;
  overflow: hidden;
  background: #0a0806;

  width: ${({ orientation }) => orientation === 'portrait' ? '180px' : '300px'};
  height: ${({ orientation }) => orientation === 'portrait' ? '360px' : '190px'};
`

export const Description = styled.p`
  font-family: ${theme.fonts.mono};
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 2;
  margin-bottom: 28px;
`

export const Navigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid rgba(245, 166, 35, 0.1);
`

export const NavButton = styled.button<{ $hidden?: boolean }>`
  background: none;
  border: none;
  cursor: ${({ $hidden }) => ($hidden ? 'default' : 'pointer')};
  font-family: ${theme.fonts.mono};
  font-size: 10px;
  color: ${({ $hidden }) => ($hidden ? 'transparent' : theme.colors.amber)};
  letter-spacing: 0.06em;
  padding: 0;
  max-width: 45%;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: ${({ $hidden }) => ($hidden ? 'none' : 'auto')};

  &:hover {
    opacity: 0.7;
  }
`

export const ContentMotion = styled(motion.div)``

export const DeliverablesSection = styled.div`
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const DeliverablesSectionTitle = styled.p`
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(245, 166, 35, 0.5);
  margin-bottom: 4px;
`

export const DeliverableCard = styled.div`
  border-left: 2px solid rgba(245, 166, 35, 0.25);
  padding: 14px 18px;
  background: rgba(245, 166, 35, 0.02);
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const DeliverableTitle = styled.h4`
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`

export const DeliverableDesc = styled.p`
  font-family: var(--font-mono);
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.8;
  margin: 0;
`
