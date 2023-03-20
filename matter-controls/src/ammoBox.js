import { Bodies, Vector } from "matter-js"
import { room } from "../main.js"
import { applyForce } from "./applyForce.js"
import { applyTorque } from "./applyTorque"
import { radiansToCartesian } from "./radianstToCartesian.js"
import { random } from "./random.js"
import { sprites } from "./sprites.js"


export const miniBox = (position) => {

    const radius = 40
    
    
    const body = Bodies.circle(position.x, position.y , radius, {
        density: 0.1,
        frictionAir: 0,
        mass: 10000,
        render: {
            sprite: {
                texture: sprites.ammoBox.texture,
                xScale: 2 * radius / sprites.ammoBox.width * 1.23,
                yScale: 2 * radius / sprites.ammoBox.height * 1.23,

            },
        },
    })
    applyTorque(body, 1)
    applyForce(body, radiansToCartesian(random(0, 2 * Math.PI), random(0, 20)))
    
    return {
        body: body,
        health: 0,
        points: 0,
        damage: 0,
        isBullet: true,
    }
}