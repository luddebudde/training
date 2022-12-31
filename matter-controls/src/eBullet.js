import { Bodies, Body, Vector } from "matter-js"
import { direction } from "./direction"
import { sprites } from "./sprites"
import { right } from "./vectors"

const eBulletSpeed = 10

export const setEBulletDirection = (body, direction) => {
    Body.setVelocity(
        body,
        Vector.mult(
            Vector.normalise(direction),
            eBulletSpeed
        )
    )
}

export const ebullet = (pos, direction) => {
    const eBulletRadius = 20
    // const pos = Vector.add(Vector.mult (direction(player.body), playerRadius + bulletRadius), player.body.position) 
    const p = Vector.add(pos, Vector.mult(direction, eBulletRadius))
    const eBullet = Bodies.circle(p.x, p.y, eBulletRadius, {
        mass: 1,
        friction: 0,
        frictionAir: 0,
        render: {
            sprite: {
                texture: sprites.eBullet.texture,
                xScale: 2 * eBulletRadius / sprites.eBullet.width,
                yScale: 2 * eBulletRadius / sprites.eBullet.width,
            },
        },
    })
    setEBulletDirection(eBullet, direction)
    return eBullet
}