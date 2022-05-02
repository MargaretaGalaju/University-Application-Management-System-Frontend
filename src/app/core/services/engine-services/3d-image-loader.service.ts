import { Injectable } from '@angular/core';
import { Observable, Observer, of } from 'rxjs';
import { Group } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

@Injectable({
  providedIn: 'root'
})
export class Image3DLoaderService {
  public GLTFloader: GLTFLoader;
  public fbxLoader: FBXLoader;

  constructor() { 
    this.GLTFloader = new GLTFLoader();
    this.fbxLoader  = new FBXLoader()

  }

  public getGLTFObject(gltfPath: string): Observable<GLTF> {
    return new Observable((observer: Observer<GLTF>) => {
      this.GLTFloader.load(gltfPath, (gltf) => {
        observer.next(gltf);
        observer.complete();
      });
    });
  }

  
  public getFBXObject(FBXPath: string): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.fbxLoader.load(FBXPath, (FBX) => {
        observer.next(FBX);
        observer.complete();
      });
    });
  }
}
