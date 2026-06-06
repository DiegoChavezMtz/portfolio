export interface Deliverable {
  title: string
  desc: string
  stack: string[]
  screenshots: string[]
}

export interface BuildingItem {
  title: string
  desc: string
  stack: string[]
  screenshots?: string[]
  period?: string
  deliverables?: Deliverable[]
}

export interface Building {
  id: string
  label: string
  sub: string
  tag: string
  panelTitle: string
  body: string
  stack: string[]
  items: BuildingItem[]
  gx: number
  gy: number
  gw: number
  gd: number
  floors: number
  col: string
  h: number
}
