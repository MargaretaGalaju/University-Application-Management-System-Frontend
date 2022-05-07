import * as THREE from 'three';
import { ElementRef, Injectable, NgZone, OnDestroy, OnInit } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Image3DLoaderService } from './3d-image-loader.service';
import { first } from 'rxjs/operators';
import { frameArea } from '../../../shared/utils/utils.helper';
import { FacultyInfoService } from '../faculty-info.service';
import { Vector3 } from 'three';
import { Faculty } from 'src/app/shared/models/faculty.model';
import { Building } from 'src/app/shared/models/building.model';
import { LoadingService } from '../loading.service';

@Injectable()
export class EngineService {
  public canvas: HTMLCanvasElement;
  public renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private cameraFrustrum = 45;

  public controls: OrbitControls;
  public isUserInteracting = false;
  public onMouseDownMouseX = 0;
   public onMouseDownMouseY = 0;
   public onPointerDownPointerX;
   public onPointerDownPointerY;
   public onPointerDownLat;
   public onPointerDownLon;
   public lon = 0;
   public onMouseDownLon = 0;
   public lat = 0;
   public onMouseDownLat = 0;
   public phi = 0;
   public theta = 0;

  public manager = new THREE.LoadingManager();
  public isLoading = true;
  public frameId: number = null;

  public buildings: THREE.Object3D<THREE.Event>[] = [];
  public faculties: Faculty[] = [];

  public mouse: THREE.Vector2;
  public raycaster: THREE.Raycaster;

  public lastIntersected: THREE.Object3D;

  public initialScenePositions: Vector3;
  public translatedScenePositions: Vector3;
  public translatedBackScenePositions: Vector3;

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

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    this.canvas = canvas.nativeElement;

