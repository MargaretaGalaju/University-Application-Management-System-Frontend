import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RouteEnum } from 'src/app/core/routes/routes.enum';
import { AuthService } from 'src/app/core/services/auth.service';
import { FacultyApiService } from 'src/app/core/services/faculty-api.service';
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
  public currentFavSpecialty: string;
  
  public isAuthentificated(): boolean {
    return this.authService.isAuthenticated();
  }

  constructor(
    private readonly authService: AuthService,
    private readonly facultyInfoService: FacultyInfoService,
    private readonly facultyApiService: FacultyApiService,
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

    combineLatest([
      this.activeFaculty$,
      this.facultyApiService.getAllFavorites()
    ]).subscribe(([faculty, favorites]) => {
      if (!faculty) {
        return;
      }

      this.activeSpecialtyId = null;
      faculty.specialties = [...faculty.specialties].map((specialty) => ({...specialty, isFavorite: favorites?.some((f=> f.id === specialty.id))}))
    })
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

  public toggleFavorite(specialty): void {
    this.currentFavSpecialty = specialty.id;

    this.facultyApiService[specialty.isFavorite ? 'deleteFromFavorites' : 'addToFavorites'](specialty.id).subscribe({
      next: () => {
        this.currentFavSpecialty = null;
        specialty.isFavorite = !specialty.isFavorite;
      },
      error: () => {
        this.currentFavSpecialty = null;
      }
    })
  }
}
