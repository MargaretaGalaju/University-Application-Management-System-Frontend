import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { EngineService } from 'src/app/core/services/engine-services/engine.service';
import { FacultyApiService } from 'src/app/core/services/faculty-api.service';
import { Faculty } from 'src/app/shared/models/faculty.model';
import * as THREE from 'three';

@Component({
  selector: 'app-virtual-tour',
  templateUrl: './virtual-tour.component.html',
  styleUrls: ['./virtual-tour.component.scss'],
  providers: [EngineService]
})
export class VirtualTourComponent implements OnInit {
  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  public activeFaculty: Faculty;

  constructor(
    private activatedRoute: ActivatedRoute,
    private facultyApiService: FacultyApiService,
    private readonly engineService: EngineService,
    ) {
    this.activatedRoute.params.pipe(
      switchMap(({ id }) => this.facultyApiService.getFacultyById(id))
    ).subscribe((faculty) => {
      this.activeFaculty = faculty;
    })
   }

  public ngOnInit(): void {
    this.createScene();
  }

  public createScene(faculties?: Faculty[]): void {
    // this.engineService.createVirtualTourScene(this.rendererCanvas, this.activeFaculty?.id);
    
    this.engineService.mouse = new THREE.Vector2();
    this.engineService.raycaster = new THREE.Raycaster();
  }


}
