import * as THREE from 'three';
import * as CANNON from 'cannon';
import { scene, world } from './main';
import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader'

export default class FixedTree {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  init() {
    /*----- CREATE FIXED CUBE -----*/
    let mtlLoader = new MTLLoader();
    let objLoader = new OBJLoader();

    mtlLoader.load('./tree/Tree.mtl', (materials) => {
      materials.preload()
      objLoader.setMaterials(materials)
      objLoader.load('./tree/Tree.obj', (object) => {
        object.position.set(this.x, this.y, this.z);
        object.traverse(function(node){
          if( node instanceof THREE.Mesh ){
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        scene.add(object);
      })
    })
  }
}
