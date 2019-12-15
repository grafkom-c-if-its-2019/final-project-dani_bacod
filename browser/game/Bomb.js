import * as THREE from 'three';
import * as CANNON from 'cannon';

import { scene, world, camera, blockCount, blocksObj, listener } from './main';
import { destroyable, roundFour, destroyBoxForEveryone, createFire } from './utils';

import { Block } from './Explosion';
import store from '../redux/store';

export default class Bomb {
  constructor(id, position, material, userId) {
    this.id = id;
    this.userId = userId;
    this.position = position;
    this.bool = true;
    this.clearTimeout = null;
    this.material = material;
    this.bombMesh;
    this.bombBody;
    this.bombShape;
    this.fire;
    this.fire2;
    this.fire3;
    this.fire4;
    this.fire5;
    this.fire6;
    this.fire7;
    this.fire8;
    this.fire9;
  }

  init() {
    /*----- BOMB EXPLOSION SOUND EFFECT -----*/
    const sound = store.getState().sound;

    if (sound) { this.initSound(); }

    this.bombShape = new CANNON.Sphere(1.5);

    const bombGeometry = new THREE.SphereGeometry(this.bombShape.radius, 32, 32);

    /*----- CREATE BOMB -----*/
    this.bombBody = new CANNON.Body({ mass: 10 });
    this.bombBody.addShape(this.bombShape);
    this.bombMesh = new THREE.Mesh(bombGeometry, this.material);
    this.bombMesh.castShadow = true;
    this.bombMesh.receiveShadow = true;

    /*----- ADD BOMB TO SCENE -----*/
    world.addBody(this.bombBody);
    scene.add(this.bombMesh);

    /*----- FLASHES BOMB RED/BLACK -----*/
    this.initFlashing();
  }

  explode() {
    const x = roundFour(this.bombBody.position.x);
    const y = this.bombBody.position.y + 4;
    const z = roundFour(this.bombBody.position.z);

    const bombParticleGeometry = new THREE.SphereGeometry(0.2, 0.2, 0.2);

    /*----- BOMB PARTICLES -----*/
    const particles = [];
    for (let i = 0; i < blockCount; i++) {
      const bomb = new Block(scene, world, { x: x, y: y, z: z }, 'bomb', bombParticleGeometry, this.material);
      particles.push(bomb);
    }
    blocksObj[this.bombMesh.id] = particles.slice();

    /*----- REMOVE FROM THREEJS & CANNONJS -----*/
    scene.remove(this.bombMesh);
    world.remove(this.bombBody);

    /*----- COORDINATES TO CHECK -----*/
    const middle = `${x}_${z}`;
    const right = `${x + 4}_${z}`;
    const left = `${x - 4}_${z}`;
    const top = `${x}_${z + 4}`;
    const topleft = `${x - 4}_${z + 4}`;
    const topright = `${x + 4}_${z + 4}`;
    const bottom = `${x}_${z - 4}`;
    const bottomleft = `${x - 4}_${z - 4}`;
    const bottomright = `${x + 4}_${z - 4}`;

    /*----- CHECK IF CRATES ARE DESTROYED -----*/
    /*----- EMITS TO SERVER TO UPDATE MAP UPON EXPLOSION -----*/

    if (destroyable[middle]) {
      this.fire = createFire(scene, camera, x, y, z);
      destroyBoxForEveryone(destroyable, middle);
    }

    if (destroyable[right]) {
      this.fire2 = createFire(scene, camera, x + 4, y, z);
      destroyBoxForEveryone(destroyable, right);
    }

    if (destroyable[left]) {
      this.fire3 = createFire(scene, camera, x - 4, y, z);
      destroyBoxForEveryone(destroyable, left);
    }

    if (destroyable[top]) {
      this.fire4 = createFire(scene, camera, x, y, z + 4);
      destroyBoxForEveryone(destroyable, top);
    }

    if (destroyable[topleft]) {
      this.fire4 = createFire(scene, camera, x - 4, y, z + 4);
      destroyBoxForEveryone(destroyable, topleft);
    }

    if (destroyable[topright]) {
      this.fire4 = createFire(scene, camera, x + 4, y, z + 4);
      destroyBoxForEveryone(destroyable, topright);
    }

    if (destroyable[bottom]) {
      this.fire5 = createFire(scene, camera, x, y, z - 4);
      destroyBoxForEveryone(destroyable, bottom);
    }

    if (destroyable[bottomleft]) {
      this.fire5 = createFire(scene, camera, x - 4, y, z - 4);
      destroyBoxForEveryone(destroyable, bottomleft);
    }

    if (destroyable[bottomright]) {
      this.fire5 = createFire(scene, camera, x + 4, y, z - 4);
      destroyBoxForEveryone(destroyable, bottomright);
    }

    // inits fire removal;
    this.removeFire();
  }

  /*----- REMOVE FIRE FROM THE SCENE -----*/
  removeFire() {
    setTimeout(() => {
      if (this.fire) scene.remove(this.fire.mesh);
      if (this.fire2) scene.remove(this.fire2.mesh);
      if (this.fire3) scene.remove(this.fire3.mesh);
      if (this.fire4) scene.remove(this.fire4.mesh);
      if (this.fire5) scene.remove(this.fire5.mesh);
      if (this.fire6) scene.remove(this.fire6.mesh);
      if (this.fire7) scene.remove(this.fire7.mesh);
      if (this.fire8) scene.remove(this.fire8.mesh);
      if (this.fire9) scene.remove(this.fire9.mesh);
      this.fire = null;
      this.fire2 = null;
      this.fire3 = null;
      this.fire4 = null;
      this.fire5 = null;
      this.fire6 = null;
      this.fire7 = null;
      this.fire8 = null;
      this.fire9 = null;

      /*----- SPEED UP ANIMATION FUNCTION -----*/
      this.bool = false;
    }, 1000);
  }

  initSound() {
    const explosionSound = new THREE.PositionalAudio(listener);
    const explosionLoader = new THREE.AudioLoader();
    explosionLoader.load('sounds/explosion.mp3', (buffer) => {
      explosionSound.setBuffer(buffer);
      explosionSound.setRefDistance(10);
      explosionSound.play();
    });
  }

  initFlashing() {
    let colorBool = false;

    let clear;
    setTimeout(() => {
      clear = setInterval(() => {
      if (!colorBool) { this.bombMesh.material.color.setHex(0x510000); }
      else if (colorBool) { this.bombMesh.material.color.setHex(0x000000); }
      colorBool = !colorBool;
    }, 100)}, 800);

    /*----- EXPLODE AFTER 1.7 SEC -----*/
    this.clearTimeout = setTimeout(() => {
      this.explode();
      clearInterval(clear);
      this.bombMesh.material = this.material;
    }, 1700);
  }
}

export { Bomb };

