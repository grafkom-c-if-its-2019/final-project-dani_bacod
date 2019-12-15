import * as THREE from 'three';
import * as CANNON from 'cannon';
import { scene, world } from './main';
import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader'

export default class FixedCube {
  constructor(material, texture, fixedCubeShape, fixedCubeGeometry, x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.fixedCubeMesh = {};
    this.fixedCubeBody = {};
    this.material = material;
    this.texture = texture;
    this.fixedCubeShape = fixedCubeShape;
    this.fixedCubeGeometry = fixedCubeGeometry;
  }

  init() {
    // /*----- CREATE FIXED CUBE -----*/
    // let mtlLoader = new MTLLoader();
    // let objLoader = new OBJLoader();

    // mtlLoader.load('./tree/Tree.mtl', (materials) => {
    //   materials.preload()
    //   objLoader.setMaterials(materials)
    //   objLoader.load('./tree/Tree.obj', (object) => {
    //     object.position.set(this.x, this.y, this.z);
    //     scene.add(object);
    //   })
    // })
    const fixedCubeBody = new CANNON.Body({ mass: 0 });
    fixedCubeBody.addShape(this.fixedCubeShape);
    const fixedCubeMesh = new THREE.Mesh(this.fixedCubeGeometry, this.material);


    /*----- SETS SPAWN POSITION -----*/
    fixedCubeMesh.position.set(this.x, this.y, this.z);
    fixedCubeBody.position.set(fixedCubeMesh.position.x, fixedCubeMesh.position.y, fixedCubeMesh.position.z);
    fixedCubeMesh.castShadow = true;
    fixedCubeMesh.receiveShadow = true;

    scene.add(fixedCubeMesh);
    world.add(fixedCubeBody);

    this.fixedCubeMesh = fixedCubeMesh;
    this.fixedCubeBody = fixedCubeBody;
  }
}
