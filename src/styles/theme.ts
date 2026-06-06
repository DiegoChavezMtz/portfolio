export const theme = {
  colors: {
    bg: '#080608',
    amber: '#f5a623',
    amberLight: '#ffd060',
    amberDark: '#b87000',
    amberGlow: 'rgba(245,166,35,0.15)',
    blueprint: '#4a9eff',
    blueprintDim: 'rgba(74,158,255,0.4)',
    blueprintBg: 'rgba(10,18,35,0.6)',
    blueprintGlow: 'rgba(74,158,255,0.15)',
    glass: 'rgba(8,6,8,0.72)',
    glassBorder: 'rgba(245,166,35,0.15)',
    textPrimary: '#ffffff',
    textMuted: 'rgba(255,255,255,0.55)',
    textDim: 'rgba(255,255,255,0.25)',
    gridLine: 'rgba(245,166,35,0.06)',
    gridLineBlueprint: 'rgba(74,158,255,0.12)',
  },
  fonts: {
    mono: 'var(--font-mono)',
    display: 'var(--font-display)',
  },
  breakpoints: {
    mobile: '768px',
  },
}

export type Theme = typeof theme
