import {angle} from "./angle.js";
import {Body} from "matter-js"

export const setLookForward = (body) => {
  Body.setAngle(body, angle(body.velocity))
}