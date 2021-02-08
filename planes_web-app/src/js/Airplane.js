import Projectile from "./Projectile.js";
import { map } from "./functions";

export default class Airplane {
  constructor(THREE) {
    this.THREE = THREE;
    this.velocity = new THREE.Vector3(1, 0, 0);
    this.pitch = new THREE.Vector3(0, 0, 0);
    // this.pitchAngle = new
    this.yaw = new THREE.Vector3(0, 0, 0);
    this.speed = 50 / 1000;
    this.yawSpeed = 1 / 1000;
    this.pitchSpeed = 1 / 1000;
    this.rollSpeed = Math.PI / 120;
    this.airplane = new this.THREE.Object3D();
    this.airplaneChild = new this.THREE.Object3D(); // extra child so that airplane can be moved relative to the parent axes.
    this.propeller = new this.THREE.Object3D();
    this.projectiles = [];
    this.reloaded = true;
    this.timeOut = setTimeout(() => {
      if (!this.reloaded) {
        this.reloaded = true;
      }
    }, 1000);
    this.bBox = new THREE.Box3().setFromObject(this.airplane);
  }

  showAirplane(scene, position) {
    this.airplane.position.set(position.x, position.y, position.z);
    scene.add(this.airplane);
  }

  turnLeft(angle) {
    // console.log("turning left", angle);
    this.yaw.applyAxisAngle(new this.THREE.Vector3(0, 1, 0), angle).normalize(); // rotate the velocity vector around the y-axis
  }

  turnRight(angle) {
    // console.log("turning right", angle);
    this.yaw
      .applyAxisAngle(new this.THREE.Vector3(0, 1, 0), -angle)
      .normalize(); // rotate the velocity vector around the y-axis
  }

  flyDown(angle) {
    if (this.velocity.z < 0) {
      // make sure the rotation axis is always the same relative to the airplane
      // if (this.calculatePitchAngle(this.velocity.clone().add(this.pitch.clone().applyAxisAngle(new this.THREE.Vector3(1, 0, 0).applyAxisAngle(new this.THREE.Vector3(0, 1, 0), Math.atan(this.velocity.x / this.velocity.z)), -Math.PI / 2))) < 30 / 180 * Math.PI) {
      // Rotate around an axis in the world-X-Z-plane perpendicular to the velocity vector
      this.pitch.applyAxisAngle(
        new this.THREE.Vector3(1, 0, 0).applyAxisAngle(
          new this.THREE.Vector3(0, 1, 0),
          Math.atan(this.velocity.x / this.velocity.z)
        ),
        -angle
      );
      // }
    } else {
      // if (this.calculatePitchAngle(this.velocity.clone().add(this.pitch.clone().applyAxisAngle(new this.THREE.Vector3(1, 0, 0).applyAxisAngle(new this.THREE.Vector3(0, 1, 0), Math.PI + Math.atan(this.velocity.x / this.velocity.z)), -Math.PI / 2))) < 30 / 180 * Math.PI) {
      // Rotate around an axis in the world-X-Z-plane perpendicular to the velocity vector
      this.pitch.applyAxisAngle(
        new this.THREE.Vector3(1, 0, 0).applyAxisAngle(
          new this.THREE.Vector3(0, 1, 0),
          Math.PI + Math.atan(this.velocity.x / this.velocity.z)
        ),
        -angle
      );
      // }
    }
  }

