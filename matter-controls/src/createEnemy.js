import { Bodies, Body, Vector } from "matter-js"
import { applyTorque } from "./applyTorque"
import { direction } from "./direction"
import { sprites } from "./sprites"
import { up } from "./vectors"

export const engineStrength = 0.3
export const enemyRadius = 55
export const createEnemy = (player) => {
    const body = Bodies.circle(0, 10, enemyRadius, {
        mass: 500,
        frictionAir: 0.05,
        render: {
            sprite: {
                texture: sprites.enemy.texture,
                xScale: 2 * enemyRadius / sprites.enemy.width,
                yScale: 2 * enemyRadius / sprites.enemy.height,

            },
        },
    })
    return {
        body: body,
        update: () => {

            // Turn
            const dirToPlayer = Vector.normalise(Vector.sub(player.body.position, body.position))
            const lookDir = direction(body)
            const torque = Vector.cross(dirToPlayer, lookDir)
            applyTorque(body, torque)
            
            if (Vector.magnitude(Vector.sub(player.body.position, body.position)) < 500) {
            
            } else {
                // Move
                Body.applyForce(body, body.position, Vector.mult(direction(body), engineStrength))
            }

        }

    }
}