import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUser: User = {
    "id": "e7eafabd-bc3c-4d2f-a02b-b15c82a1e94e",
    "userName": "tanya",
    "age": 18,
    "aboutMe": "Nothing interesting",
    "email": "tanyatsy00@gmail.com",
    "phone": "+37369033558",
    "gender": "Fem",
    "avatar": null,
    "documents": null,
    "favoriteSpecialties": [
      {
        "id": "08ef38ab-10ea-42a4-bdda-4baf96b01754",
        "title": "Thermoenergetics",
        "description": "Short Description"
      },
      {
        "id": "3b54ed4e-7159-410e-b939-7b4d6a26b279",
        "title": "Geodesy, topography and mapping",
        "description": "Short Description"
      }
    ],
    "hobbies": [
      {
        "hobbyId": 0,
        "title": "Food"
      },
      {
        "hobbyId": 35,
        "title": "Construction"
      }
    ],
    "recommendations": [
      {
        "facultyTitle": "Faculty of Cadastre, Geodesy and Constructions",
        "recommendationScore": 50,
        "specialties": [
          {
            "title": "Construction and civil engineering",
            "score": 49,
            "hobbiesData": [
              {
                "hobbyTitle": "food",
                "score": 0
              },
              {
                "hobbyTitle": "construction",
                "score": 98
              }
            ]
          },
          {
            "title": "Law",
            "score": 49,
            "hobbiesData": [
              {
                "hobbyTitle": "food",
                "score": 0
              },
              {
                "hobbyTitle": "construction",
                "score": 98
              }
            ]
          }
        ]
      }
    ]
  };

  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  public getUser(): Observable<User> {
    if (this.currentUser) {
      return of(this.currentUser);
    }

    return this.httpClient.get<User>(`${environment.baseUrl}/user`).pipe(
      tap((user) => {
        this.currentUser = user;
      })
    );
  }

  public addToFavoriteSpecialties(specialtyId: string) {
    return this.httpClient.get(`${environment.baseUrl}/user/favorites/${specialtyId}`);
  }

  public removeFromFavoriteSpecialties(specialtyId: string) {
    return this.httpClient.delete(`${environment.baseUrl}/user/favorites/${specialtyId}`);
  }
  
  public submitApplication(data) {
    return this.httpClient.post<any>(`${environment.baseUrl}/user/application`, data);
  }

  public postUser(user) {
    return this.httpClient.post(`${environment.baseUrl}/user`, user)
  }
}
