import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteEnum } from 'src/app/core/routes/routes.enum';
import { FacultyInfoService } from 'src/app/core/services/faculty-info.service';
import { listAnimationFast, slideInOutAnimation } from 'src/app/shared/animations/animations';

@Component({
  selector: 'app-faculty-details',
  templateUrl: './faculty-details.component.html',
  styleUrls: ['./faculty-details.component.scss'],
  animations: [
    slideInOutAnimation,
    listAnimationFast,
  ],
})
export class FacultyDetailsComponent implements OnInit {
  public activeFaculty$ = this.facultyInfoService.activeFaculty$;
  public activeSpecialtyId: number;
  public showAnimation = false;

  constructor(
    private readonly facultyInfoService: FacultyInfoService,
    private readonly router: Router,
  ) { }

  public ngOnInit(): void {
    this.activeFaculty$.subscribe((faculty) => {
      if (!faculty) {
        return;
      }

      this.activeSpecialtyId = null;
      faculty.specialties = [...faculty.specialties]
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
