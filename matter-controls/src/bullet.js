import { Bodies, Body, Vector } from "matter-js"
import { direction } from "./direction"
import { sprites } from "./sprites"
import { right } from "./vectors"

const bulletSpeed = 20

export const setBulletDirection = (body, direction) => {
    Body.setVelocity(
        body,
        Vector.mult(
            Vector.normalise(direction),
            bulletSpeed
        )
    )
}

export const bullet = (pos, direction) => {
    const bulletRadius = 20
    // const pos = Vector.add(Vector.mult (direction(player.body), playerRadius + bulletRadius), player.body.position) 
    const p = Vector.add(pos, Vector.mult(direction, bulletRadius))
    const bullet = Bodies.circle(p.x, p.y, bulletRadius, {
        mass: 1,
        friction: 0,
        frictionAir: 0,
        render: {
            sprite: {
                texture: sprites.bullet.texture,
                xScale: 2 * bulletRadius / sprites.bullet.width,
                yScale: 2 * bulletRadius / sprites.bullet.width,
            },
        },
    })
    setBulletDirection(bullet, direction)
    return bullet
}