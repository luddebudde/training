import { distanceSquared } from './distance.js'

export const closestPlayer = (pos, players) =>
  players.reduce(function (minPlayer, currentPlayer) {
    return distanceSquared(pos, currentPlayer.body.position) <
      distanceSquared(pos, minPlayer.body.position)
      ? currentPlayer
      : minPlayer
  }, players[0])
