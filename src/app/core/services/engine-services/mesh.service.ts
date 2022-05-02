import * as THREE from 'three';
import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Injectable({
  providedIn: 'root'
})
export class MeshService {

  constructor() { }

  
  public createMesh(color: string, box, xPosition, yPosition, zPosition, rotateX = true): THREE.Mesh<any, THREE.MeshLambertMaterial> {
    const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color(color).clone(),
    });

    const boxMesh = new THREE.Mesh(box, material);
    boxMesh.rotation.x = rotateX ? Math.PI / 2 : 0;

    boxMesh.position.set(xPosition, yPosition, zPosition);
    return boxMesh;
  }

  
  public createMeshWithTexture(texture: THREE.Texture, box, xPosition, yPosition, zPosition, rotateX = true): THREE.Mesh<any, THREE.MeshBasicMaterial> {
    texture.offset.set( 0, 0 );
    texture.repeat.set( 4, 4 );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    const material = new THREE.MeshBasicMaterial({
      map: texture,

    });

    const boxMesh = new THREE.Mesh(box, material);
    boxMesh.rotation.x = rotateX ? Math.PI / 2 : 0;

    boxMesh.position.set(xPosition, yPosition, zPosition);
    return boxMesh;
  }

}
