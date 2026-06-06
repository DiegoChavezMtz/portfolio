import styled from 'styled-components'
import { theme } from '@/styles/theme'

export const PillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 16px;
`

export const Hint = styled.p<{ $visible: boolean }>`
  font-family: ${theme.fonts.mono};
  font-size: 10px;
  color: ${theme.colors.amberDark};
  margin-top: 20px;
  animation: pulse 2s ease-in-out infinite;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.4s;
`
