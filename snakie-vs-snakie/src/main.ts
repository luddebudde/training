import {
  Application,
  BlurFilter,
  Container,
  Filter,
  GlProgram,
  Graphics,
} from "pixi.js";
import "./style.css";
import RAPIER, {
  ColliderDesc,
  JointData,
  RigidBody,
  RigidBodyDesc,
} from "@dimforge/rapier2d";
import { Key, keyDownTracker } from "./keyDownTracker.ts";

import fragment from "./custom.frag?raw";
import vertex from "./custom.vert?raw";
import { ColorOverlayFilter, DropShadowFilter } from "pixi-filters";

const thresholdFilter = (options: { threshold: number; smoothness: number }) =>
  new Filter({
    glProgram: new GlProgram({
      fragment,
      vertex,
    }),
    resources: {
      timeUniforms: {
        uThreshold: {
          value: options.threshold,
          type: "f32",
        },
        uSmoothness: {
          value: options.smoothness,
          type: "f32",
        },
      },
    },
  });

type GameObject = {
  head: {
    graphics: Container;
    rigidBody: RAPIER.RigidBody;
  };
  body: {
    graphics: Container;
    rigidBody: RAPIER.RigidBody;
    joint: RAPIER.ImpulseJoint;
  }[];
  container: Container;
};

const bodyLength = 300;

const createWalls = (
  world: RAPIER.World,
  _camera: Container,
  wallWidth: number,
  wallHeight: number,
) => {
  const wallThickness = 50;

  const walls = [
    // Top
    {
      x: wallWidth / 2,
      y: wallHeight + wallThickness / 2,
      width: wallWidth,
      height: wallThickness,
    },
    // Bottom
    {
      x: wallWidth / 2,
      y: 0 - wallThickness / 2,
      width: wallWidth,
      height: wallThickness,
    },
    // Left
    {
      x: 0 - wallThickness / 2,
      y: wallHeight / 2,
      width: wallThickness,
      height: wallHeight,
    },
    // Right
    {
      x: wallWidth + wallThickness / 2,
      y: wallHeight / 2,
      width: wallThickness,
      height: wallHeight,
    },
  ];

  walls.forEach((wall) => {
    const rigidBody = world.createRigidBody(
      RigidBodyDesc.fixed().setTranslation(wall.x, wall.y),
    );
    world.createCollider(
      ColliderDesc.cuboid(wall.width / 2, wall.height / 2).setMass(0),
      rigidBody,
    );
  });
};

const createPlayer = (
  world: RAPIER.World,
  camera: Container,
  position: RAPIER.Vector2,
  color: number,
): GameObject => {
  const radius = 10;

  let angle = Math.PI;
  let pos = {
    x: position.x,
    y: position.y,
  };
  const rigidBodies = new Array(bodyLength).fill(0).map((_, i) => {
    angle = Math.sqrt(bodyLength - i) * 3;
    const rigidBody = world.createRigidBody(
      RigidBodyDesc.dynamic()
        .setLinearDamping(5)
        .setAngularDamping(1)
        .setRotation(angle + Math.PI)
        .setTranslation(pos.x, pos.y),
    );
    const offset = {
      x: 2 * radius * Math.cos(angle),
      y: 2 * radius * Math.sin(angle),
    };
    pos.x += offset.x;
    pos.y += offset.y;

    world.createCollider(
      ColliderDesc.ball(radius)
        .setMass(1)
        .setRestitution(1)
        .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS),
      rigidBody,
    );
    return { rigidBody, offset, pos };
  });

  const headBody = rigidBodies[0];
  const bodyRigidBodies = rigidBodies.slice(1);

  const bs = bodyRigidBodies.map((thisBody, i) => {
    const previousBody = bodyRigidBodies[i - 1] ?? headBody;
    const jointParams = JointData.revolute(
      {
        x: -2 * radius,
        y: 0,
      },
      {
        x: 0,
        y: 0,
      },
    );

    const joint = world.createImpulseJoint(
      jointParams,
      previousBody.rigidBody,
      thisBody.rigidBody,
      true,
    );
    return {
      rigidBody: thisBody.rigidBody,
      joint: joint,
    };
  });

  // Create a graphics object to represent the player
  const headGraphics = new Container();
  const tailGraphics = new Container();

  // head
  headGraphics.addChild(new Graphics().circle(0, 0, radius).fill(0xffffff));
  tailGraphics.addChild(new Graphics().circle(0, 0, radius).fill(0xffffff));
  const arrow = new Graphics()
    .moveTo(0, -40) // Tip
    .lineTo(-10, -20) // Left base
    .lineTo(10, -20) // Right base
    .lineTo(0, -40) // Back to tip
    .fill(0x00ff00);
  arrow.scale.y = -1;

  const head = {
    rigidBody: headBody.rigidBody,
    graphics: headGraphics,
  };

  const body = bs.map((b) => {
    const container = new Container();
    container.addChild(new Graphics().circle(0, 0, radius).fill(0xffffff));
    container.addChild(new Graphics().circle(0, radius, radius).fill(0xffffff));
    return {
      rigidBody: b.rigidBody,
      joint: b.joint,
      graphics: container,
    };
  });

  const container = new Container();

  container.addChild(head.graphics);
  body.forEach((body) => {
    container.addChild(body.graphics);
  });

  const colorOverlayFilter = new ColorOverlayFilter({
    color: color,
    alpha: 1,
  });
  container.filters = [
    new BlurFilter({
      strength: (5 * radius) / 10,
    }),
    thresholdFilter({
      threshold: 1,
      smoothness: 0.5,
    }),
    colorOverlayFilter,
    new DropShadowFilter({
      color: color,
      blur: 2,
      alpha: 0.3,
      offset: {
        x: 0,
        y: 0,
      },
    }),
  ];
  camera.addChild(container);

  return {
    head: head,
    body: body,
    container,
  };
};

