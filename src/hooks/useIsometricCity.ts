'use client'
import { useEffect, useRef, useCallback } from 'react'
import type { Building } from '@/types/building'
import { BUILDINGS } from '@/lib/constants/buildings'
import {
  isoProject,
  GRID_SIZE_DESKTOP,
  GRID_SIZE_MOBILE,
  MOBILE_SCALE,
  GRID_ROWS_DESKTOP,
  GRID_COLS_DESKTOP,
  GRID_ROWS_MOBILE,
  GRID_COLS_MOBILE,
} from '@/lib/utils/isometric'
import { theme } from '@/styles/theme'

export type IntroPhase = 'idle' | 'ground' | 'blueprint' | 'build' | 'complete'

interface UseIsometricCityProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  introPhase: IntroPhase
  buildingProgress: number[]
  activeBuilding: Building | null
  isMobile: boolean
  onBuildingHover?: (building: Building | null) => void
}

interface Segment {
  x1: number; y1: number; x2: number; y2: number; len: number
}

interface BuildingGeometry {
  segments: Segment[]
  totalLen: number
  windows: Array<{ x: number; y: number }>
  topFace: Array<{ x: number; y: number }>
  leftFace: Array<{ x: number; y: number }>
  rightFace: Array<{ x: number; y: number }>
  baseCenter: { x: number; y: number }
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3) }
function easeOutBack(t: number): number {
  const c1 = 1.70158; const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}
function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
}

function buildPath(ctx: CanvasRenderingContext2D, pts: Array<{ x: number; y: number }>) {
  ctx.beginPath()
  pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
  ctx.closePath()
}

function computeGeometry(
  b: Building,
  gridSize: number,
  scale: number,
  centerX: number,
  centerY: number
): BuildingGeometry {
  const gx = b.gx * gridSize
  const gy = b.gy * gridSize
  const gw = b.gw * gridSize * scale
  const gd = b.gd * gridSize * scale
  const h = b.h * scale

  const proj = (wx: number, wy: number, dh = 0) => {
    const p = isoProject(wx, wy, centerX, centerY)
    return { x: p.x, y: p.y - dh }
  }

  const tTL = proj(gx, gy, h)
  const tTR = proj(gx + gw, gy, h)
  const tBR = proj(gx + gw, gy + gd, h)
  const tBL = proj(gx, gy + gd, h)
  const bTR = proj(gx + gw, gy, 0)
  const bBR = proj(gx + gw, gy + gd, 0)
  const bBL = proj(gx, gy + gd, 0)

  const topFace = [tTL, tTR, tBR, tBL]
  const leftFace = [tBL, tBR, bBR, bBL]
  const rightFace = [tTR, tBR, bBR, bTR]

  const allEdges = [
    [tTL, tTR], [tTR, tBR], [tBR, tBL], [tBL, tTL],
    [tBL, bBL], [tBR, bBR], [tTR, bTR],
    [bBL, bBR], [bBR, bTR],
  ]

  const segments: Segment[] = []
  let totalLen = 0
  for (const [a, c] of allEdges) {
    const dx = c.x - a.x; const dy = c.y - a.y
    const len = Math.sqrt(dx * dx + dy * dy)
    segments.push({ x1: a.x, y1: a.y, x2: c.x, y2: c.y, len })
    totalLen += len
  }

  const windows: Array<{ x: number; y: number }> = []
  for (let f = 1; f < b.floors; f++) {
    const frac = f / b.floors
    windows.push({ x: lerp(tBL.x, bBL.x, frac), y: lerp(tBL.y, bBL.y, frac) })
    windows.push({ x: lerp(tTR.x, bTR.x, frac), y: lerp(tTR.y, bTR.y, frac) })
  }

  return {
    segments, totalLen, windows, topFace, leftFace, rightFace,
    baseCenter: proj(gx + gw / 2, gy + gd / 2, 0),
  }
}

