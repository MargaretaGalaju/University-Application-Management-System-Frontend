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
  public currentUser: User;

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