  flyUp(angle) {
    if (this.velocity.z < 0) {
      // make sure the rotation axis is always the same relative to the airplane
      // if (this.calculatePitchAngle(this.velocity.clone().add(this.pitch.clone().applyAxisAngle(new this.THREE.Vector3(1, 0, 0).applyAxisAngle(new this.THREE.Vector3(0, 1, 0), Math.atan(this.velocity.x / this.velocity.z)), Math.PI / 2))) < 30 / 180 * Math.PI) {
      // Rotate around an axis in the world-X-Z-plane perpendicular to the velocity vector
      this.pitch.applyAxisAngle(
        new this.THREE.Vector3(1, 0, 0).applyAxisAngle(
          new this.THREE.Vector3(0, 1, 0),
          Math.atan(this.velocity.x / this.velocity.z)
        ),
        angle
      );
      // }
    } else {
      // if (this.calculatePitchAngle(this.velocity.clone().add(this.pitch.clone().applyAxisAngle(new this.THREE.Vector3(1, 0, 0).applyAxisAngle(new this.THREE.Vector3(0, 1, 0), Math.PI + Math.atan(this.velocity.x / this.velocity.z)), Math.PI / 2))) < 30 / 180 * Math.PI) {
      // Rotate around an axis in the world-X-Z-plane perpendicular to the velocity vector
      this.pitch.applyAxisAngle(
        new this.THREE.Vector3(1, 0, 0).applyAxisAngle(
          new this.THREE.Vector3(0, 1, 0),
          Math.PI + Math.atan(this.velocity.x / this.velocity.z)
        ),
        angle
      );
      // }
    }
  }

  autoFly(vector) {
    // console.log(this.calculateAngleVertical(vector));
    const horizontalAngle = this.calculateAngleHorizontal(
      vector,
      this.velocity
    );
    const verticalAngle = this.calculateAngleVertical(vector, this.velocity);

    if (horizontalAngle < Math.PI / 6 && horizontalAngle > 0) {
      this.yaw
        .applyAxisAngle(new this.THREE.Vector3(0, 1, 0), horizontalAngle)
        .normalize(); // rotate the velocity vector around the y-axis
      const roll = map(
        horizontalAngle,
        0,
        Math.PI / 6,
        Math.PI / 25,
        Math.PI / 4
      );
      this.rollLeft(roll);
    } else if (horizontalAngle > Math.PI / 6) {
      this.turnLeft(Math.PI / 6);
      this.rollLeft(Math.PI / 4);
    }
    if (horizontalAngle > -Math.PI / 6 && horizontalAngle < 0) {
      this.yaw
        .applyAxisAngle(new this.THREE.Vector3(0, 1, 0), horizontalAngle)
        .normalize(); // rotate the velocity vector around the y-axis
      const roll = map(
        horizontalAngle,
        0,
        -Math.PI / 6,
        Math.PI / 25,
        Math.PI / 4
      );
      this.rollRight(roll);
    } else if (horizontalAngle < -Math.PI / 6) {
      this.turnRight(Math.PI / 6);
      this.rollRight(Math.PI / 4);
    }

    if (verticalAngle < 0) {
      this.flyDown(Math.PI / 2);
    }
    if (verticalAngle > 0) {
      this.flyUp(Math.PI / 2);
    }

    this.pitch.clampLength(0, this.pitchSpeed);
    this.yaw.clampLength(0, this.yawSpeed);

    this.velocity.add(this.yaw); // add horizontal movement
    this.velocity.add(this.pitch); // add vertical movement

    this.velocity.setLength(this.speed); // limit airplane speed

    // this.airplane.position.add(this.velocity); // move airplane

    this.pitch = this.velocity.clone();
    this.yaw = this.velocity.clone();

    this.rotatePropeller();
  }

  calculateAngleHorizontal(vector, base) {
    // 𝑑=(𝑥−𝑥1)(𝑦2−𝑦1)−(𝑦−𝑦1)(𝑥2−𝑥1)
    return Math.asin(
      vector.clone().normalize().x * base.clone().normalize().z -
        vector.clone().normalize().z * base.clone().normalize().x
    );
  }

  calculateAngleVertical(vector, base) {
    const flatVector = base
      .clone()
      .applyAxisAngle(
        new this.THREE.Vector3(0, 1, 0),
        this.calculateAngleHorizontal(vector, this.velocity)
      );
    const projectedVector = vector
      .clone()
      .normalize()
      .projectOnVector(flatVector);
    const d = vector.distanceTo(projectedVector);
    // console.log(Math.asin(d / 1)/Math.PI*180);
    // console.log(`vectical agnle`);
    // console.log(Math.asin(d / vector.length())/Math.PI*180);
    // console.log(- projectedVector.clone().normalize().y + vector.y);
    if (-projectedVector.clone().normalize().y + vector.y >= 0) {
      return Math.asin(d / vector.length());
    } else if (-projectedVector.clone().normalize().y + vector.y < 0) {
      return -Math.asin(d / vector.length());
    }
  }

