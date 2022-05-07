import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hobby } from 'src/app/shared/models/hobby.model';
import { SpecialtyRecommendation } from 'src/app/shared/models/specialty-recommendation.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecommendationApiService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  public getHobbiesList(): Observable<Hobby[]> {
    return this.httpClient.get<Hobby[]>(`${environment.baseUrl}/hobbies/all`);
  }

  public getCustomSpecialtyRecommendations(hobbies: string[]): Observable<SpecialtyRecommendation[]> {
    return this.httpClient.post<SpecialtyRecommendation[]>(`${environment.baseUrl}/faculties/recommendations`, hobbies);
  }
}
