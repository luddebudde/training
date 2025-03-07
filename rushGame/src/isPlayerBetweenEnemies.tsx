export function isPlayerBetweenEnemies(
  enemy1: Entity,
  enemy2: Entity,
  player: Entity
): boolean {
  const dx = enemy2.pos.x - enemy1.pos.x;
  const dy = enemy2.pos.y - enemy1.pos.y;

  // Vector från enemy1 till spelaren
  const fx = player.pos.x - enemy1.pos.x;
  const fy = player.pos.y - enemy1.pos.y;

  // Projektion av (fx, fy) på (dx, dy) för att hitta närmsta punkt på fiendelinjen
  const t = (fx * dx + fy * dy) / (dx * dx + dy * dy);

  // Begränsa t så att punkten ligger på linjesegmentet mellan fienderna
  const tClamped = Math.max(0, Math.min(1, t));

  // Närmaste punkt på segmentet
  const closestX = enemy1.pos.x + tClamped * dx;
  const closestY = enemy1.pos.y + tClamped * dy;

  // Beräkna avståndet från spelarens cirkel till närmaste punkt på linjen
  const distSquared =
    (closestX - player.pos.x) ** 2 + (closestY - player.pos.y) ** 2;

  // Kolla om spelarens cirkel kolliderar med linjen mellan fienderna
  return distSquared <= player.radius ** 2;
}