  calculatePitchAngle(vector) {
    // console.log(vector.angleTo(vector.clone().projectOnPlane(new this.THREE.Vector3(0, 1, 0))));
    return vector.angleTo(
      vector.clone().projectOnPlane(new this.THREE.Vector3(0, 1, 0))
    );
  }

  fly() {
    // limit the pitch and yaw speed
    this.pitch.clampLength(0, this.pitchSpeed);
    this.yaw.clampLength(0, this.yawSpeed);
    // update velocity
    this.velocity.add(this.yaw); // add horizontal movement
    this.velocity.add(this.pitch); // add vertical movement
    // limit airplane speed
    this.velocity.setLength(this.speed); // limit airplane speed
    // move the airplane
    this.airplane.position.add(this.velocity); // move airplane

    this.pitch = this.velocity.clone();
    this.yaw = this.velocity.clone();

    this.rotatePropeller();
  }

  dirToPlane(player) {
    // if (airplane.airplane.position.angleTo(this.airplane.position))
    return player.airplane.position
      .clone()
      .sub(this.airplane.position)
      .normalize();
  }

  // limitVelocityChange(vector) {
  //   console.log(this.airplane.position.angleTo(vector));
  // }

  influenceVelocity(vector) {
    this.velocity.add(vector.setLength(0.01));
  }

  rollLeft(rad) {
    if (this.airplaneChild.rotation.z > -rad) {
      this.airplaneChild.rotation.z -= this.rollSpeed;
    } else if (this.airplaneChild.rotation.z < -rad) {
      this.airplaneChild.rotation.z += this.rollSpeed;
    }
  }

  rollRight(rad) {
    if (this.airplaneChild.rotation.z < rad) {
      this.airplaneChild.rotation.z += this.rollSpeed;
    } else if (this.airplaneChild.rotation.z > rad) {
      this.airplaneChild.rotation.z -= this.rollSpeed;
    }
  }

  rollNeutral() {
    if (this.airplaneChild.rotation.z < 0) {
      this.airplaneChild.rotation.z += this.rollSpeed;
      if (this.airplaneChild.rotation.z > -this.rollSpeed) {
        this.airplaneChild.rotation.z = 0;
      }
    } else if (this.airplaneChild.rotation.z > 0) {
      this.airplaneChild.rotation.z -= this.rollSpeed;
      if (this.airplaneChild.rotation.z < this.rollSpeed) {
        this.airplaneChild.rotation.z = 0;
      }
    }
  }

  limitControls(pitchSpeed = 1, yawSpeed = 1, speed = 50) {
    (this.pitch = 0), pitchSpeed / 1000;
    this.yaw = yawSpeed / 1000;
    this.velocity = speed / 1000; // limit airplane speed
  }

  limitPitch(pitchSpeed) {
    this.pitchSpeed = pitchSpeed / 1000;
  }

  limitYaw(yawSpeed) {
    this.yawSpeed = yawSpeed / 1000;
  }

  limitSpeed(speed) {
    this.speed = speed / 1000; // limit airplane speed
  }

  lookForward() {
    const target = this.airplane.position.clone().add(this.velocity);
    this.airplane.lookAt(target);
  }

  showAxes() {
    const cubeAxesHelper = new this.THREE.AxesHelper(5);
    this.airplane.add(cubeAxesHelper);
  }

  showVelocity(scene) {
    // scene.remove(velocityHelper);
    const velocityHelper = new this.THREE.ArrowHelper(
      this.velocity.clone().normalize(),
      this.airplane.position,
      10,
      0xff0000
    );
    scene.add(velocityHelper);
  }

  showYaw(scene) {
    // scene.remove(velocityHelper);
    const yawHelper = new this.THREE.ArrowHelper(
      this.yaw.clone().normalize(),
      this.airplane.position,
      10,
      0x00ff00
    );
    scene.add(yawHelper);
  }

