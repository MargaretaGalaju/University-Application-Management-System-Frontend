import * as THREE from 'three';
import { ElementRef, Injectable, NgZone } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Image3DLoaderService } from './3d-image-loader.service';
import { first } from 'rxjs/operators';
import { frameArea } from '../../../shared/utils/utils.helper';
import { FacultyInfoService } from '../faculty-info.service';
import { Vector3 } from 'three';
import { Faculty } from 'src/app/shared/models/faculty.model';
import { LoadingService } from '../loading.service';
import { FacultyIdEnum } from '../../constants/faculty-id.enum';

@Injectable()
export class EngineService {
  public canvas: HTMLCanvasElement;
  public renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private cameraFrustrum = 45;

  public controls: OrbitControls;
  public manager = new THREE.LoadingManager();
  public isLoading = true;
  public frameId: number = null;

  public buildings: THREE.Object3D<THREE.Event>[] = [];
  public faculties: Faculty[] = [];

  public mouse: THREE.Vector2;
  public raycaster: THREE.Raycaster;

  public lastIntersected: THREE.Object3D;
  public lastIntersected1: THREE.Object3D;

  public initialScenePositions: Vector3;
  public translatedScenePositions: Vector3;
  public translatedBackScenePositions: Vector3;

  public initialCameraPositions: Vector3;
  public translatedCameraPositions: Vector3;
  public translatedBackCameraPositions: Vector3;
      
  public elementToChange;
  public isRecommendationsPage: boolean;

  constructor(
    private readonly ngZone: NgZone,
    private readonly facultyInfoService: FacultyInfoService,
    private readonly objectLoader: Image3DLoaderService,
    private readonly loadingService: LoadingService,
  ) {
    this.facultyInfoService.activeFaculty$.subscribe((faculty) => {
      if (!faculty) {
        this.translatedScenePositions = null;
        this.translatedBackScenePositions = new Vector3(this.initialScenePositions.x, 0, this.initialScenePositions.z)
      } else {
        if (!this.translatedScenePositions) {
          this.translatedBackScenePositions = null;
          this.translatedScenePositions = new Vector3(this.scene.position.x-4, 0, this.scene.position.z+4)
        }
      }
    });
   }

  public createScene(canvas: ElementRef<HTMLCanvasElement>, isRecommendationsPage?:boolean): void {
    this.canvas = canvas.nativeElement;
    this.isRecommendationsPage = isRecommendationsPage;
    
    this.initSceneConfigurations();
    this.addCity();
    this.render();
    this.animate();
    this.loadingService.stopLoading();
  }

  public initSceneConfigurations(): void {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.renderer.domElement.addEventListener('click', this.onMouseDown.bind(this));
    

    const fov = 45;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    this.controls.enableRotate = !this.isRecommendationsPage;
    this.toggleUIControls(true);
    this.controls.update();
    
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

    if (this.isRecommendationsPage) {
      return;
    }

    this.raycaster.setFromCamera( this.mouse, this.camera );

    let intersects = this.raycaster.intersectObjects( this.scene.children , true );
    
    for ( let i = 0; i < intersects.length; i++ ) {
      const intersectedGroup = this.buildings.find((array) => intersects[i].object.parent.uuid === array.uuid);
      
      if (intersectedGroup) {
        if (!this.lastIntersected || this.lastIntersected.userData.id !== intersectedGroup.userData.id) {
          this.lastIntersected = intersectedGroup;
          
          this.facultyInfoService.activeFaculty.next(intersectedGroup.userData as Faculty);
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
      }
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    if (this.translatedScenePositions && this.translatedScenePositions.x !== this.scene.position.x && this.translatedScenePositions.z !== this.scene.position.z) {
      if (this.scene.position.x >= this.translatedScenePositions.x) {
        this.scene.position.x -= 0.2;
      }

      if (this.scene.position.z <= this.translatedScenePositions.z) {
        this.scene.position.z += 0.2;
      }
    }

    if (this.translatedBackScenePositions && this.translatedBackScenePositions.x !== this.scene.position.x && this.translatedBackScenePositions.z !== this.scene.position.z) {
      if (this.scene.position.x <= this.translatedBackScenePositions.x) {
        this.scene.position.x += 0.2;
      }

      if (this.scene.position.z >= this.translatedBackScenePositions.z) {
        this.scene.position.z -= 0.2;
      }
    }

    if (this.renderer) {
      this.renderer.render(this.scene, this.camera);
    } else {
      cancelAnimationFrame(this.frameId)
    }
  }

  public toggleUIControls(enableFullNavigation: boolean): void {
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

  public addCity(): void {
    this.objectLoader.getGLTFObject(`assets/gltf-objects/Unipply-city1.glb`).pipe(first()).subscribe((gltf) => {
      const root = gltf.scene;
      this.scene.add(root);
      
      Object.entries(FacultyIdEnum).forEach(([facultyKey, facultyId]) => {
        const building = root.getObjectByName(facultyKey);
        const facultyData = this.faculties.find((faculty) => faculty.id === facultyId);

        if (building && facultyData) {
          building.userData = facultyData;
          this.buildings.push(building);
        }
      });

      const box = new THREE.Box3().setFromObject(root);
      const boxSize = box.getSize(new THREE.Vector3())
      const boxCenter = box.getCenter(new THREE.Vector3());

      frameArea(boxSize.length() * 0.5, boxSize.length(), boxCenter, this.camera, this.cameraFrustrum);

      this.scene.translateY(2);

      this.initialScenePositions = new Vector3(this.scene.position.x,this.scene.position.y, this.scene.position.z);
      this.initialCameraPositions = new Vector3(this.camera.position.x,this.camera.position.y, this.camera.position.z);
      
      this.controls.maxDistance = boxSize.length() * 10;
      this.controls['target'].copy(boxCenter);
      this.controls.update();

      if (this.isRecommendationsPage) {
        this.translatedScenePositions = new Vector3(this.scene.position.x-4, 0, this.scene.position.z+4);
      }
    });
  }
}
