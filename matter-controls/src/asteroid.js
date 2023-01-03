import { Bodies, Vector } from "matter-js"
import { room } from "../main.js"
import { applyForceTo } from "./applyForceTo.js"
import { applyTorque } from "./applyTorque"
import { radiansToCartesian } from "./radianstToCartesian.js"
import { random } from "./random.js"
import { sprites } from "./sprites.js"


export const asteroid = (position) => {

    const asteroidRadius = random(30, 90)
    
    
    const body = Bodies.circle(position.x, position.y , asteroidRadius, {
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
        // damage: 100,
        // isBullet: true,
    }
}