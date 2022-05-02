import * as THREE from 'three';
import { AfterViewInit, ElementRef, Injectable, NgZone, OnDestroy, OnInit } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GroundService } from './ground.service';
import { Image3DLoaderService } from './3d-image-loader.service';
import { first } from 'rxjs/operators';
import { dumpObject, frameArea } from '../../../shared/utils/utils.helper';
import { FacultyInfoService } from '../faculty-info.service';

@Injectable({providedIn: 'root'})
export class EngineService {
  private XSize = 100;
  private YSize = 100;
  public canvas: HTMLCanvasElement;
  public renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private cameraFrustrum = this.XSize*0.45;
  public controls: OrbitControls;
  public manager = new THREE.LoadingManager();
  public isLoading = true;
  public frameId: number = null;
  public buildings = [];

  public mouse: THREE.Vector2;
  
  public raycaster: THREE.Raycaster;

  public lastIntersected: THREE.Object3D;

  constructor(
    private ngZone: NgZone,
    private groundService: GroundService,
    private facultyInfoService: FacultyInfoService,
    private objectLoader: Image3DLoaderService,
  ) { }


  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    this.canvas = canvas.nativeElement;

    this.initSceneConfigurations();
    this.addCity();
    this.render();
    this.animate();
  }

  
  public drawCity() {
    if (this.scene) {
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }

      if (this.frameId) {
        cancelAnimationFrame(this.frameId);
      }
  
      if (this.renderer) {
        this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove.bind(this));
        this.renderer.domElement.removeEventListener('click', this.onMouseDown.bind(this));
        // window.removeEventListener('resize', this.onWindowResize.bind(this));
        
        this.initSceneConfigurations();
        this.addCity();
        
        this.render();
        this.animate();
      }
    }
  }
  
  // public setCameraPosition() {
  //   const mapSize = this.mapConfigurations.Width;
  //   const aspect = this.parentContainerDimensions.width / this.parentContainerDimensions.height;
  //   this.frustumSize = mapSize * 0.9;

  //   if (this.themeService.isMobileView && this.parentContainerDimensions.width < this.parentContainerDimensions.height) {
  //     this.frustumSize = mapSize * 3;
  //   } else {
  //     this.frustumSize = mapSize;
  //   }

  //   this.camera.left = (this.frustumSize * aspect) / -2;
  //   this.camera.right = (this.frustumSize * aspect) / 2;
  //   this.camera.top = this.frustumSize / 2;
  //   this.camera.bottom = -this.frustumSize / 2;
  //   this.camera.updateProjectionMatrix();
  //   this.camera.position.set(mapSize, mapSize, mapSize);
  //   this.scene.position.set(0, mapSize / 2, 0);
        
  //   this.renderer.setPixelRatio(2);
  //   this.renderer.sortObjects = false;
  //   this.renderer.setSize(this.parentContainerDimensions.width, this.parentContainerDimensions.height);
  // }

  public initSceneConfigurations() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.outputEncoding = THREE.sRGBEncoding;


    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.renderer.domElement.addEventListener('click', this.onMouseDown.bind(this));
    // window.addEventListener('resize', this.onWindowResize.bind(this));
    
    this.scene = new THREE.Scene();

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100;
    
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

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


    const light = new THREE.DirectionalLight( 0xffffff );
    light.position.set(10,1,100)
    light.castShadow = true; // default false
    this.scene.add( light );
  }

  public onMouseMove( event ) { 
    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1; 
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1; 
    
  } 

  public onMouseDown( event ) { 
    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1; 
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1; 

    this.raycaster.setFromCamera( this.mouse, this.camera );

    let intersects = this.raycaster.intersectObjects( this.scene.children , true );
    
    for ( let i = 0; i < intersects.length; i++ ) {
      const intersectedGroup = this.buildings.find((array) => intersects[i].object.parent.uuid === array.uuid);
      
      if (intersectedGroup) {
        if (!this.lastIntersected || this.lastIntersected.userData.id !== intersectedGroup.userData.id) {
          this.lastIntersected = intersectedGroup;
          console.log(intersectedGroup.userData.id);
          
          this.facultyInfoService.activeFaculty.next(intersectedGroup.userData);
        }
      }
    }
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

        
    // this.raycaster.setFromCamera( this.mouse, this.camera );

    // let intersects = this.raycaster.intersectObjects( this.buildings , true );
        
    // if (intersects.length > 0) {
    //   const intersectedGroup: THREE.Object3D = this.buildings.find((array) => intersects[0].object.parent.uuid === array.uuid);
      
    //   if(intersectedGroup && intersectedGroup.userData.id) {
    //     if (this.lastIntersected && intersectedGroup.userData.id !== this.lastIntersected.userData.id ) {
    //       this.lastIntersected.userData.scaleDown(this.lastIntersected);
    //     }

    //     this.lastIntersected = intersectedGroup;
    //     this.lastIntersected.userData.scaleUp(this.lastIntersected);
    //   } else {
    //     this.lastIntersected = null;
    //   }
    // }  else {
    //   if (this.lastIntersected) {
    //     this.lastIntersected.userData.scaleDown(this.lastIntersected);
    //     }
    //     this.lastIntersected = null;
    //   }
      }
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      // if (this.buildings) {
      //   for (const car of this.buildings.children) {
      //     // car.rotation.y++;
      //   }
      // }
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
      this.scene.add(root);
      console.log(root);
      
      for (let index = 0; index < 8; index++) {
        const building = root.getObjectByName('bloc'+index);

        if (building) {
          building.userData = {
            title: 'Some FACULTY with index' + index,
            id: 'bla-bla-id-'+index
          };
  
          this.buildings.push(building);
        }
      }

      const box = new THREE.Box3().setFromObject(root);
      const boxSize = box.getSize(new THREE.Vector3())
      const boxCenter = box.getCenter(new THREE.Vector3());

      frameArea(boxSize.length() * 0.5, boxSize.length(), boxCenter, this.camera, this.cameraFrustrum);

      this.scene.translateY(2);
      this.controls.maxDistance = boxSize.length() * 10;
      this.controls.target.copy(boxCenter);
      this.controls.update();
    });
  }
}
