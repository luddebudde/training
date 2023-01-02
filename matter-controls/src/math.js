import { Vector } from "matter-js"

export const add = (...terms) => {
    let sum = Vector.create(0, 0)
    terms.forEach(term => {
    sum = Vector.add(sum, term)        
    });
    return sum
}