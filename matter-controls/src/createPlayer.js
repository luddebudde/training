import { Bodies, Body, Constraint } from "matter-js"
import { createEnemy } from "./createEnemy"
import { sprites } from "./sprites"
import {collisionCategories} from "./collision.js";

export const playerRadius = 45
export const createPlayer = () => {

    const playerBody = Bodies.circle(0, 0, playerRadius, {
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
        collisionFilter: {
            category: collisionCategories.player,
            // mask: collisionCategories.player,
        }
    })
    const cameraBody = Bodies.circle(playerRadius + 100, 0, 10, {
        mass: 1,
        frictionAir: 0.05,
        label: "Camera",
        isSensor: true,
        render: {
            visible: false,
        },
    })

    const cameraConstraint = Constraint.create({
        bodyA: playerBody,
        bodyB: cameraBody,
        length: 0,
        stiffness: 0.005,
        damping: 0.1,
        render: {
            visible: false,
        },
    });

    return {
        body: playerBody,
        worldObjects: [playerBody, cameraBody, cameraConstraint],
        camera: cameraBody,
        health: 200,
    }
}