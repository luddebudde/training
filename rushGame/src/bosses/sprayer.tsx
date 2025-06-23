import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet, createWaveShoot } from "../createBullet";
import { player } from "../createPlayer";
import { makeDirection } from "../geometry/makeDirection";
import { goTo } from "../goTo";
import { add, multVar, sub, Vec2 } from "../math";

const cornerDelay = 50;
const health = 25;

// TODO make sprayer shoot at last corner
// Make it lose all movement when stoping "corner phase"

type Sprayer = {
  name: string;
  maxHealth: number;
  health: number;
  contactDamage: number;
  pos: {
    x: number;
    y: number;
  };
  vel: {
    x: number;
    y: number;
  };
  radius: number;
  color: string;
  speed: number;
  team: string;
  mass: number;

  damageConflicted: number;
  damageAbsorbed: number;

  collision: true;
  airFriction: boolean;
  bulletsShot: number;

  // Pahses
  phaseCounter: number;
  shooterPhase: {
    attackDelay: number;
    spreadShotCounter: number;
  };
  cornerPhase: {
    counter: number;
  };
  spreadOutPhase: {
    shootDelay: number;
    shootCounter: number;
    changePhaseDelay: number;
    changeCounter: number;
  };

  reacheadHalfPoint: boolean;

  aiMovement: () => void;
  update: (ctx) => void;
  deathAnimation: (ctx, liveBosses, bossIndex) => void;
};

