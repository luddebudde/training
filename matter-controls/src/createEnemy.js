import {Bodies, Body, Vector} from "matter-js"
import {throttle} from "throttle-debounce"
import {direction} from "./direction"
import {ebullet} from "./eBullet"
import {sprites} from "./sprites"
import {turnTowards} from "./turnTowards.js";
import {thrust} from "./thrust.js";
import {isFacing} from "./isFacing.js";
import {closestPlayer} from "./closestPlayer.js";

export const engineStrength = 0.3
export const enemyRadius = 45
export const createEnemy = (players, addObject, position) => {
    const body = Bodies.circle(position.x, position.y, enemyRadius, {
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
    const gunPosition = () => {
        return Vector.add(body.position, Vector.mult(direction(body), enemyRadius))
    }
    const fire = throttle(1000,() => {
        const newEBullet = ebullet(gunPosition(), direction(body))
        addObject(newEBullet)
        const audio = new Audio('audio/enemy-rifle.mp3');
        audio.play();
    })
    return {
        body: body,
        update: () => {
            const player = closestPlayer(body.position, players)
            turnTowards(body, player.body, 0.1)

            if (Vector.magnitude(Vector.sub(player.body.position, body.position)) < 500) {
                fire()
            } else if(isFacing(body, player.body)) {
                thrust(body, engineStrength)
            }
        },
        health: 40,
        points: 50,
    }
}