function handlePlayerCollision(
  player: GameObject,
  handle1: number,
  handle2: number,
  world: RAPIER.World,
) {
  if (
    player.head.rigidBody.handle === handle1 ||
    player.head.rigidBody.handle === handle2
  ) {
    const neck = player.body[0];

    if (
      neck.rigidBody.handle === handle1 ||
      neck.rigidBody.handle === handle2
    ) {
      return;
    }

    // Remove head. neck is now the head.
    const newHead = player.body.shift();
    if (newHead) {
      world.removeRigidBody(player.head.rigidBody);
      world.removeImpulseJoint(neck.joint, true);
      player.container.removeChild(player.head.graphics);
      player.container.removeChild(neck.graphics);
      player.head = {
        graphics: newHead.graphics,
        rigidBody: newHead.rigidBody,
      };
    } else {
      alert("Player died!");
    }
  }
}

(async () => {
  const keydownTracker = keyDownTracker();

  let gravity = { x: 0.0, y: 0 };
  let world = new RAPIER.World(gravity);

  // Create a dynamic rigid-body.

  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({
    background: 0x111827,
    resizeTo: window,
  });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  // Create and add a container to the stage

  // Add to the stage
  const scale = 0.5;
  const camera = new Container();
  camera.scale.set(scale, -scale);
  // Move origin to bottom-left if needed
  camera.y = app.renderer.height;

  app.stage.addChild(camera);

  const worldWidth = app.renderer.width / scale;
  const worldHeight = app.renderer.height / scale;

  createWalls(world, camera, worldWidth, worldHeight);
  const player1 = createPlayer(
    world,
    camera,
    new RAPIER.Vector2(worldWidth / 3, worldHeight / 2),
    0xf43f5e,
  );
  const player2 = createPlayer(
    world,
    camera,
    new RAPIER.Vector2((worldWidth * 2) / 3, worldHeight / 2),
    0x3b82f6,
  );

  const gameObjects: GameObject[] = [player1, player2];
  // Listen for animate update
  app.ticker.add((time) => {
    const dt = time.deltaMS / 1000;

    const walkForce = 2000;
    const walkImpulse = walkForce * dt;
    const angularForce = 40_000;

    const player1Head = player1.head.rigidBody;
    const player2Head = player2.head.rigidBody;

    applyWalkImpulse(player1, walkImpulse);
    applyWalkImpulse(player2, walkImpulse);

    applyImpulseInDirection(player1Head, walkImpulse * 6);
    applyImpulseInDirection(player2Head, walkImpulse * 6);

    if (keydownTracker.isKeyDown(Key.ArrowLeft)) {
      player1Head.applyTorqueImpulse(angularForce * dt, true);
    }
    if (keydownTracker.isKeyDown(Key.ArrowRight)) {
      player1Head.applyTorqueImpulse(-angularForce * dt, true);
    }
    if (keydownTracker.isKeyDown(Key.KeyA)) {
      player2Head.applyTorqueImpulse(angularForce * dt, true);
    }
    if (keydownTracker.isKeyDown(Key.KeyD)) {
      player2Head.applyTorqueImpulse(-angularForce * dt, true);
    }

    const eventQueue = new RAPIER.EventQueue(true);
    // Step the simulation forward.
    world.timestep = dt;
    world.step(eventQueue);

    eventQueue.drainCollisionEvents((handle1, handle2) => {
      handlePlayerCollision(player1, handle1, handle2, world);
      handlePlayerCollision(player2, handle1, handle2, world);
    });

    gameObjects.forEach((gameObject) => {
      gameObject.body.forEach((body) => {
        let position = body.rigidBody.translation();
        body.graphics.x = position.x;
        body.graphics.y = position.y;
        body.graphics.rotation = body.rigidBody.rotation() - Math.PI / 2;
      });
    });
  });
})();

const applyWalkImpulse = (player: GameObject, impulse: number) => {
  player.body.forEach((body) => {
    applyImpulseInDirection(body.rigidBody, impulse);
  });
};

const applyImpulseInDirection = (rigidBody: RigidBody, impulse: number) => {
  const dp1 = new RAPIER.Vector2(
    impulse * Math.cos(rigidBody.rotation()),
    impulse * Math.sin(rigidBody.rotation()),
  );
  rigidBody.applyImpulse(dp1, true);
};
