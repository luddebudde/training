import { Bodies, Body, Vector } from "matter-js"
import { angle } from "./angle"
import { applyForceTo } from "./applyForceTo"
import { applyTorque } from "./applyTorque"
import { direction } from "./direction"
import { add } from "./math"
import { radiansToCartesian } from "./radianstToCartesian"
import { random } from "./random"
import { sprites } from "./sprites"
import { left, right, up } from "./vectors"

const engineStrength = 5
const turboStrengh = engineStrength * 3
export const BomberRadius = 15
export const createBomber = (player, getGameObjects, position) => {
    const body = Bodies.circle(position.x, position.y, BomberRadius, {
        mass: 500,
        frictionAir: 0.1,
        angle: random(0, 2 * Math.PI),
        render: {
            sprite: {
                texture: sprites.bomber.texture,
                xScale: 2 * BomberRadius / sprites.bomber.width,
                yScale: 2 * BomberRadius / sprites.bomber.height,

            },
        },

    })
    applyForceTo(body, radiansToCartesian(random(0, 2 * Math.PI), random(0, 20))) 
    return {
        body: body,
        update: () => {
            const dirToPlayer = Vector.normalise(Vector.sub(player.body.position, body.position))

            const neighborThreshold = 100

            // const neighbors = getGameObjects().filter(gameObjects => gameObjects)
            //     .filter(gameObject => gameObject.body !== body)
            //     .sort(gameObject => Vector.magnitudeSquared(Vector.sub(gameObject.body.position, body.position)))
            //     .slice(0, 5)
            const neighbors = getGameObjects().filter(gameObjects => gameObjects)
                .filter(gameObject => gameObject.body !== body)
                .filter(neighbor => Vector.magnitudeSquared(Vector.sub(neighbor.body.position, body.position)) < neighborThreshold * neighborThreshold)

            const neighborRepulsion = neighbors
                // .filter(neighbor => Vector.magnitudeSquared(Vector.sub(neighbor.body.position, body.position)) < neighborThreshold * neighborThreshold)
                .map(closeNeighbors => closeNeighbors.body)
                .map(neighbor => {
                    const r = Vector.sub(neighbor.position, body.position)
                    console.log(neighbor.mass);
                    const force = Vector.mult(Vector.normalise(r), -neighbor.mass/(Vector.magnitudeSquared(r) + 0.0001))
                    return force
                })
                .reduce((accumulation, force) => {
                    return Vector.add(accumulation, force)
                }, Vector.create(0, 0))


            const neighborDirection = Vector.normalise(
                neighbors
                    // .filter(neighbor => Vector.magnitudeSquared(Vector.sub(neighbor.body.position, body.position)) < neighborThreshold * neighborThreshold)
                    .map(closeNeighbors => Vector.normalise(closeNeighbors.body.velocity))
                    .reduce((accumulation, current) => {
                        return Vector.add(accumulation, current)
                    }, Vector.create(0, 0))
            )

            // const torque = 0.1 * Vector.cross(targetDir, lookDir)
            const isTurboOn = Vector.magnitude(Vector.sub(player.body.position, body.position)) < 300
            const forceMagnitude = isTurboOn ? turboStrengh : engineStrength
            
            const forceDir = Vector.normalise(
                add(
                    Vector.mult(neighborRepulsion, 1),
                    Vector.mult(neighborDirection, 1),
                    Vector.mult(dirToPlayer, 0.5),
                )
            )
            const force = Vector.mult(forceDir, forceMagnitude)
            applyForceTo(body, force)
            Body.setAngle(body, angle(body.velocity))
            // console.log(torque);
            // applyTorque(body, torque)

            // if (Vector.magnitude(Vector.sub(player.body.position, body.position)) < 300) {
            //     Body.applyForce(body, body.position, Vector.mult(direction(body), turboStrengh))
            // } else {
            //     // Move
            //     Body.applyForce(body, body.position, Vector.mult(direction(body), engineStrength))
            // }
        },
        isBullet: true,
        health: 20,
        // damage: 50
    }

}