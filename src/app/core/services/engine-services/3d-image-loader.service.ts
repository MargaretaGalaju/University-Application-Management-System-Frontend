import { Injectable } from '@angular/core';
import { Observable, Observer, of } from 'rxjs';
import { Group } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Injectable({
  providedIn: 'root'
})
export class Image3DLoaderService {
  public loader: GLTFLoader;

  constructor() { 
    this.loader = new GLTFLoader();
  }

  public getGLTFObject(gltfPath: string): Observable<GLTF> {
    return new Observable((observer: Observer<GLTF>) => {
      this.loader.load(gltfPath, (gltf) => {
        observer.next(gltf);
        observer.complete();
      });
    });
  }
}
