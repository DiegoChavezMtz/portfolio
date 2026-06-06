import styled from 'styled-components'
import { motion } from 'framer-motion'
import { theme } from '@/styles/theme'

// Outer shell handles positioning/centering — no transforms that conflict with Framer Motion
export const PanelOuter = styled.div`
  position: fixed;
  z-index: 10;
  pointer-events: none;

  @media (min-width: ${theme.breakpoints.mobile}) {
    top: 0;
    bottom: 0;
    left: 40px;
    display: flex;
    align-items: center;
  }

  @media (max-width: calc(${theme.breakpoints.mobile} - 1px)) {
    bottom: 0;
    left: 0;
    right: 0;
  }
`

// Inner motion div handles animations and appearance
export const PanelWrapper = styled(motion.div)`
  pointer-events: all;
  background: ${theme.colors.glass};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid ${theme.colors.glassBorder};
  overflow-y: auto;

  @media (min-width: ${theme.breakpoints.mobile}) {
    width: min(400px, 38vw);
    max-height: 80vh;
    border-radius: 2px;
    padding: 36px 40px;
  }

  @media (max-width: calc(${theme.breakpoints.mobile} - 1px)) {
    width: 100%;
    border-top: 1px solid rgba(245, 166, 35, 0.2);
    border-radius: 12px 12px 0 0;
    padding: 24px 20px;
    border-left: none;
    border-right: none;
    border-bottom: none;
  }
`

export const ContentWrapper = styled(motion.div)``
