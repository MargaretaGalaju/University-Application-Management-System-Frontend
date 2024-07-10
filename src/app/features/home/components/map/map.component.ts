import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EngineService } from 'src/app/core/services/3d-map/engine.service';
import { FacultyApiService } from 'src/app/core/services/faculty-api.service';
import { FacultyInfoService } from 'src/app/core/services/faculty-info.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Faculty } from 'src/app/shared/models/faculty.model';
import * as THREE from 'three';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [EngineService],
})
export class MapComponent  implements OnInit, OnDestroy {
  @ViewChild('rendererCanvas') public rendererCanvas: ElementRef<HTMLCanvasElement>;

  public isLoading = this.loadingService.isLoading$;

  constructor(
    public readonly facultyInfoService: FacultyInfoService,
    private readonly engineService: EngineService,
    private readonly facultyApiService: FacultyApiService,
    private readonly loadingService: LoadingService,
  ) { }

  public ngOnInit(): void {
    this.loadingService.startLoading();
    
    this.facultyApiService.getAllFaculties().subscribe((faculties: Faculty[]) => {
      this.engineService.faculties = faculties;
      setTimeout(() => this.createScene(), 1000)
    }, () => {
      this.createScene();
    });
  }

  public ngOnDestroy(): void {
    if (this.engineService.frameId) {
      cancelAnimationFrame(this.engineService.frameId);
      this.engineService.frameId = null
    }

    if (this.engineService.renderer) {
      this.engineService.renderer.domElement.removeEventListener('mousemove', this.engineService.onMouseMove.bind(this));
      this.engineService.renderer.domElement.removeEventListener('click', this.engineService.onMouseDown.bind(this));
      this.engineService.renderer.dispose();
      this.engineService.renderer = null;
      this.engineService.canvas = null;
    }
  }
 
  public createScene(): void {
    this.engineService.createScene(this.rendererCanvas);
    
    this.engineService.mouse = new THREE.Vector2();
    this.engineService.raycaster = new THREE.Raycaster();
  }
}
