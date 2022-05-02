import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EngineService } from 'src/app/core/services/engine-services/engine.service';
import { FacultyInfoService } from 'src/app/core/services/faculty-info.service';
import * as THREE from 'three';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent  implements OnInit, OnDestroy {
  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  public activeFaculty = this.facultyInfoService.activeFaculty$;

  constructor(
    private readonly engineService: EngineService,
    private readonly facultyInfoService: FacultyInfoService,
  ) { }

  public ngOnInit(): void {
    this.createScene();
    
    this.engineService.mouse = new THREE.Vector2();
    this.engineService.raycaster = new THREE.Raycaster();
  }

  public ngOnDestroy(): void {
    if (this.engineService.frameId) {
      cancelAnimationFrame(this.engineService.frameId);
    }

    if (this.engineService.renderer) {
      this.engineService.renderer.domElement.removeEventListener('mousemove', this.engineService.onMouseMove.bind(this));
      this.engineService.renderer.domElement.removeEventListener('click', this.engineService.onMouseDown.bind(this));
      this.engineService.renderer.dispose();
      this.engineService.renderer = null;
      this.engineService.canvas = null;
    }
  }
  
  public createScene() {
    this.engineService.createScene(this.rendererCanvas);
  }
}
