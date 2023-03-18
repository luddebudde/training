import { Vector } from "matter-js"

export const sum = (...terms) => terms.reduce((accumulation, term) => {
    accumulation.x += term.x
    accumulation.y += term.y
    return accumulation
}, Vector.create(0, 0))

export const average = (...terms) => terms.length > 0 ? Vector.div(sum(...terms), terms.length) : undefined

export const angleBetween = (a1, a2) => 180 - Math.abs(Math.abs(a1 - a2) - 180)