import { Bodies, Vector } from "matter-js"
import { room } from "../main.js"
import { applyForceTo } from "./applyForceTo.js"
import { applyTorque } from "./applyTorque"
import { random } from "./random.js"
import { sprites } from "./sprites.js"

const radiansToCartesian = (angle, r) => {
    return {
        x: r * Math.cos(angle),
        y: r * Math.sin(angle),
    }
}

export const asteroid = (player) => {

    const asteroidRadius = random(30, 90)
    const pos = Vector.add(radiansToCartesian(random(0, 2 * Math.PI), random(500, 1000)), player.body.position)
    
    const body = Bodies.circle(pos.x, pos.y , asteroidRadius, {
        density: 0.1,
        frictionAir: 0,
        render: {
            sprite: {
                texture: sprites.asteroid.texture,
                xScale: 2 * asteroidRadius / sprites.asteroid.width * 1.23,
                yScale: 2 * asteroidRadius / sprites.asteroid.height * 1.23,

            },
        },
    })
    applyTorque(body, 1)
    applyForceTo(body, radiansToCartesian(random(0, 2 * Math.PI), random(0, 20))) 
    
    return {
        body: body,
    }
}