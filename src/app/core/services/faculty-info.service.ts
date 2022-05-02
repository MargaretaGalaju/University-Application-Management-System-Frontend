import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacultyInfoService {
  public activeFaculty = new Subject();
  public activeFaculty$ = this.activeFaculty.asObservable();
  
  constructor() { }
}
