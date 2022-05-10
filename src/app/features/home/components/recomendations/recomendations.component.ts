import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, interval } from 'rxjs';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { EngineService } from 'src/app/core/services/3d-map/engine.service';
import { FacultyApiService } from 'src/app/core/services/faculty-api.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { fontSizeChangeAnimation, listAnimation } from 'src/app/shared/animations/animations';
import { Faculty } from 'src/app/shared/models/faculty.model';
import * as THREE from 'three';

interface Recomendation {
  facultyTitle: string;
  score: number;
  specialties: SpecialtyRecommendation[];
  opened?: boolean;
}

interface SpecialtyRecommendation {
  title: string;
  score: number;
  hobbiesData: any[];
}

@Component({
  selector: 'app-recomendations',
  templateUrl: './recomendations.component.html',
  styleUrls: ['./recomendations.component.scss'],
  animations: [
    fontSizeChangeAnimation, 
    listAnimation,
  ],
  providers: [EngineService]
})
export class RecomendationsComponent {
  @ViewChild('rendererCanvas') public rendererCanvas: ElementRef<HTMLCanvasElement>;

  public isLoading = this.loadingService.isLoading$;

  public recommendations$: BehaviorSubject<Recomendation[]> = new BehaviorSubject<Recomendation[]>([]);
  public loaderProgress: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  public recomendations;

  constructor(
    private readonly router: Router,
    private readonly engineService: EngineService,
    private readonly facultyApiService: FacultyApiService,
    private readonly loadingService: LoadingService,
  ) {
    this.recomendations = this.router.getCurrentNavigation().extras.state as Recomendation[] || [
      {
        "facultyTitle": "Faculty of Economic Engineering and Business",
        "score": 66,
        "specialties": [
          {
            "title": "Programm of Applied Informatics",
            "score": 73,
            "hobbiesData": [
              {
                "hobbyTitle": "math",
                "score": 100
              },
              {
                "hobbyTitle": "algebra",
                "score": 100
              },
              {
                "hobbyTitle": "construction",
                "score": 21
              }
            ]
          },
          {
            "title": "Faculty of Computers Informatics and Microelectronics",
            "score": 73,
            "hobbiesData": [
              {
                "hobbyTitle": "math",
                "score": 99
              },
              {
                "hobbyTitle": "algebra",
                "score": 98
              },
              {
                "hobbyTitle": "construction",
                "score": 23
              }
            ]
          },
          {
            "title": "Faculty of Economic Engineering and Business",
            "score": 66,
            "hobbiesData": [
              {
                "hobbyTitle": "math",
                "score": 99
              },
              {
                "hobbyTitle": "algebra",
                "score": 99
              },
              {
                "hobbyTitle": "construction",
                "score": 0
              }
            ]
          },
        ]
      },
      {
        "facultyTitle": "Faculty of Informatics, Computers and Microelectronics",
        "score": 66,
        "specialties": [
          {
            "title": "Programm of Accounting",
            "score": 65,
            "hobbiesData": [
              {
                "hobbyTitle": "math",
                "score": 97
              },
              {
                "hobbyTitle": "algebra",
                "score": 100
              },
              {
                "hobbyTitle": "construction",
                "score": 0
              }
            ]
          },
          {
            "title": "Programm of Law",
            "score": 33,
            "hobbiesData": [
              {
                "hobbyTitle": "math",
                "score": 0
              },
              {
                "hobbyTitle": "algebra",
                "score": 0
              },
              {
                "hobbyTitle": "construction",
                "score": 100
              }
            ]
          },
          {
            "title": "Faculty of Cadastre Geodesy and Constructions",
            "score": 38,
            "hobbiesData": [
              {
                "hobbyTitle": "math",
                "score": 10
              },
              {
                "hobbyTitle": "algebra",
                "score": 5
              },
              {
                "hobbyTitle": "construction",
                "score": 99
              }
            ]
          },
          {
            "title": "Programm of Construction and Civil Engineering",
            "score": 33,
            "hobbiesData": [
              {
                "hobbyTitle": "math",
                "score": 0
              },
              {
                "hobbyTitle": "algebra",
                "score": 0
              },
              {
                "hobbyTitle": "construction",
                "score": 99
              }
            ]
          }
        ]
      },
    ];

    this.loaderProgress.next(0);

    const numbers = interval(5);
    const takeFourNumbers = numbers.pipe(
      take(101),
    );

    takeFourNumbers.subscribe((number) => {
      this.loaderProgress.next(number);
      if (number === 100) {
        this.loaderProgress.next(0);
        this.recommendations$.next(this.recomendations );
      }
    });
  }

  
  public ngOnInit(): void {
    this.loadingService.startLoading();
    
    setTimeout(()=> {
      this.createScene();
    }, 2000)
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
    this.engineService.createScene(this.rendererCanvas, true);
    
    this.engineService.mouse = new THREE.Vector2();
    this.engineService.raycaster = new THREE.Raycaster();
  }
}
