import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUser: User = {
    id: 'test',
    name: 'Margareta Galaju',
    favoriteSpecialties: [
      {
        title: 'Software Engineering',
        id: '123',
        description: 'lalal description'
      }
    ],
    recommendations: [{
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
    }],
    hobbies: [
      {
        hobbyId: 'test',
        title: 'Art'
      }
    ],
    documents: []
  };


  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  public getUser(): Observable<User> {
    if (this.currentUser) {
      return of(this.currentUser);
    }

    return this.httpClient.get<User>(`${environment.baseUrl}/user`);
  }

  public addToFavoriteSpecialties(specialtyId: string) {
    return this.httpClient.get(`${environment.baseUrl}/user/favorites/${specialtyId}`);
  }

  public removeFromFavoriteSpecialties(specialtyId: string) {
    return this.httpClient.delete(`${environment.baseUrl}/user/favorites/${specialtyId}`);
  }
}
