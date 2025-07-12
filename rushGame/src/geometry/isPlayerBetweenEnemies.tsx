import { Player } from "../createPlayer";
import { Vec2 } from "../math";

export function isPlayerBetweenEnemies(
  point1: Vec2,
  point2: Vec2,
  player: Player
): boolean {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;

  // Vector från enemy1 till spelaren
  const fx = player.pos.x - point1.x;
  const fy = player.pos.y - point1.y;

  // Projektion av (fx, fy) på (dx, dy) för att hitta närmsta punkt på fiendelinjen
  const t = (fx * dx + fy * dy) / (dx * dx + dy * dy);

  // Begränsa t så att punkten ligger på linjesegmentet mellan fienderna
  const tClamped = Math.max(0, Math.min(1, t));

  // Närmaste punkt på segmentet
  const closestX = point1.x + tClamped * dx;
  const closestY = point1.y + tClamped * dy;

  // Beräkna avståndet från spelarens cirkel till närmaste punkt på linjen
  const distSquared =
    (closestX - player.pos.x) ** 2 + (closestY - player.pos.y) ** 2;

  // Kolla om spelarens cirkel kolliderar med linjen mellan fienderna
  return distSquared <= player.radius ** 2;
}
