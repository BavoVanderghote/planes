import { Sphere } from "three";

export default class Projectile {
  constructor(THREE) {
    this.THREE = THREE;
    this.velocity = new this.THREE.Vector3();
    this.geometry = new this.THREE.SphereGeometry(0.1, 16, 16);
    this.material = new this.THREE.MeshPhongMaterial({ color: 0x505050 });
    this.mesh = new this.THREE.Mesh(this.geometry, this.material);
    this.removed = false;
    this.bSphere = new Sphere(
      this.mesh.position,
      this.geometry.boundingSphere ? this.geometry.boundingSphere.radius : 0.1
    );
  }

  show(scene, position) {
    this.mesh.position.set(position.x, position.y, position.z);
    scene.add(this.mesh);
  }

  setVelocity(dir, speed = 0.1) {
    this.velocity.set(dir.x, dir.y, dir.z);
    this.velocity.setLength(speed);
  }

  move() {
    this.mesh.position.add(this.velocity);
  }

  outOfBounds(scene, x, z) {
    if (
      (this.mesh.position.x > x ||
        this.mesh.position.x < -x ||
        this.mesh.position.z > z ||
        this.mesh.position.z < -z) &&
      !this.removed
    ) {
      scene.remove(this.mesh);
      this.removed = true;
    }
  }

  destroy(scene) {
    scene.remove(this.mesh);
  }
}
