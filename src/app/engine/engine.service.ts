import * as THREE from 'three';
import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GroundService } from './engine-services/ground.service';
import { Image3DLoaderService } from './engine-services/3d-image-loader.service';
import { first } from 'rxjs/operators';
import { dumpObject, frameArea } from '../shared/utils/utils.helper';

@Injectable({providedIn: 'root'})
export class EngineService implements OnDestroy {
  private XSize = 100;
  private YSize = 100;
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private cameraFrustrum = this.XSize*0.45;
  public controls: OrbitControls;
  public manager = new THREE.LoadingManager();
  public isLoading = true;
  private frameId: number = null;
  public buildings;

  constructor(
    private ngZone: NgZone,
    private groundService: GroundService,
    private objectLoader: Image3DLoaderService,
  ) { }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.renderer != null) {
      this.renderer.dispose();
      this.renderer = null;
      this.canvas = null;
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    this.canvas = canvas.nativeElement;

    this.initSceneConfigurations();
    this.addCity();
    this.render();
    this.animate();
  }

  public initSceneConfigurations() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });

    this.renderer.setSize( window.innerWidth, window.innerHeight );
  
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xB1E1FF );

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 10, 20);

    this.controls = new OrbitControls( this.camera, this.renderer.domElement );

    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    this.controls.enableRotate = true;

    this.toggleUIControls(true);
    
    this.controls.update();
    this.scene.translateY(this.XSize/1.75);
    this.light = new THREE.AmbientLight( 0xffffff );
    this.light.position.set(10,10,4)
    this.scene.add( this.light );


    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    light.position.set(10,10,4)
    this.scene.add(light);
  }

  public animate(): void {
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });

        // window.addEventListener('resize', () => {
        //   this.resize();
        // });
      }
    });
  }

  public render(): void {
    // let time;
    // this.time *= 0.001;  // convert to seconds
    this.frameId = requestAnimationFrame(() => {
      if (this.buildings) {
        for (const car of this.buildings.children) {
          // car.rotation.y++;
        }
      }
      this.render();
    });
    this.renderer.render(this.scene, this.camera);
  }


  public toggleUIControls(enableFullNavigation: boolean) {
    if (enableFullNavigation) {
      this.controls.minPolarAngle = 0;
      this.controls.maxPolarAngle = Math.PI;

      this.controls.minAzimuthAngle = 0;
      this.controls.maxAzimuthAngle = Math.PI;
    } else {
      this.controls.minPolarAngle = Math.PI / 3.25;
      this.controls.maxPolarAngle = Math.PI / 3;

      this.controls.minAzimuthAngle = Math.PI / 6;
      this.controls.maxAzimuthAngle = Math.PI / 3;
    }
  }

  public addCity() {
    this.objectLoader.getGLTFObject(`assets/gltf-objects/Unipply-city.glb`).pipe(first()).subscribe((gltf) => {
      const root = gltf.scene;
      this.scene.add(root)
      // console.log(dumpObject(root).join('\n'));

      const box = new THREE.Box3().setFromObject(root);
      const boxSize = box.getSize(new THREE.Vector3())
      const boxCenter = box.getCenter(new THREE.Vector3());

      frameArea(boxSize.length() * 0.5, boxSize.length(), boxCenter, this.camera, this.cameraFrustrum);

      this.controls.maxDistance = boxSize.length() * 10;
      this.controls.target.copy(boxCenter);
      this.controls.update();
    });
  }
}
