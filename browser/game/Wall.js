import * as THREE from 'three';
import * as CANNON from 'cannon';

import { scene, world } from './main';
import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader'

export default class Wall {
  constructor(material, texture, fixedCubeShape, fixedCubeGeometry, x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.wallMesh = {};
    this.wallBody = {};
    this.material = material;
    this.texture = texture;
    this.fixedCubeShape = fixedCubeShape;
    this.fixedCubeGeometry = fixedCubeGeometry;
  }

  init() {

    // let mtlLoader = new MTLLoader();
    // let objLoader = new OBJLoader();

    // mtlLoader.load('./wall/wall.mtl', (materials) => {
    //   materials.preload()
    //   objLoader.setMaterials(materials)
    //   objLoader.load('./wall/wall.obj', (object) => {
    //     object.position.set(this.x, this.y, this.z);
    //     scene.add(object);
    //   })
    // })



    /*----- CREATE WALL -----*/
    const wallBody = new CANNON.Body({ mass: 0 });
    wallBody.addShape(this.fixedCubeShape);
    const wallMesh = new THREE.Mesh(this.fixedCubeGeometry, this.material);
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;

    /*----- SET SPAWN POSITION -----*/
    wallMesh.position.set(this.x, this.y, this.z);
    wallBody.position.set(this.x, this.y, this.z);

    scene.add(wallMesh);
    world.add(wallBody);

    this.wallMesh = wallMesh;
    this.wallBody = wallBody;
  }
}
