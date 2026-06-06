import styled from 'styled-components'
import { motion } from 'framer-motion'
import { theme } from '@/styles/theme'

export const CursorDot = styled(motion.div)`
  position: fixed;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  top: 0;
  left: 0;

  @media (max-width: calc(${theme.breakpoints.mobile} - 1px)) {
    display: none;
  }
`

export const CursorRing = styled(motion.div)`
  position: fixed;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  pointer-events: none;
  z-index: 9998;
  top: 0;
  left: 0;

  @media (max-width: calc(${theme.breakpoints.mobile} - 1px)) {
    display: none;
  }
`
