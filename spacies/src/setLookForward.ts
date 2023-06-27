import { angle } from './angle'
import { Body } from 'matter-js'

export const setLookForward = (body: Body) => {
  Body.setAngle(body, angle(body.velocity))
}
