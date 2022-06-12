import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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

  public getCustomSpecialtyRecommendations(hobbies: string[]): Observable<any> {
    // return this.httpClient.post<SpecialtyRecommendation[]>(`${environment.baseUrl}/faculties/recommendations`, hobbies);
    return of({"id":"712ceebe-5c59-41be-858e-cfb505b9ae28","userName":"Margareta Galaju","age":0,"aboutMe":null,"email":"mg@mailinator.com","phone":null,"gender":null,"avatar":null,"documents":null,"favoriteSpecialties":[{"id":"1400881f-ff0d-421e-bf72-c410e86d343e","title":"Mechanical engineering","description":"Mechanical engineering is an engineering branch that combines engineering physics and mathematics principles with materials science, to design, analyze, manufacture, and maintain mechanical systems."},{"id":"26a383c2-98aa-4f7f-91b6-f4a75e0339ce","title":"Engineering of construction materials and fittings","description":"All the building structures are composed of various types of materials. These materials are either referred to as building materials or materials of construction."},{"id":"305ac584-f79f-4b85-9b8b-30c314447b67","title":"Law","description":"Law is a system of rules created and enforced through social or governmental institutions to regulate behavior, with its precise definition a matter of longstanding debate"},{"id":"b5771eca-c585-4464-9611-036a045c63ba","title":"Motor Transport Engineering","description":"Transportation engineering, primarily involves planning, design, construction, maintenance, and operation of transportation facilities."},{"id":"b6bbad5a-dc07-4349-b9ee-1f25a8eba815","title":"Applied Informatics","description":"Applied Informatics is an NYC-based Health IT, Big Data and Semantic technology company. We do things most healthcare software companies can't, a one stop shop for designing, developing and delivering worldclass software solutions. Consider us the Navy Seals of the healthcare informatics world."},{"id":"d8658ac6-dd78-4987-9c8a-f8932e7835db","title":"Engineering and industrial technologies","description":"The goal of the Bachelor's Degree in Industrial Technologies Engineering is to form professionals who are able to work in a wide variety of professional areas such as project management and administration, consulting, civil service, business organization and management and industrial equipment design."}],"hobbies":[{"hobbyId":8,"title":"programming"},{"hobbyId":29,"title":"computers"},{"hobbyId":9,"title":"robotics"},{"hobbyId":7,"title":"geometry"}],"recommendations":[{"facultyTitle":"Faculty of Architecture and Urban Planning","recommendationScore":64,"specialties":[{"id":"d704779a-5e81-4d5b-a3bd-b238d47483c9","title":"Environmental engineering","score":49,"hobbiesData":[{"hobbyTitle":"programming","hobbyId":8,"score":100},{"hobbyTitle":"computers","hobbyId":29,"score":0},{"hobbyTitle":"robotics","hobbyId":9,"score":0},{"hobbyTitle":"geometry","hobbyId":7,"score":99}]},{"id":"0755e0ef-22f3-4eda-a310-39207b7e3bfc","title":"Urban planning and landscape management","score":47,"hobbiesData":[{"hobbyTitle":"programming","hobbyId":8,"score":100},{"hobbyTitle":"computers","hobbyId":29,"score":0},{"hobbyTitle":"robotics","hobbyId":9,"score":0},{"hobbyTitle":"geometry","hobbyId":7,"score":91}]}]},{"facultyTitle":"Faculty of Computers, Informatics and Microelectronics","recommendationScore":74,"specialties":[{"id":"b6bbad5a-dc07-4349-b9ee-1f25a8eba815","title":"Applied Informatics","score":73,"hobbiesData":[{"hobbyTitle":"programming","hobbyId":8,"score":99},{"hobbyTitle":"computers","hobbyId":29,"score":99},{"hobbyTitle":"robotics","hobbyId":9,"score":84},{"hobbyTitle":"geometry","hobbyId":7,"score":11}]},{"id":"c9943e33-7004-46d1-b778-ff4a7d48c8da","title":"Microelectronics and nanotechnologies","score":74,"hobbiesData":[{"hobbyTitle":"programming","hobbyId":8,"score":100},{"hobbyTitle":"computers","hobbyId":29,"score":98},{"hobbyTitle":"robotics","hobbyId":9,"score":97},{"hobbyTitle":"geometry","hobbyId":7,"score":2}]}]},{"facultyTitle":"Faculty of Cadastre,Geodesy and Constructions","recommendationScore":48,"specialties":[{"id":"dc4ae9bf-1241-461a-aaab-1d7596403011","title":"Construction and civil engineering","score":48,"hobbiesData":[{"hobbyTitle":"programming","hobbyId":8,"score":93},{"hobbyTitle":"computers","hobbyId":29,"score":2},{"hobbyTitle":"robotics","hobbyId":9,"score":0},{"hobbyTitle":"geometry","hobbyId":7,"score":99}]}]}]})
  }
}
