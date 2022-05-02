import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Faculty } from 'src/app/shared/models/faculty.model';
import { Specialty } from 'src/app/shared/models/specialty.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacultyApiService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  public getAllFaculties(): Observable<Faculty[]> {
    return this.httpClient.get<Faculty[]>(`${environment.baseUrl}/faculties/all`);
  }

  public getFacultyById(facultyId: string): Observable<Faculty> {
    return this.httpClient.get<Faculty>(`${environment.baseUrl}/faculty/${facultyId}`);
  }

  public getSpecialtyById(specialtyId: string): Observable<Specialty> {
    return this.httpClient.get<Specialty>(`${environment.baseUrl}/specialty/${specialtyId}`);
  }
}