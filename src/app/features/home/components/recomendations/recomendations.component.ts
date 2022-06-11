import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { EngineService } from 'src/app/core/services/3d-map/engine.service';
import { FacultyApiService } from 'src/app/core/services/faculty-api.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { UserService } from 'src/app/features/profile/services/user.service';
import { fontSizeChangeAnimation, listAnimation } from 'src/app/shared/animations/animations';
import { Recommendation } from 'src/app/shared/models/recommendation.model';
import * as THREE from 'three';

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
  public recommendations$: BehaviorSubject<Recommendation[]> = new BehaviorSubject<Recommendation[]>([]);
  public loaderProgress: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  public recomendations: Recommendation[];

  public destroy$ = new Subject();

  constructor(
    private readonly router: Router,
    private readonly engineService: EngineService,
    private readonly facultyApiService: FacultyApiService,
    private readonly userService: UserService,
    private readonly loadingService: LoadingService,
  ) {
    this.loaderProgress.next(0);
    
    this.userService.getUser().subscribe((user) => {
      this.recomendations = user.recommendations;
    }, () => {
      this.recomendations =[
        {
          "facultyTitle": "Faculty of Economic Engineering and Business",
          "recommendationScore": 66,
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
          "recommendationScore": 66,
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
    })

    const numbers = interval(45);
    const takeFourNumbers = numbers.pipe(
      take(50),
    );

    takeFourNumbers.subscribe((number) => {
      this.loaderProgress.next(number);
      
      if (number === 49) {
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
