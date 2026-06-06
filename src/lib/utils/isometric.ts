export const GRID_SIZE_DESKTOP = 52
export const GRID_SIZE_MOBILE = 38
export const MOBILE_SCALE = 0.72

export const GRID_ROWS_DESKTOP = 16
export const GRID_COLS_DESKTOP = 22
export const GRID_ROWS_MOBILE = 12
export const GRID_COLS_MOBILE = 16

export function isoProject(
  wx: number,
  wy: number,
  centerX: number,
  centerY: number
) {
  return {
    x: centerX + (wx - wy) * 1.05,
    y: centerY + (wx + wy) * 0.52,
  }
}
