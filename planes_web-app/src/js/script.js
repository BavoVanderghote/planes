import * as THREE from "three";
import Airplane from "./Airplane";
import { map, randomNumber } from "./functions";
import { io } from "socket.io-client";

{
  // SOCKETS
  let connected = false;

  const authCode = randomNumber(1000, 10000);
  console.log(authCode);

  // const SOCKET_SERVER = "https://planes-socket-server.herokuapp.com/";
  const SOCKET_SERVER = "127.0.0.1:3000";
  const socket = io(SOCKET_SERVER, {
    auth: {
      token: authCode,
    },
  });

  socket.on("connect", () => {
    console.log(socket.id);
  });

  socket.on("accelerometerData", ({ x, y, z }) => {
    handleAccelerometerData(x, y, z);
  });

  socket.on("tap", (e) => {
    console.log("tap");
    if (useApp) {
      handleTapScreen(e);
    }
  });

  socket.on("clientConnection", (e) => {
    console.log("app connected", e);
    connected = e;
    toggleButtonState(document.querySelector(".app"), "inactive", !e);
    $clickKeyboard();
    connected
      ? (document.querySelector(".connected").innerText = "Connected")
      : (document.querySelector(".connected").innerText =
          "Not connected - connect your phone with this code");
  });

  let accHelper = new THREE.ArrowHelper();

  const handleAccelerometerData = (x, y, z) => {
    console.log(-z);
    accX = x;
    accY = -z; // hold phone upright, pull is up, push is down
  };

  const handleTapScreen = (e) => {
    handlePressShoot();
    start ? (shoot = true) : (start = true);
  };

  const sendData = (handle, data) => {
    socket.emit(handle, data);
  };
  // INITIALIZATION + SCENE

  // scene
  const scene = new THREE.Scene();

  // camera
  // isometric camera
  var aspect = window.innerWidth / window.innerHeight;
  var d = 50;
  const camera = new THREE.OrthographicCamera(
    -d * aspect,
    d * aspect,
    d,
    -d,
    0.1,
    2000
  );
  camera.position.set(50, 50, 50); // all components equal
  camera.lookAt(scene.position); // or the origin

  // light
  // directional light for shadows
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(0, 70, 0); //default; light shining from top; y component defines heigt of shadow camera
  directionalLight.lookAt(20, 20, 20);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  // global illumination
  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
  scene.add(ambientLight);

  // shadow
  // fructum
  directionalLight.shadow.mapSize.width = 4112; // default
  directionalLight.shadow.mapSize.height = 4112; // default
  // directionalLight.shadow.camera.near = 0.5; // default
  // directionalLight.shadow.camera.far = 500; // default
  // size of shadow camera
  const shadowSide = 110;
  directionalLight.shadow.camera.top = shadowSide;
  directionalLight.shadow.camera.bottom = -shadowSide;
  directionalLight.shadow.camera.left = shadowSide;
  directionalLight.shadow.camera.right = -shadowSide;

  // renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true; // enable shadows
  document.body.appendChild(renderer.domElement);

  // VARIABLES

  let start = false;
  const $overlay = document.querySelector(".overlay");
  let dead = false;
  let win = false;
  let accX, accY;
  const deadzone = 0.5;

  // player
  const player = new Airplane(THREE);
  // player.initialize();
  player.createAirplane(0xba3f1d, 0xcccccc);
  player.showAirplane(scene, new THREE.Vector3(0, 4, 0));
  // player.showAxes();
  player.limitYaw(5);
  player.limitSpeed(130); // 130

  const playerBBox = new THREE.Box3().setFromObject(player.airplane);
  // playerBBox.expandByScalar(-0.5);

  // ai
  const ai = new Airplane(THREE);
  ai.createAirplane(0x505050, 0x0050ff);
  ai.limitYaw(3);
  ai.limitPitch(0.8);
  ai.limitSpeed(80);
  ai.velocity.set(0, 0, 1);
  ai.showAirplane(scene, new THREE.Vector3(-10, 4, 0));

  const aiBBox = new THREE.Box3().setFromObject(ai.airplane);
  // aiBBox.expandByScalar(-0.5);

  // movement & mechanics
  let turnLeft = false;
  let turnRight = false;
  let up = false;
  let down = false;
  let shoot = false;
  let reloaded = true;
  const reloadDelay = 500;
  let useApp = false;
  const $code = (document.querySelector(".code").innerText = authCode);
  const $keyboard = document.querySelector(".keyboard");
  const $app = document.querySelector(".app");
  $keyboard.addEventListener(`click`, () => $clickKeyboard());
  $app.addEventListener(`click`, () => $clickApp());
  sendData("controlMode", false);

  const $clickKeyboard = () => {
    useApp = false;
    document.activeElement.blur();
    sendData("controlMode", false);
    if (!$keyboard.classList.contains("active")) {
      $keyboard.classList.add("active");
    }
    if ($app.classList.contains("active")) {
      $app.classList.remove("active");
    }
    document.querySelector(".steering").innerText =
      "Use 'wasd' to steer the airplane";
    document.querySelector(".shooting").innerText = "Press spacebar to shoot";
  };

  const $clickApp = () => {
    if (!$app.classList.contains("inactive")) {
      useApp = true;
      sendData("controlMode", true);
      if (!$app.classList.contains("active")) {
        $app.classList.add("active");
      }
      if ($keyboard.classList.contains("active")) {
        $keyboard.classList.remove("active");
      }
      document.querySelector(".steering").innerHTML =
        "Hold your phone upright like a flight stick </br>- pull back to fly up </br>- push back to fly down </br>- tilt sideways to steer";
      document.querySelector(".shooting").innerText = "Tap your phone to shoot";
    }
    document.activeElement.blur();
  };

  const toggleButtonState = ($button, className, bool) => {
    if (bool && !$button.classList.contains(className)) {
      $button.classList.add(className);
    } else if (!bool && $button.classList.contains(className)) {
      $button.classList.remove(className);
    }
  };

  // the ground
  const groundGeometry = new THREE.BoxGeometry(120, 1, 120, 1, 1, 1);
  // const groundGeometry = new THREE.PlaneGeometry(50, 50, 25, 25);
  const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x7c878d });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  // plane.rotation.x = -90 * Math.PI / 180; // isometric plane
  // ground.receiveShadow = true;
  scene.add(ground);
  const groundBBox = new THREE.Box3().setFromObject(ground);

  // wave animation
  const waves = [];

  const seaGeometry = new THREE.BoxGeometry(120, 1, 120, 20, 1, 20);
  seaGeometry.mergeVertices();
  seaGeometry.vertices.forEach((v) => {
    waves.push({
      x: v.x,
      y: v.y,
      z: v.z,
      angle: Math.random() * Math.PI * 2,
      distance: Math.random() * (3 - 1) + 1,
      speed:
        Math.random() < 0.5
          ? Math.random() * (0.03 - 0.01) + 0.01
          : -Math.random() * (0.03 - 0.01) + 0.01,
    });
  });

  const seaMat = new THREE.MeshPhongMaterial({
    color: 0x5ad2f4,
    transparent: true,
    opacity: 0.8,
    flatShading: THREE.FlatShading,
  });

  const seaMesh = new THREE.Mesh(seaGeometry, seaMat);
  seaMesh.receiveShadow = true;

  scene.add(seaMesh);

  // HELPERS

  // grid helper
  const size = 50;
  const divisions = 50;
  const gridHelper = new THREE.GridHelper(size, divisions);
  // scene.add(gridHelper);

  //arrow helper // best used in loop
  let velocityHelper;
  let arrowHelper;
  let axisHelper;
  let yawHelper;
  const length = 10;
  const red = 0xff0000;
  const green = 0x00ff00;
  const blue = 0x0000ff;

  //axis helper
  const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);
  const cubeAxesHelper = new THREE.AxesHelper(5);
  // cube.add(cubeAxesHelper);

  // shadow camera
  const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
  // scene.add(shadowHelper);

  // directional light
  const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
  // scene.add( lightHelper );s

  // EVENTS

  // window resize

  const handleWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener(`resize`, handleWindowResize);

  // key logging
  const handleKeyDown = (e) => {
    switch (e.keyCode) {
      case 81: // Q
        turnLeft = true;
        break;
      case 68: // D
        turnRight = true;
        break;
      case 90: // Z
        down = true;
        break;
      case 83: // S
        up = true;
        break;
      case 32: // space
        handlePressShoot();
        start ? (shoot = true) : (start = true);
        break;
    }
  };
  const handlekeyup = (e) => {
    switch (e.keyCode) {
      case 81: // Q
        turnLeft = false;
        break;
      case 68: // D
        turnRight = false;
        break;
      case 90: // Z
        down = false;
        break;
      case 83: // S
        up = false;
        break;
    }
  };

  // listen to events
  window.addEventListener(`keydown`, handleKeyDown);
  window.addEventListener(`keyup`, handlekeyup);

  const handlePressShoot = () => {
    if (start && (dead || win)) {
      reset();
    }
  };

  // FUNCTIONS

  const movePlayer = (mode) => {
    if (!dead && !win) {
      switch (useApp) {
        case true: // accelerometer
          if (accX > deadzone) {
            const angle = map(accX, deadzone, 10, Math.PI / 30, Math.PI / 6);
            player.turnLeft(angle);
            const roll = map(accX, deadzone, 10, Math.PI / 25, Math.PI / 4);
            player.rollLeft(roll);
          }

          if (accX < -deadzone) {
            const angle = map(-accX, deadzone, 10, Math.PI / 30, Math.PI / 6);
            player.turnRight(angle);
            const roll = map(-accX, deadzone, 10, Math.PI / 25, Math.PI / 4);
            player.rollRight(roll);
          }

          if (accY < -deadzone) {
            // down
            const angle = map(-accY, 0, 10, Math.PI / 4, Math.PI / 2);
            player.flyDown(angle);
          }

          if (accY > deadzone) {
            // up
            const angle = map(accY, 0, 10, Math.PI / 4, Math.PI / 2);
            player.flyUp(angle);
          }

          if (accX < deadzone && accX > -deadzone) {
            player.rollNeutral();
          }
          break;
        default:
          // keyboard
          if (turnLeft) {
            // Q is pressed
            player.turnLeft(Math.PI / 6);
            player.rollLeft(Math.PI / 4);
          }

          if (turnRight) {
            // Q is pressed
            player.turnRight(Math.PI / 6);
            player.rollRight(Math.PI / 4);
          }

          if (down) {
            // Z is pressed
            player.flyDown(Math.PI / 2);
          }

          if (up) {
            player.flyUp(Math.PI / 2);
          }

          if ((!turnLeft && !turnRight) || (turnRight && turnLeft)) {
            player.rollNeutral();
          }
          break;
      }

      player.fly();
    }
  };

  const enableGuns = () => {
    // player
    if (shoot && reloaded) {
      player.shoot(scene, 0.5);
      shoot = false;
      setTimeout(() => {
        reloaded = true;
      }, reloadDelay);
      reloaded = false;
    }
    player.updateProjectiles(scene);

    // ai
    ai.autoShoot(scene, 0.4, player, 1400, 10);
    ai.updateProjectiles(scene);
  };

  // COLLISIIONS

  const enableCollisions = () => {
    if (!dead && !win) {
      const groundCollision = player.checkGroundCollision(
        groundBBox,
        "You drowned"
      );
      const playerCollision = player.checkPlayerCollision([ai], "You collided");
      const aiProjectileCollision = ai.checkProjectileCollision(
        [player],
        "You have been hit"
      );

      if (
        groundCollision.collision ||
        playerCollision.collision ||
        aiProjectileCollision.collision
      ) {
        dead = true;
        if (groundCollision.collision) {
          createNewOverlay(groundCollision.cause, "Tap (space) to restart");
        }
        if (playerCollision.collision) {
          createNewOverlay(playerCollision.cause, "Tap (space) to restart");
        }
        if (aiProjectileCollision.collision) {
          createNewOverlay(
            aiProjectileCollision.cause,
            "Tap (space) to restart"
          );
        }
      }

      const playerProjectileCollision = player.checkProjectileCollision(
        [ai],
        "You bested your enemy"
      );
      if (playerProjectileCollision.collision) {
        win = true;
        createNewOverlay(
          playerProjectileCollision.cause,
          "Tap (space) to restart"
        );
      }
    }
  };

  // SEA

  const moveWaves = () => {
    const verts = seaMesh.geometry.vertices;
    verts.forEach((v, i) => {
      const vProps = waves[i];

      // v.x = vProps.x + Math.cos(vProps.angle)*vProps.distance;
      // v.y = vProps.y + Math.sin(vProps.angle) * vProps.distance;
      v.y = vProps.distance;
      vProps.distance += vProps.speed;
      if (vProps.distance > 3) {
        vProps.speed = -vProps.speed;
      }
      if (vProps.distance < 1) {
        vProps.speed = -vProps.speed;
      }
    });

    seaMesh.geometry.verticesNeedUpdate = true;
  };

  // HTML OVERLAYS

  const createNewOverlay = (title, action) => {
    $overlay.querySelector(".title").innerText = title;
    $overlay.querySelector(".restart").innerText = action;
  };

  const showOverlay = () => {
    if ($overlay.classList.contains("hide")) {
      $overlay.classList.remove("hide");
    }
  };

  const hideOverlay = () => {
    if (!$overlay.classList.contains("hide")) {
      $overlay.classList.add("hide");
    }
  };

  // RESET GAME

  const reset = () => {
    // game is not started
    if (start && (dead || win)) {
      start = false;
      dead = false;
      win = false;
    }
    // reset positions
    player.airplane.position.set(0, 4, 0);
    ai.airplane.position.set(-10, 4, 0);
    // reset velocity
    player.velocity.set(1, 0, 0);
    ai.velocity.set(0, 0, 1);
    // reset roll
    player.airplaneChild.rotation.z = 0;
    // delete projectiles
    player.destroyAllProjectiles(scene);
    ai.destroyAllProjectiles(scene);
  };

  // ANIMATE LOOP

  const animate = () => {
    requestAnimationFrame(animate);

    moveWaves();

    showOverlay();

    if (start) {
      hideOverlay();
      ai.autoFly(ai.dirToPlane(player));
      if (!dead && !win) {
        movePlayer(); // 1 enables accelerometer flying
        ai.fly();
        enableGuns();
      }

      enableCollisions();

      // send pitch and roll data;
      const roll = (player.airplaneChild.rotation.z / Math.PI) * 180;
      let pitch = 0;
      player.velocity.y >= 0
        ? (pitch =
            (player.calculatePitchAngle(player.velocity) / Math.PI) * 180)
        : (pitch =
            -(player.calculatePitchAngle(player.velocity) / Math.PI) * 180);
      sendData("orientation", { pitch: pitch, roll: roll });

      if (dead || win) {
        showOverlay();
      }
    }

    player.lookForward();
    ai.lookForward();

    renderer.render(scene, camera);
  };

  animate();
}