  flyControls(turnLeft, turnRight, flyDown, flyUp) {
    // pitch and yaw equal to velocity so they have a certain icrement each frame and don't grow

    if (turnLeft) {
      // Q is pressed
      this.turnLeft(Math.PI / 6); // rotate the velocity vector around the y-axis
    }

    if (turnRight) {
      // D is pressed
      this.turnRight(Math.PI / 6); // rotate the velocity vector around the y-axis
    }

    if (flyDown) {
      // Z is pressed
      this.flyDown(Math.PI / 2);
    }

    if (flyUp) {
      this.flyUp(Math.PI / 2);
    }

    // limit the pitch and yaw speed
    this.pitch.clampLength(0, this.pitchSpeed);
    this.yaw.clampLength(0, this.yawSpeed);
    // update velocity
    this.velocity.add(this.yaw); // add horizontal movement
    this.velocity.add(this.pitch); // add vertical movement
    // limit airplane speed
    this.velocity.clampLength(0, this.speed); // limit airplane speed
    // move the airplane
    this.airplane.position.add(this.velocity); // move airplane

    this.pitch = this.velocity.clone();
    this.yaw = this.velocity.clone();

    // this.rotatePropeller();
  }

  rotatePropeller() {
    this.propeller.rotation.z += -0.5;
  }

