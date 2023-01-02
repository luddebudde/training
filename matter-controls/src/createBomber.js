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
export const createBomber = (player, getGameObjects) => {
    const body = Bodies.circle(random(300, 1000), random(300, 1000), BomberRadius, {
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

            const neighborThreshold = 50

            // const neighbors = getGameObjects().filter(gameObjects => gameObjects)
            //     .filter(gameObject => gameObject.body !== body)
            //     .sort(gameObject => Vector.magnitudeSquared(Vector.sub(gameObject.body.position, body.position)))
            //     .slice(0, 5)
            const neighbors = getGameObjects().filter(gameObjects => gameObjects)
                .filter(gameObject => gameObject.body !== body)
                .filter(neighbor => Vector.magnitudeSquared(Vector.sub(neighbor.body.position, body.position)) < neighborThreshold * neighborThreshold)

            const neighborRepulsion = neighbors
                // .filter(neighbor => Vector.magnitudeSquared(Vector.sub(neighbor.body.position, body.position)) < neighborThreshold * neighborThreshold)
                .map(closeNeighbors => closeNeighbors.body.position)
                .map(pos => Vector.sub(pos, body.position))
                .map(r => Vector.div(Vector.normalise(r), -Vector.magnitudeSquared(r) + 0.0001))
                .reduce((accumulation, current) => {
                    return Vector.add(accumulation, current)
                }, Vector.create(0, 0))


            const neighborDirection = Vector.normalise(
                neighbors
                    // .filter(neighbor => Vector.magnitudeSquared(Vector.sub(neighbor.body.position, body.position)) < neighborThreshold * neighborThreshold)
                    .map(closeNeighbors => Vector.normalise(closeNeighbors.body.velocity))
                    .reduce((accumulation, current) => {
                        return Vector.add(accumulation, current)
                    }, Vector.create(0, 0))
            )

            const neighborCenter = neighbors
                .filter(neighbor => Vector.magnitudeSquared(Vector.sub(neighbor.body.position, body.position)) < neighborThreshold * neighborThreshold)
                .map(closeNeighbors => closeNeighbors.body.position)
                .reduce((accumulation, current) => {
                    return Vector.add(accumulation, current)
                }, Vector.create(0, 0))
            const neighborCenterDist = Vector.sub(neighborCenter, body.position)
            const neighborAttraction = Vector.normalise(Vector.mult(Vector.normalise(neighborCenterDist), Vector.magnitudeSquared(neighborCenterDist)))

            const neighborTarget = Vector.normalise((Vector.add(
                Vector.mult(neighborRepulsion, 1),
                Vector.mult(neighborAttraction, 2),
            )))
            const targetDir = Vector.normalise(
                Vector.add(
                    Vector.mult(Vector.normalise(dirToPlayer), 1),
                    neighborTarget
                )
            )
            const lookDir = direction(body)
            // const torque = 0.1 * Vector.cross(targetDir, lookDir)
            const isTurboOn = Vector.magnitude(Vector.sub(player.body.position, body.position)) < 300
            const forceMagnitude = isTurboOn ? turboStrengh : engineStrength
            
            const forceDir = Vector.normalise(
                add(
                    Vector.mult(neighborRepulsion, 500),
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
    }

}