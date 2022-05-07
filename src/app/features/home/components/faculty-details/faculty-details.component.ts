import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteEnum } from 'src/app/core/routes/routes.enum';
import { FacultyInfoService } from 'src/app/core/services/faculty-info.service';
import { listAnimation, slideInOutAnimation } from 'src/app/shared/animations/animations';

@Component({
  selector: 'app-faculty-details',
  templateUrl: './faculty-details.component.html',
  styleUrls: ['./faculty-details.component.scss'],
  animations: [
    slideInOutAnimation,
    listAnimation,
  ],
})
export class FacultyDetailsComponent {
  public activeFaculty$ = this.facultyInfoService.activeFaculty$;
  public activeSpecialtyId: number;
  
  constructor(
    private readonly facultyInfoService: FacultyInfoService,
    private readonly router: Router,
  ) { 
    
    // Not a very beautiful solution for showing the animation for the list of specialties on UI 
    this.activeFaculty$.subscribe((faculty) => {
      if (!faculty) {
        return;
      }

      this.activeSpecialtyId = null;

      const initialFacSpecialties = faculty.specialties;
      faculty.specialties = [];

      setTimeout(() => {
        faculty.specialties = initialFacSpecialties;
      });
    });
  }

  public makeVirtualTour(facultyId: string) {
    this.router.navigateByUrl(`${RouteEnum.virtualTour}/${facultyId}`);
  }

  public closeFacultyCard(): void {
    this.facultyInfoService.activeFaculty.next(null);
  }

  public onSpecialtyClick(index: number): void {
    this.activeSpecialtyId = index === this.activeSpecialtyId ? null : index;
  }
}
