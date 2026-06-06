import styled from 'styled-components'
import { theme } from '@/styles/theme'

export const Tag = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: 9px;
  color: ${theme.colors.amberDark};
  letter-spacing: 0.1em;
  text-transform: uppercase;
`

export const Title = styled.h2`
  font-family: ${theme.fonts.display};
  font-size: 36px;
  font-weight: 800;
  color: ${theme.colors.textPrimary};
  line-height: 1.1;

  span {
    color: ${theme.colors.amber};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 28px;
  }
`

export const Body = styled.p`
  font-family: ${theme.fonts.mono};
  font-size: 12px;
  color: ${theme.colors.textMuted};
  line-height: 1.7;
  white-space: pre-line;
`

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: linear-gradient(to right, ${theme.colors.glassBorder}, transparent);
  margin: 16px 0;
`

export const AmberBar = styled.div`
  width: 32px;
  height: 2px;
  background: ${theme.colors.amber};
  margin-bottom: 16px;
`
