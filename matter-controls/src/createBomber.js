import { Bodies, Body, Vector } from "matter-js"
import { applyTorque } from "./applyTorque"
import { direction } from "./direction"
import { sprites } from "./sprites"
import { up } from "./vectors"

const engineStrength = 0.18
const turboStrengh = engineStrength * 5
export const BomberRadius = 30
export const createBomber = (player) => {
    const body = Bodies.circle(0, 30, BomberRadius, {
        mass: 500,
        frictionAir: 0.05,
        render: {
            sprite: {
                texture: sprites.bomber.texture,
                xScale: 2 * BomberRadius / sprites.bomber.width,
                yScale: 2 * BomberRadius / sprites.bomber.height,
                
            },
        },
    })

    return {
        body: body,
        update: () => {
                const dirToPlayer = Vector.normalise(Vector.sub(player.body.position, body.position))
            const lookDir = direction(body)
            const torque = Vector.cross(dirToPlayer, lookDir)
            applyTorque(body, torque)

            if (Vector.magnitude(Vector.sub(player.body.position, body.position)) < 300) {
                Body.applyForce(body, body.position, Vector.mult(direction(body), turboStrengh))
            } else {
                // Move
                Body.applyForce(body, body.position, Vector.mult(direction(body), engineStrength))
            }
        }
    }

}