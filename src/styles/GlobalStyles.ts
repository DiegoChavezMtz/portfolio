import { createGlobalStyle } from 'styled-components'
import { theme } from './theme'

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    overflow: hidden;
    background: ${theme.colors.bg};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  @media (min-width: ${theme.breakpoints.mobile}) {
    body {
      cursor: none;
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  ::-webkit-scrollbar {
    width: 3px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(245, 166, 35, 0.4);
    border-radius: 0px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(245, 166, 35, 0.8);
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(245, 166, 35, 0.4) transparent;
  }
`
