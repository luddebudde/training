import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet, createWaveShoot } from "../createBullet";
import { player } from "../createPlayer";
import { Enemy } from "../enemies/chaser";
import { goTo } from "../goTo";
import { makeDirection } from "../makeDirection";
import { add, mult, multVar, sub, Vec2 } from "../math";
import { randomArrayElement } from "../randomArrayElement";

const cornerDelay = 25;
const health = 1000;

// TODO make sprayer shoot at last corner
// Make it lose all movement when stoping "corner phase"

export const createSprayerBoss = () => {
  const sprayer = {
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
    reacheadHalfPoint: false,

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

    aiMovement: () => {},
    update: (ctx): void => {
      sprayer.aiMovement();

      //   sprayer.attackDelay--;
      sprayer.phaseCounter--;

      if (sprayer.phaseCounter < 0) {
        const movementNumber = Math.floor(Math.random() * 3);
        // const movementNumber = 1;

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
                  player.pos, // Målets position
                  10, // Skada
                  15, // Hastighet
                  Math.PI / 4, // Vågens bredd (t.ex. 45 grader i radianer)
                  15, // Antal skott
                  { bounceable: false, airFriction: false } // Mods
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
          console.log("coenr");
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

          const originalCorners = [upLeft, upLRight, downLeft, downRight];
          let remainingCorners = [...originalCorners];

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
                goTo(sprayer, nextCorner, {
                  time: cornerDelay,
                  speed: undefined,
                });

                createWaveShoot(
                  bullets,
                  sprayer,
                  player.pos,
                  10,
                  5,
                  Math.PI / 4,
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
            // console.log(sprayer.spreadOutPhase.shootCounter);

            if (sprayer.phaseCounter < 0) {
              sprayer.spreadOutPhase.shootCounter = 0;
              sprayer.phaseCounter = 1000;
              let moveTime = sprayer.spreadOutPhase.shootDelay;
              let changeTime = sprayer.spreadOutPhase.changePhaseDelay;

              const place: Vec2 = { x: world.width / 2, y: world.height / 2 };

              goTo(sprayer, place, { time: moveTime, speed: undefined });
            }

            if (
              sprayer.spreadOutPhase.shootCounter >
              sprayer.spreadOutPhase.shootDelay
            ) {
              for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                  const angle = (i / 50) * Math.PI * 2; // Cirkulär fördelning av vinklar
                  const target: Vec2 = {
                    x: sprayer.pos.x + Math.cos(angle) * 100, // Radie på 100 enheter
                    y: sprayer.pos.y + Math.sin(angle) * 100,
                  };
                  if (i !== 49) {
                    createBullet(bullets, sprayer, target, 10, 20);
                  } else {
                    const numShots = 5; // Antal skott per riktning
                    const angleStep = (Math.PI * 2) / numShots; // Steg mellan varje skott
                    for (let i = 0; i < numShots; i++) {
                      const angle = i * angleStep; // Beräkna vinkeln för varje skott
                      const target: Vec2 = {
                        x: sprayer.pos.x + Math.cos(angle) * 100, // Radie på 100 enheter
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
      const maxI = 200; // Antal kulor
      const angleStep = (Math.PI * 2) / maxI; // Steg mellan vinklar för att täcka en cirkel
      const speed = 50; // Hastighet för kulorna

      for (let i = 0; i < maxI; i++) {
        const angle = i * angleStep; // Vinkel för den aktuella kulan
        const target = {
          x: Math.cos(angle) * 100 + sprayer.pos.x, // Punkt utåt baserad på vinkel
          y: Math.sin(angle) * 100 + sprayer.pos.y,
        };

        createBullet(
          bullets,
          undefined, // Ingen specifik "shooter"
          target, // Målet baserat på vinkeln
          3, // Skadevärde
          speed, // Hastighet
          {
            bounceable: false, // Mods
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
    airFriction: true,
  };

  return sprayer;
  // entities.push(sprayer);
  // liveBosses.push(sprayer);
};
