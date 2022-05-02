import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Faculty } from 'src/app/shared/models/faculty.model';

@Injectable({
  providedIn: 'root'
})
export class FacultyInfoService {
  public activeFaculty: Subject<Faculty> = new Subject<Faculty>();
  public activeFaculty$: Observable<Faculty> = this.activeFaculty.asObservable();
  
  constructor() { }
}
