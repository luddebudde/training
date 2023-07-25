import { Body } from 'matter-js'

export type GameObject = {
  type: string
  body: Body
  draw?: (
    ctx: CanvasRenderingContext2D,
    assets: Record<string, HTMLImageElement>,
    thisObject: GameObject,
  ) => void
}
