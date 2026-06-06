import styled from 'styled-components'
import { theme } from '@/styles/theme'

export const PillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 16px;
`

export const ItemsList = styled.div`
  margin-top: 20px;
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-family: ${theme.fonts.mono};
  font-size: 10px;
  color: ${theme.colors.amber};
  letter-spacing: 0.06em;
  padding: 0;
  margin-top: 24px;
  display: block;

  &:hover {
    opacity: 0.7;
  }
`
