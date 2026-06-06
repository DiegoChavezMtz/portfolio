import styled from 'styled-components'
import { motion } from 'framer-motion'

export const BlueprintOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background: rgba(10, 18, 35, 0.4);
`
