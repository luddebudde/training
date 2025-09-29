import { Vector } from 'matter-js'
import { distanceSquared } from './distance'

export const closestPlayer = (pos: Vector, players) =>
  players.reduce(function (minPlayer, currentPlayer) {
    return distanceSquared(pos, currentPlayer.body.position) <
      distanceSquared(pos, minPlayer.body.position)
      ? currentPlayer
      : minPlayer
  }, players[0])