export const createSprayerBoss = () => {
  const sprayer: Sprayer = {
    name: "Sprayer",
    maxHealth: health,
    health: health,
    contactDamage: 0,
    pos: {
      x: Math.random() * world.width,
      y: Math.random() * world.height,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: 80,
    color: "lime",
    speed: 0.3,
    team: "enemy",
    mass: 1000,

    damageConflicted: 0,
    damageAbsorbed: 0,

    collision: true,
    airFriction: true,
    bulletsShot: 0,

    // Pahses
    phaseCounter: 10,
    shooterPhase: {
      attackDelay: 5,
      spreadShotCounter: 0,
    },
    cornerPhase: {
      counter: 0,
    },
    spreadOutPhase: {
      shootDelay: 100,
      shootCounter: 0,
      changePhaseDelay: 200,
      changeCounter: 0,
    },

    reacheadHalfPoint: false,

    aiMovement: () => {},
    update: (ctx, deltaTime): void => {
      sprayer.aiMovement();

      //   sprayer.attackDelay--;
      sprayer.phaseCounter--;

      if (sprayer.phaseCounter < 0) {
        const movementNumber = Math.floor(Math.random() * 3);

        if (movementNumber === 0) {
          console.log("shooter");
          sprayer.airFriction = true;

          sprayer.aiMovement = () => {
            const distanceVec = sub(sprayer.pos, player.pos);
            const distance = Math.sqrt(
              distanceVec.x * distanceVec.x + distanceVec.y * distanceVec.y
            );
            if (distance < 500) {
              sprayer.vel = add(
                sprayer.vel,
                multVar(
                  makeDirection(sprayer.pos, player.pos),
                  -sprayer.speed * 2
                )
              );
            } else {
              sprayer.vel = add(
                sprayer.vel,
                multVar(
                  makeDirection(sprayer.pos, player.pos),
                  sprayer.speed * 2
                )
              );
            }

            if (sprayer.shooterPhase.attackDelay < 0) {
              if (sprayer.shooterPhase.spreadShotCounter % 4 === 0) {
                createWaveShoot(
                  bullets,
                  sprayer,
                  player.pos,
                  10,
                  15,
                  Math.PI / 4,
                  15,
                  { bounceable: false, airFriction: false }
                );
              } else {
                createBullet(bullets, sprayer, player.pos, 30, 10);
              }
              sprayer.shooterPhase.attackDelay = 50;
              sprayer.shooterPhase.spreadShotCounter++;
            }

            sprayer.shooterPhase.attackDelay--;
          };

          sprayer.phaseCounter = 400;
        } else if (movementNumber === 1) {
          console.log("corner");
          sprayer.airFriction = false;

          const upLeft = { x: sprayer.radius, y: sprayer.radius };
          const upLRight = {
            x: world.width - sprayer.radius,
            y: sprayer.radius,
          };
          const downLeft = {
            x: sprayer.radius,
            y: world.height - sprayer.radius,
          };
          const downRight = {
            x: world.width - sprayer.radius,
            y: world.height - sprayer.radius,
          };

          const cornerArray = [upLeft, upLRight, downLeft, downRight];
          let remainingCorners = [...cornerArray];

          sprayer.aiMovement = () => {
            if (sprayer.cornerPhase.counter < 0) {
              const currentTarget = remainingCorners[0];
              const distanceToTarget = Math.sqrt(
                Math.pow(currentTarget.x - sprayer.pos.x, 2) +
                  Math.pow(currentTarget.y - sprayer.pos.y, 2)
              );

              if (distanceToTarget < sprayer.radius) {
                remainingCorners.shift();
              }

              if (remainingCorners.length > 0) {
                const nextCorner = remainingCorners[0];
                goTo(sprayer, nextCorner, cornerDelay);

                createWaveShoot(
                  bullets,
                  sprayer,
                  player.pos,
                  10,
                  5,
                  Math.PI / 2,
                  5,
                  { bounceable: false, airFriction: false }
                );
              } else {
                sprayer.phaseCounter = 0;
              }

              sprayer.cornerPhase.counter = cornerDelay;
            }

            sprayer.cornerPhase.counter--;
          };

          sprayer.phaseCounter = cornerDelay * 5;
        } else if (movementNumber === 2) {
          console.log("middle");
          sprayer.airFriction = false;

          sprayer.aiMovement = () => {
            sprayer.spreadOutPhase.shootCounter++;

            if (sprayer.phaseCounter < 0) {
              sprayer.spreadOutPhase.shootCounter = 0;
              sprayer.phaseCounter = 1000;
              let moveTime = sprayer.spreadOutPhase.shootDelay;

              const place: Vec2 = { x: world.width / 2, y: world.height / 2 };

              goTo(sprayer, place, moveTime);
            }

            if (
              sprayer.spreadOutPhase.shootCounter >
              sprayer.spreadOutPhase.shootDelay
            ) {
              for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                  const angle = (i / 50) * Math.PI * 2;
                  const target: Vec2 = {
                    x: sprayer.pos.x + Math.cos(angle) * 100,
                    y: sprayer.pos.y + Math.sin(angle) * 100,
                  };
                  if (i !== 49) {
                    createBullet(bullets, sprayer, target, 10, 20);
                  } else {
                    const numShots = 5;
                    const angleStep = (Math.PI * 2) / numShots;
                    for (let i = 0; i < numShots; i++) {
                      const angle = i * angleStep;
                      const target: Vec2 = {
                        x: sprayer.pos.x + Math.cos(angle) * 100,
                        y: sprayer.pos.y + Math.sin(angle) * 100,
                      };
                      createBullet(bullets, sprayer, target, 20, 10, {
                        bounceable: true,
                        bounceDamageLoss: 0.0,
                        airFriction: false,
                      });
                    }
                  }
                }, 40 * i);
              }

              setTimeout(() => {
                sprayer.phaseCounter = 0;
              }, 3000);

              sprayer.vel = { x: 0, y: 0 };
              sprayer.spreadOutPhase.shootCounter = -10000;
            }
          };
        }
      }
    },
    deathAnimation: () => {
      console.log("death aniamtion: ACTIVATE");
      const maxI = 200;
      const angleStep = (Math.PI * 2) / maxI;
      const speed = 50;

      for (let i = 0; i < maxI; i++) {
        const angle = i * angleStep;
        const target = {
          x: Math.cos(angle) * 100 + sprayer.pos.x,
          y: Math.sin(angle) * 100 + sprayer.pos.y,
        };

        createBullet(
          bullets,
          undefined,
          target,
          3,
          speed,
          {
            bounceable: false,
            airFriction: false,
            bounceDamageLoss: 0.3,
          },
          {
            startPos: {
              x: sprayer.pos.x,
              y: sprayer.pos.y,
            },
            team: "player",
          }
        );
      }
    },
  };

  entities.push(sprayer);
  liveBosses.push(sprayer);

  return sprayer;
};
