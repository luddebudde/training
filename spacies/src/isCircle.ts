import { Body } from "matter-js";

export const isCircle = (body: Body) => typeof body.circleRadius !== 'undefined'
