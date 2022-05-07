import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.loadingSubject.asObservable();
  
  public startLoading(): void {
    this.loadingSubject.next(true);
  }

  public stopLoading(): void {
    this.loadingSubject.next(false);
  }
}
