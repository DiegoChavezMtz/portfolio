import styled from 'styled-components'
import { motion } from 'framer-motion'
import { theme } from '@/styles/theme'

export const HudTopLeft = styled(motion.div)`
  position: fixed;
  top: 24px;
  left: 24px;
  z-index: 20;
  pointer-events: none;

  @media (max-width: calc(${theme.breakpoints.mobile} - 1px)) {
    top: 16px;
    left: 16px;
  }
`

export const HudName = styled.span`
  display: block;
  font-family: ${theme.fonts.display};
  font-size: 15px;
  font-weight: 900;
  color: ${theme.colors.amber};
  letter-spacing: 0.2em;
  text-transform: uppercase;
`

export const HudRole = styled.span`
  display: block;
  font-family: ${theme.fonts.mono};
  font-size: 11px;
  color: rgba(245, 166, 35, 0.65);
  letter-spacing: 0.15em;
  margin-top: 3px;
`

export const HudBottom = styled(motion.div)<{ $visible: boolean }>`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  pointer-events: none;
  font-family: ${theme.fonts.mono};
  font-size: 10px;
  color: ${theme.colors.textDim};
  letter-spacing: 0.06em;
  white-space: nowrap;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.4s;
  animation: ${({ $visible }) => ($visible ? 'pulse 3s ease-in-out infinite' : 'none')};

  @media (max-width: calc(${theme.breakpoints.mobile} - 1px)) {
    display: none;
  }
`
