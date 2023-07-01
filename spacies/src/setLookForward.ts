import { angle } from './math'
import { Body } from 'matter-js'

export const setLookForward = (body: Body) => {
  Body.setAngle(body, angle(body.velocity))
}
