import styled from 'styled-components'
import { theme } from '@/styles/theme'

export const PillWrapper = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border: 1px solid ${theme.colors.glassBorder};
  border-radius: 2px;
  font-family: ${theme.fonts.mono};
  font-size: 10px;
  color: ${theme.colors.amberDark};
  letter-spacing: 0.04em;
  white-space: nowrap;
`
