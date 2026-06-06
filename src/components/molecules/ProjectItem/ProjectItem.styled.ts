import styled from 'styled-components'
import { theme } from '@/styles/theme'

export const Card = styled.div<{ $isActive?: boolean }>`
  border: 1px solid ${({ $isActive }) => ($isActive ? theme.colors.amber : theme.colors.glassBorder)};
  border-left: 2px solid ${({ $isActive }) => ($isActive ? theme.colors.amber : theme.colors.glassBorder)};
  border-radius: 2px;
  padding: 14px 16px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: border-color 0.15s;

  &:hover {
    border-color: ${theme.colors.amber};
    border-left-color: ${theme.colors.amber};
  }
`

export const CardTitle = styled.h3`
  font-family: ${theme.fonts.display};
  font-size: 13px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  margin-bottom: 6px;
`

export const CardDesc = styled.p`
  font-family: ${theme.fonts.mono};
  font-size: 10px;
  color: ${theme.colors.textMuted};
  line-height: 1.6;
  margin-bottom: 8px;
`

export const CardStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`
