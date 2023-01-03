import { Bodies, Body } from "matter-js"
import { createEnemy } from "./createEnemy"
import { sprites } from "./sprites"

export const playerRadius = 45
export const createPlayer = () => {
    return {
        body: Bodies.circle(0, 0, playerRadius, {
            mass: 500,
            frictionAir: 0.05,  
            label: "Player",
            render: {
                sprite: {
                    texture: sprites.player.texture,
                    xScale: 2 * playerRadius / sprites.player.width,
                    yScale: 2 * playerRadius / sprites.player.height,
                },
            },
        }),
        health:200,
    }
}