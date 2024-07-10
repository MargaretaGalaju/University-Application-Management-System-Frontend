import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { Faculty } from 'src/app/shared/models/faculty.model';

@Injectable({
  providedIn: 'root'
})
export class FacultyInfoService {
  public activeFaculty: Subject<Faculty> = new Subject<Faculty>();
  public activeFaculty$: Observable<Faculty> = this.activeFaculty.asObservable();
  cursor  = new Subject<boolean>();
  cursor$ = this.cursor.asObservable().pipe(throttleTime(200));
  constructor() { }
}