    this.initSceneConfigurations();
    this.addCity();
    this.render();
    this.animate();
    this.loadingService.stopLoading();
  }

  // public createVirtualTourScene(canvas: ElementRef<HTMLCanvasElement>, facultyId: string): void {
  //   this.canvas = canvas.nativeElement;

  //   // this.initSceneConfigurations();
  //   // this.addCity();
  //   this.addFac();
  //   this.animate1();
  // }

  // public addFac() {
  //   this.renderer = new THREE.WebGLRenderer({
  //     canvas: this.canvas,
  //     alpha: true,
  //     antialias: true
  //   });
  //   this.renderer.setPixelRatio( window.devicePixelRatio );
  //   this.renderer.setSize( window.innerWidth, window.innerHeight );
  //   // this.container.appendChild( this.renderer.domElement )
  //   this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
  //   this.camera.lookAt(new THREE.Vector3( 0, 0, 0 ));

  //   this.scene = new THREE.Scene();
  //   const geometry = new THREE.SphereGeometry( 500, 60, 40 );
  //   geometry.scale( - 1, 1, 1 );

  //   var material = new THREE.MeshBasicMaterial( {
  //     map: new THREE.TextureLoader().load( 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/2294472375_24a3b8ef46_o.jpg' )
  //   });

  //   const mesh = new THREE.Mesh( geometry, material );

  //   this.scene.add(mesh);
  //   this.controls = new OrbitControls( this.camera, this.renderer.domElement );
  //   this.controls.update();

    
  //   document.addEventListener( 'mousedown', this.onDocumentMouseDown.bind(this), false );
  //   document.addEventListener( 'mousemove', this.onDocumentMouseMove.bind(this), false );
  //   document.addEventListener( 'mouseup', this.onDocumentMouseUp.bind(this), false );
  //   document.addEventListener( 'wheel', this.onDocumentMouseWheel.bind(this), false );


  //   document.addEventListener( 'dragover', function ( event ) {

  //     event.preventDefault();
  //     event.dataTransfer.dropEffect = 'copy';

  //   }, false );

  //   document.addEventListener( 'dragenter', function ( event ) {

  //     document.body.style.opacity = '0.5';

  //   }, false );

  //   document.addEventListener( 'dragleave', function ( event ) {

  //     document.body.style.opacity = '1';

  //   }, false );

  //   document.addEventListener( 'drop', function ( event ) {

  //     event.preventDefault();

  //     var reader = new FileReader();
  //     reader.addEventListener( 'load', function ( event ) {

  //       material.map.image.src = event['target'].result;
  //       material.map.needsUpdate = true;

  //     }, false );
  //     reader.readAsDataURL( event.dataTransfer.files[ 0 ] );

  //     document.body.style.opacity = '1';

  //   }, false );

  //   window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
  // }

  
  // public onWindowResize() {
  //   this.camera.aspect = window.innerWidth / window.innerHeight;
  //   this.camera.updateProjectionMatrix();

  //   this.renderer.setSize( window.innerWidth, window.innerHeight );
  // }

  // public onDocumentMouseDown( event ) {
  //   event.preventDefault();
  //   this.isUserInteracting = true;

  //   this.onPointerDownPointerX = event.clientX;
  //   this.onPointerDownPointerY = event.clientY;

  //   this.onPointerDownLon = this.lon;
  //   this.onPointerDownLat = this.lat;
  // }

  // public onDocumentMouseMove( event ) {
  //   if ( this.isUserInteracting === true ) {
  //     this.lon = ( this.onPointerDownPointerX - event.clientX ) * 0.1 + this.onPointerDownLon;
  //     this.lat = ( event.clientY - this.onPointerDownPointerY ) * 0.1 + this.onPointerDownLat;
  //   }
  // }

  // public onDocumentMouseUp( event ) {
  //   this.isUserInteracting = false;
  // }

  // public onDocumentMouseWheel( event ) {
  //   this.camera.fov += event.deltaY * 0.05;
  //   this.camera.updateProjectionMatrix();
  // }

  // public animate1() {
  //   this.frameId = requestAnimationFrame(() => {
  //     this.update();
  //   });
  // }

  // public update() {
  //   if ( this.isUserInteracting === false ) {
  //     this.lon += 0.1;
  //   }

  //   this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
  //   this.phi = THREE.MathUtils.degToRad( 90 - this.lat );
  //   this.theta = THREE.MathUtils.degToRad( this.lon );

  //   const camera = new Vector3()
  //   camera.x = 500 * Math.sin( this.phi ) * Math.cos( this.theta );
  //   camera.y = 500 * Math.cos( this.phi );
  //   camera.z = 500 * Math.sin( this.phi ) * Math.sin( this.theta );

  //   this.camera.lookAt( camera );

  //   /*
  //   // distortion
  //   camera.position.copy( camera.target ).negate();
  //   */

  //   this.renderer.render( this.scene, this.camera );
  // }

  public initSceneConfigurations(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    // @TODO> Add resize window listener
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.renderer.domElement.addEventListener('click', this.onMouseDown.bind(this));
    
    this.scene = new THREE.Scene();

    const fov = 45;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    this.controls = new OrbitControls( this.camera, this.renderer.domElement );

    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    this.controls.enableRotate = true;

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

      for (let index = 0; index < 9; index++) {
        const building = root.getObjectByName('bloc'+index);

        if (building) {
          // @TODO: change to real data from BE
          const facultyData: Faculty = this.faculties[index] || {
            title: 'Faculty\'s title with index ' + index,
            description: 'Some random description tralalaalalla',
            id: 'bla-bla-id-' + index,
            specialties: [
              {
                id: '1',
                title: 'Software Engineering',
                description: 'You never know how you\'ll like it ' ,
              },
              {
                id: '2',
                title: 'Mechanical Electronics',
                description: 'You never know how you\'ll like it' ,
              },
              {
                id: '2',
                title: 'Mechanical Electronics',
                description: 'You never know how you\'ll like it' ,
              },
              {
                id: '2',
                title: 'Mechanical Electronics',
                description: 'You never know how you\'ll like it' ,
              },
              {
                id: '2',
                title: 'Mechanical Electronics',
                description: 'You never know how you\'ll like it' ,
              },
              {
                id: '2',
                title: 'Mechanical Electronics',
                description: 'You never know how you\'ll like it' ,
              },
            ],
          };

          building.userData = facultyData;
  
          this.buildings.push(building);
        }
      }

      const box = new THREE.Box3().setFromObject(root);
      const boxSize = box.getSize(new THREE.Vector3())
      const boxCenter = box.getCenter(new THREE.Vector3());

      frameArea(boxSize.length() * 0.5, boxSize.length(), boxCenter, this.camera, this.cameraFrustrum);

      this.scene.translateY(2);

      this.initialScenePositions = new Vector3(this.scene.position.x,this.scene.position.y, this.scene.position.z);
      this.controls.maxDistance = boxSize.length() * 10;
      this.controls['target'].copy(boxCenter);
      this.controls.update();
    });
  }
}