  createAirplane(baseColor, accentColor) {
    // cockpit
    const geomCockpit = new this.THREE.CylinderGeometry(0.5, 0.2, 2, 32);
    const matCockpit = new this.THREE.MeshPhongMaterial({
      color: baseColor,
      flatShading: true,
    });
    const cockpit = new this.THREE.Mesh(geomCockpit, matCockpit);
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    cockpit.rotation.x = Math.PI / 2;
    this.airplaneChild.add(cockpit);

    // engine
    const geomEngine = new this.THREE.CylinderGeometry(0.5, 0.5, 0.3, 32);
    const matEngine = new this.THREE.MeshPhongMaterial({
      color: accentColor,
      flatShading: true,
    });
    const engine = new this.THREE.Mesh(geomEngine, matEngine);
    engine.castShadow = true;
    engine.receiveShadow = true;
    engine.rotation.x = Math.PI / 2;
    engine.position.z = 1.1;
    this.airplaneChild.add(engine);

    // tail
    const geomTail = new this.THREE.BoxGeometry(1, 0.1, 0.3, 1, 1, 1);
    const matTail = new this.THREE.MeshPhongMaterial({
      color: baseColor,
      flatShading: true,
    });
    const tail = new this.THREE.Mesh(geomTail, matTail);
    tail.castShadow = true;
    tail.receiveShadow = true;
    tail.position.z = -1.1;
    this.airplaneChild.add(tail);

    // tail extension
    const geomTailExtension = new this.THREE.BoxGeometry(1, 0.1, 0.1, 1, 1, 1);
    const matTailExtension = new this.THREE.MeshPhongMaterial({
      color: accentColor,
      flatShading: true,
    });
    const tailExtension = new this.THREE.Mesh(
      geomTailExtension,
      matTailExtension
    );
    tailExtension.castShadow = true;
    tailExtension.receiveShadow = true;
    tailExtension.position.z = -0.2;
    tail.add(tailExtension);

    // rudder
    const geomRudder = new this.THREE.BoxGeometry(0.1, 0.4, 0.25, 1, 1, 1);
    const matRudder = new this.THREE.MeshPhongMaterial({
      color: baseColor,
      flatShading: true,
    });
    const rudder = new this.THREE.Mesh(geomRudder, matRudder);
    rudder.castShadow = true;
    rudder.receiveShadow = true;
    rudder.position.z = -0.05;
    rudder.position.y = 0.2;
    tail.add(rudder);

    // rudder extension
    const geomRudderExtension = new this.THREE.BoxGeometry(
      0.1,
      0.4,
      0.1,
      1,
      1,
      1
    );
    const matRudderExtension = new this.THREE.MeshPhongMaterial({
      color: accentColor,
      flatShading: true,
    });
    const rudderExtension = new this.THREE.Mesh(
      geomRudderExtension,
      matRudderExtension
    );
    rudderExtension.castShadow = true;
    rudderExtension.receiveShadow = true;
    rudderExtension.position.z = -0.2;
    rudderExtension.position.y = 0.2;
    tail.add(rudderExtension);

    // wing
    const geoWing = new this.THREE.BoxGeometry(3, 0.1, 0.6, 1, 1, 1);
    const matWing = new this.THREE.MeshPhongMaterial({
      color: baseColor,
      flatShading: true,
    });
    const wing = new this.THREE.Mesh(geoWing, matWing);
    wing.castShadow = true;
    wing.receiveShadow = true;
    wing.position.z = 0.45;
    wing.position.y = 0.45;
    this.airplaneChild.add(wing);

    // wing 2
    const geoWingTwo = new this.THREE.BoxGeometry(3, 0.1, 0.6, 1, 1, 1);
    const matWingTwo = new this.THREE.MeshPhongMaterial({
      color: baseColor,
      flatShading: true,
    });
    const wingTwo = new this.THREE.Mesh(geoWingTwo, matWingTwo);
    wingTwo.castShadow = true;
    wingTwo.receiveShadow = true;
    wingTwo.position.z = 0.45;
    wingTwo.position.y = -0.45;
    this.airplaneChild.add(wingTwo);

    // wing line
    const geoWingLine = new this.THREE.BoxGeometry(3, 0.1, 0.1, 1, 1, 1);
    const matWingLine = new this.THREE.MeshPhongMaterial({
      color: accentColor,
      flatShading: true,
    });
    const wingLine = new this.THREE.Mesh(geoWingLine, matWingLine);
    wingLine.castShadow = true;
    wingLine.receiveShadow = true;
    wingLine.position.z = 0.1;
    wingLine.position.y = 0.45;
    this.airplaneChild.add(wingLine);

    // wing line 2
    const geoWingLineTwo = new this.THREE.BoxGeometry(3, 0.1, 0.1, 1, 1, 1);
    const matWingLineTwo = new this.THREE.MeshPhongMaterial({
      color: accentColor,
      flatShading: true,
    });
    const wingLineTwo = new this.THREE.Mesh(geoWingLineTwo, matWingLineTwo);
    wingLineTwo.castShadow = true;
    wingLineTwo.receiveShadow = true;
    wingLineTwo.position.z = 0.1;
    wingLineTwo.position.y = -0.45;
    this.airplaneChild.add(wingLineTwo);

    // propeller
    const geoPropeller = new this.THREE.BoxGeometry(0.15, 1.2, 0.1, 1, 1, 1);
    const matPropeller = new this.THREE.MeshPhongMaterial({
      color: 0x808080,
      flatShading: true,
    });
    this.propeller = new this.THREE.Mesh(geoPropeller, matPropeller);
    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;
    this.propeller.position.z = 1.4;
    this.airplaneChild.add(this.propeller);

    // propeller adapter
    const geoPropellerAdapter = new this.THREE.BoxGeometry(
      0.1,
      0.1,
      0.1,
      1,
      1,
      1
    );
    const matPropellerAdapter = new this.THREE.MeshPhongMaterial({
      color: 0x808080,
      flatShading: true,
    });
    const propellerAdapter = new this.THREE.Mesh(
      geoPropellerAdapter,
      matPropellerAdapter
    );
    propellerAdapter.castShadow = true;
    propellerAdapter.receiveShadow = true;
    propellerAdapter.position.z = -0.1;
    this.propeller.add(propellerAdapter);

    // pilot
    const geoPilot = new this.THREE.SphereGeometry(0.2, 32, 32);
    const matPilot = new this.THREE.MeshPhongMaterial({
      color: 0x808080,
      flatShading: true,
    });
    const pilot = new this.THREE.Mesh(geoPilot, matPilot);
    pilot.castShadow = true;
    pilot.receiveShadow = true;
    pilot.position.z = -0.45;
    pilot.position.y = 0.35;
    this.airplaneChild.add(pilot);

    // back wheel
    const geoBackWheel = new this.THREE.CylinderGeometry(0.1, 0.1, 0.1, 32);
    const matBackWheel = new this.THREE.MeshPhongMaterial({
      color: 0x505050,
      flatShading: true,
    });
    const backwheel = new this.THREE.Mesh(geoBackWheel, matBackWheel);
    backwheel.castShadow = true;
    backwheel.receiveShadow = true;
    backwheel.rotation.z = Math.PI / 2;
    backwheel.position.set(0, -0.25, -1);
    this.airplaneChild.add(backwheel);

    // left front wheel
    const geoLeftWheel = new this.THREE.CylinderGeometry(0.1, 0.1, 0.1, 32);
    const matLeftWheel = new this.THREE.MeshPhongMaterial({
      color: 0x505050,
      flatShading: true,
    });
    const leftwheel = new this.THREE.Mesh(geoLeftWheel, matLeftWheel);
    leftwheel.castShadow = true;
    leftwheel.receiveShadow = true;
    leftwheel.rotation.z = Math.PI / 2;
    leftwheel.position.set(0.8, -0.6, 0.3);
    this.airplaneChild.add(leftwheel);

    // left front wheel
    const geoRightWheel = new this.THREE.CylinderGeometry(0.1, 0.1, 0.1, 32);
    const matRightWheel = new this.THREE.MeshPhongMaterial({
      color: 0x505050,
      flatShading: true,
    });
    const rightwheel = new this.THREE.Mesh(geoRightWheel, matRightWheel);
    rightwheel.castShadow = true;
    rightwheel.receiveShadow = true;
    rightwheel.rotation.z = Math.PI / 2;
    rightwheel.position.set(-0.8, -0.6, 0.3);
    this.airplaneChild.add(rightwheel);

    this.airplane.add(this.airplaneChild);
  }