function drawProgressiveSegments(
  ctx: CanvasRenderingContext2D,
  segments: Segment[],
  totalLen: number,
  progress: number
) {
  const target = totalLen * progress
  let drawn = 0
  for (const seg of segments) {
    if (drawn >= target) break
    const remaining = target - drawn
    const frac = Math.min(remaining / seg.len, 1)
    ctx.beginPath()
    ctx.moveTo(seg.x1, seg.y1)
    ctx.lineTo(seg.x1 + (seg.x2 - seg.x1) * frac, seg.y1 + (seg.y2 - seg.y1) * frac)
    ctx.stroke()
    drawn += seg.len * frac
    if (frac < 1) break
  }
}

export function useIsometricCity({
  canvasRef,
  introPhase,
  buildingProgress,
  activeBuilding,
  isMobile,
  onBuildingHover,
}: UseIsometricCityProps) {
  const rafRef = useRef<number>(0)
  const hoveredRef = useRef<Building | null>(null)
  const geometriesRef = useRef<BuildingGeometry[]>([])
  const billboardRef = useRef<Map<string, { progress: number; direction: 'in' | 'out' }>>(new Map())
  const lastTimeRef = useRef<number>(0)
  // Refs for frequently-changing values — avoids restarting the rAF loop
  const buildingProgressRef = useRef<number[]>(buildingProgress)
  const activeBuildingRef = useRef<Building | null>(activeBuilding)
  const introPhaseRef = useRef<IntroPhase>(introPhase)

  buildingProgressRef.current = buildingProgress
  activeBuildingRef.current = activeBuilding
  introPhaseRef.current = introPhase

  const gridSize = isMobile ? GRID_SIZE_MOBILE : GRID_SIZE_DESKTOP
  const scale = isMobile ? MOBILE_SCALE : 1
  const rows = isMobile ? GRID_ROWS_MOBILE : GRID_ROWS_DESKTOP
  const cols = isMobile ? GRID_COLS_MOBILE : GRID_COLS_DESKTOP
  const gridSizeRef = useRef(gridSize)
  const scaleRef = useRef(scale)
  gridSizeRef.current = gridSize
  scaleRef.current = scale

  const getCenter = useCallback((canvas: HTMLCanvasElement) => {
    const dpr = window.devicePixelRatio || 1
    const w = canvas.width / dpr
    const h = canvas.height / dpr
    return {
      x: w / 2 + w * 0.12,
      y: h * 0.42,
    }
  }, [])

  const recomputeGeometries = useCallback((canvas: HTMLCanvasElement) => {
    const { x: cx, y: cy } = getCenter(canvas)
    geometriesRef.current = BUILDINGS.map(b =>
      computeGeometry(b, gridSizeRef.current, scaleRef.current, cx, cy)
    )
  }, [getCenter])

  // Main drawing loop — only restarts when isMobile or canvas changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    function resize() {
      if (!canvas) return
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx!.scale(dpr, dpr)
      recomputeGeometries(canvas)
    }

    resize()
    window.addEventListener('resize', resize)

    function drawGround(cx: number, cy: number) {
      if (!ctx) return
      const gs = gridSizeRef.current
      for (let r = -Math.floor(rows / 2); r < Math.ceil(rows / 2); r++) {
        for (let c = -Math.floor(cols / 2); c < Math.ceil(cols / 2); c++) {
          const wx = c * gs; const wy = r * gs
          const p0 = isoProject(wx, wy, cx, cy)
          const p1 = isoProject(wx + gs, wy, cx, cy)
          const p2 = isoProject(wx + gs, wy + gs, cx, cy)
          const p3 = isoProject(wx, wy + gs, cx, cy)
          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y)
          ctx.closePath()
          ctx.fillStyle = (r + c) % 2 === 0 ? '#141008' : '#0a0806'
          ctx.fill()
          ctx.strokeStyle = 'rgba(245, 166, 35, 0.18)'
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      }
    }

    function drawBuildingComplete(
      b: Building, geo: BuildingGeometry,
      isActive: boolean, isHovered: boolean, t: number
    ) {
      if (!ctx) return
      buildPath(ctx, geo.leftFace)
      ctx.fillStyle = isHovered ? b.col + '33' : '#130f0a'
      ctx.fill()
      ctx.strokeStyle = b.col + '44'
      ctx.lineWidth = 0.5
      ctx.stroke()

      buildPath(ctx, geo.rightFace)
      ctx.fillStyle = isHovered ? b.col + '18' : '#0d0b08'
      ctx.fill()
      ctx.strokeStyle = b.col + '22'
      ctx.lineWidth = 0.5
      ctx.stroke()

      buildPath(ctx, geo.topFace)
      ctx.fillStyle = b.col + (isActive ? 'e6' : isHovered ? 'ff' : 'bf')
      ctx.fill()
      ctx.strokeStyle = b.col
      ctx.lineWidth = 0.8
      ctx.stroke()

      geo.windows.forEach((w, i) => {
        const wc = Math.floor(i / Math.max(b.floors - 1, 1))
        const wr = i % Math.max(b.floors - 1, 1)
        if (((wc * 7 + wr * 3 + Math.floor(t * 0.3)) % 5) === 0) return
        ctx!.beginPath()
        ctx!.arc(w.x, w.y, 2, 0, Math.PI * 2)
        ctx!.fillStyle = b.col + 'cc'
        ctx!.fill()
      })

      if (isActive) {
        ctx.save()
        ctx.shadowColor = b.col
        ctx.shadowBlur = 20 + Math.sin(t * 0.003) * 8
        buildPath(ctx, geo.topFace)
        ctx.strokeStyle = b.col
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()
      }

      if (!isHovered) {
        const tp = geo.topFace
        const lx = (tp[0].x + tp[1].x + tp[2].x + tp[3].x) / 4
        const ly = (tp[0].y + tp[1].y + tp[2].y + tp[3].y) / 4
        ctx.save()
        ctx.translate(lx, ly - (isActive ? 6 : 0))
        ctx.rotate(-0.46)
        ctx.scale(1, 0.52)
        ctx.font = '700 9px monospace'
        ctx.fillStyle = '#1a0d00'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(b.label.toUpperCase(), 0, 0)
        ctx.restore()
      }
    }

    function drawBuildingGround(
      b: Building, geo: BuildingGeometry, t: number, cx: number, cy: number
    ) {
      if (!ctx) return
      const gs = gridSizeRef.current; const sc = scaleRef.current
      const gx = b.gx * gs; const gy = b.gy * gs
      const gw = b.gw * gs * sc; const gd = b.gd * gs * sc
      const p0 = isoProject(gx, gy, cx, cy)
      const p1 = isoProject(gx + gw, gy, cx, cy)
      const p2 = isoProject(gx + gw, gy + gd, cx, cy)
      const p3 = isoProject(gx, gy + gd, cx, cy)
      const alpha = Math.sin(t * 0.004) * 0.4 + 0.2
      ctx.beginPath()
      ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y)
      ctx.closePath()
      ctx.fillStyle = `rgba(245,166,35,${alpha.toFixed(3)})`
      ctx.fill()
      ctx.strokeStyle = '#f5a623'; ctx.lineWidth = 1; ctx.stroke()
      const ringProgress = (t * 0.001) % 1
      ctx.save()
      ctx.globalAlpha = Math.max(0, 0.6 - ringProgress * 0.6)
      ctx.beginPath()
      ctx.arc(geo.baseCenter.x, geo.baseCenter.y, ringProgress * gs * 1.4, 0, Math.PI * 2)
      ctx.strokeStyle = '#f5a623'; ctx.lineWidth = 1; ctx.stroke()
      ctx.restore()
    }

    function drawBuildingBlueprint(b: Building, geo: BuildingGeometry, progress: number) {
      if (!ctx) return
      ctx.save()
      ctx.strokeStyle = theme.colors.blueprint
      ctx.lineWidth = 1
      ctx.setLineDash([6, 4])
      drawProgressiveSegments(ctx, geo.segments, geo.totalLen, progress)
      ctx.restore()
      if (progress > 0.7) {
        geo.windows.forEach(w => {
          ctx!.beginPath()
          ctx!.arc(w.x, w.y, 2, 0, Math.PI * 2)
          ctx!.strokeStyle = theme.colors.blueprint
          ctx!.lineWidth = 0.8
          ctx!.setLineDash([])
          ctx!.stroke()
        })
      }
    }

    function drawBuildingBuild(b: Building, geo: BuildingGeometry, progress: number, t: number) {
      if (!ctx) return
      const ep = easeOutCubic(progress)
      const bRgb = [74, 158, 255]; const aRgb = hexToRgb('#f5a623')
      const strokeColor = `rgb(${Math.round(lerp(bRgb[0], aRgb[0], ep))},${Math.round(lerp(bRgb[1], aRgb[1], ep))},${Math.round(lerp(bRgb[2], aRgb[2], ep))})`

      ctx.save()
      ctx.strokeStyle = strokeColor; ctx.lineWidth = 1
      if (progress < 0.5) ctx.setLineDash([6, 4]); else ctx.setLineDash([])
      ;[geo.topFace, geo.leftFace, geo.rightFace].forEach(face => {
        buildPath(ctx!, face); ctx!.stroke()
      })
      ctx.restore()

      ;[
        { pts: geo.leftFace, fill: '#130f0a' },
        { pts: geo.rightFace, fill: '#0d0b08' },
        { pts: geo.topFace, fill: b.col + 'bf' },
      ].forEach(({ pts, fill }) => {
        if (!ctx) return
        const minX = Math.min(...pts.map(p => p.x)) - 2
        const maxX = Math.max(...pts.map(p => p.x)) + 2
        const minY = Math.min(...pts.map(p => p.y))
        const maxY = Math.max(...pts.map(p => p.y))
        const fullH = maxY - minY
        ctx.save()
        ctx.beginPath()
        ctx.rect(minX, maxY - fullH * ep, maxX - minX, fullH * ep)
        ctx.clip()
        buildPath(ctx, pts)
        ctx.fillStyle = fill; ctx.fill()
        ctx.restore()
      })

      geo.windows.forEach((w, i) => {
        if (!ctx) return
        const wc = Math.floor(i / Math.max(b.floors - 1, 1))
        const wr = i % Math.max(b.floors - 1, 1)
        if (((wc * 7 + wr * 3 + Math.floor(t * 0.3)) % 5) === 0) return
        ctx.beginPath(); ctx.arc(w.x, w.y, 2, 0, Math.PI * 2)
        if (ep > 0.5) { ctx.fillStyle = b.col + 'cc'; ctx.fill() }
        else { ctx.strokeStyle = strokeColor; ctx.lineWidth = 0.8; ctx.stroke() }
      })
    }

    function drawBillboard(b: Building, geo: BuildingGeometry, progress: number, isActive: boolean, t: number) {
      if (!ctx || progress <= 0) return
      const tp = geo.topFace
      const rcx = (tp[0].x + tp[1].x + tp[2].x + tp[3].x) / 4
      const rcy = (tp[0].y + tp[1].y + tp[2].y + tp[3].y) / 4
      const liftY = isActive ? 6 : 0
      const poleH = 40 * easeOutBack(Math.min(progress, 1))
      const bobOffset = Math.sin(t * 0.0025) * 3 * progress

      // Pole
      ctx.beginPath()
      ctx.moveTo(rcx, rcy - liftY)
      ctx.lineTo(rcx, rcy - liftY - poleH + bobOffset)
      ctx.strokeStyle = b.col
      ctx.lineWidth = 1.5
      ctx.setLineDash([])
      ctx.stroke()

      // Sign panel
      const signW = 90; const signH = 32
      const signX = rcx - signW / 2
      const signY = rcy - liftY - poleH - signH + bobOffset
      ctx.globalAlpha = Math.min(progress * 2, 1)
      roundRect(ctx, signX, signY, signW, signH, 2)
      ctx.fillStyle = 'rgba(8, 6, 8, 0.92)'
      ctx.fill()
      ctx.strokeStyle = b.col
      ctx.lineWidth = 1
      ctx.stroke()

      // Label
      ctx.fillStyle = b.col
      ctx.font = '700 11px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'alphabetic'
      ctx.fillText(b.label.toUpperCase(), rcx, signY + 14)

      // Sub-label
      ctx.fillStyle = b.col + '88'
      ctx.font = '400 9px monospace'
      ctx.fillText(b.sub, rcx, signY + 26)

      ctx.globalAlpha = 1

      // Base dot
      ctx.beginPath()
      ctx.arc(rcx, rcy - liftY, 3, 0, Math.PI * 2)
      ctx.fillStyle = b.col
      ctx.fill()
    }

    function draw() {
      if (!canvas || !ctx) return
      const now = performance.now()
      const dt = lastTimeRef.current > 0 ? now - lastTimeRef.current : 16
      lastTimeRef.current = now

      const phase = introPhaseRef.current
      const bProgress = buildingProgressRef.current
      const activeB = activeBuildingRef.current

      const w = canvas.width / dpr
      const h = canvas.height / dpr
      const { x: cx, y: cy } = getCenter(canvas)

      ctx.fillStyle = theme.colors.bg
      ctx.fillRect(0, 0, w, h)

      if (phase !== 'idle') drawGround(cx, cy)

      BUILDINGS.forEach((b, i) => {
        const geo = geometriesRef.current[i]
        if (!geo) return
        const isActive = activeB?.id === b.id
        const isHovered = hoveredRef.current?.id === b.id

        if (phase === 'complete') drawBuildingComplete(b, geo, isActive, isHovered, now)
        else if (phase === 'ground') drawBuildingGround(b, geo, now, cx, cy)
        else if (phase === 'blueprint') drawBuildingBlueprint(b, geo, bProgress[i] ?? 0)
        else if (phase === 'build') drawBuildingBuild(b, geo, bProgress[i] ?? 0, now)
      })

      // Billboard pass — drawn after all buildings so signs always appear on top
      if (phase === 'complete') {
        BUILDINGS.forEach((b, i) => {
          const geo = geometriesRef.current[i]
          if (!geo) return
          const isHovered = hoveredRef.current?.id === b.id
          const state = billboardRef.current.get(b.id) ?? { progress: 0, direction: 'out' as const }

          if (isHovered && state.progress < 1) {
            state.progress = Math.min(1, state.progress + dt / 300)
            state.direction = 'in'
          } else if (!isHovered && state.progress > 0) {
            state.progress = Math.max(0, state.progress - dt / 200)
            state.direction = 'out'
          }
          billboardRef.current.set(b.id, state)

          if (state.progress > 0) {
            const isActive = activeB?.id === b.id
            drawBillboard(b, geo, state.progress, isActive, now)
          }
        })
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  // Only restart loop when isMobile changes — all other values read via refs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, getCenter, recomputeGeometries])

  // Hover detection — only active in complete phase
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function handleMouseMove(e: MouseEvent) {
      if (introPhaseRef.current !== 'complete') return
      const rect = canvas!.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const { x: cx, y: cy } = getCenter(canvas!)
      const gs = gridSizeRef.current; const sc = scaleRef.current
      let found: Building | null = null

      for (let i = BUILDINGS.length - 1; i >= 0; i--) {
        const b = BUILDINGS[i]
        const geo = geometriesRef.current[i]
        if (!geo) continue
        const gw = b.gw * gs * sc; const gd = b.gd * gs * sc
        const bCenter = isoProject(b.gx * gs + gw / 2, b.gy * gs + gd / 2, cx, cy)
        if (Math.abs(mx - bCenter.x) < gw * 0.65 && Math.abs(my - bCenter.y) < b.h * sc * 0.6) {
          found = b; break
        }
      }

      if (found?.id !== hoveredRef.current?.id) {
        hoveredRef.current = found
        onBuildingHover?.(found)
        canvas!.style.cursor = found ? 'pointer' : 'default'
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    return () => canvas.removeEventListener('mousemove', handleMouseMove)
  }, [canvasRef, getCenter, onBuildingHover])

  return { hoveredBuilding: hoveredRef }
}