  shoot(scene, speed) {
    const p = new Projectile(this.THREE);
    p.setVelocity(this.velocity, speed);
    p.show(scene, this.airplane.position);
    this.projectiles.push(p);
  }

  updateProjectiles(scene) {
    this.projectiles.forEach((p) => {
      p.move();
      p.outOfBounds(scene, 60, 60);
    });
  }

  autoShoot(scene, speed, player, interval, angle) {
    if (
      this.velocity.angleTo(this.dirToPlane(player)) <
        (angle * Math.PI) / 180 &&
      this.reloaded
    ) {
      clearTimeout(this.timeOut);
      const p = new Projectile(this.THREE);
      p.setVelocity(this.velocity, speed);
      p.show(scene, this.airplane.position);
      this.projectiles.push(p);

      this.reloaded = false;
      this.timeOut = setTimeout(() => {
        if (!this.reloaded) {
          this.reloaded = true;
        }
      }, interval);
    }
  }

  updateBBox() {
    this.bBox.setFromObject(this.airplane);
    this.bBox.expandByScalar(-0.5);
  }

  checkGroundCollision(ground, cause) {
    if (!ground) {
      return;
    }
    this.updateBBox();
    if (this.bBox.intersectsBox(ground)) {
      return { collision: true, cause: cause };
    } else {
      return { collision: false, cause: "" };
    }
  }

  checkPlayerCollision(players, cause) {
    let crashed = false;
    let player = null;
    if (players.length > 0) {
      this.updateBBox();
      players.forEach((p, i) => {
        p.updateBBox();
        if (this.bBox.intersectsBox(p.bBox)) {
          crashed = true;
          player = p;
        }
      });
      return {
        collision: crashed,
        cause: crashed ? cause : "",
        player: player,
      };
    }
  }

  checkProjectileCollision(players, cause) {
    let hit = false;
    if (players.length > 0) {
      players.forEach((p) => {
        this.projectiles.forEach((pr) => {
          if (p.bBox.containsPoint(pr.bSphere.center)) {
            hit = true;
          }
        });
      });
      return {
        collision: hit,
        cause: hit ? cause : "",
        player: this,
      };
    }
  }

  destroyAllProjectiles(scene) {
    this.projectiles.forEach((p) => {
      p.destroy(scene);
    });
  }
}
