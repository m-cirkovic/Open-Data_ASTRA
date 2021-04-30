import { Injectable } from '@angular/core';
import { Subscription, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SplashScreenStateService {

  subject = new Subject();
  subscribe(onNext): Subscription {
    return this.subject.subscribe(onNext);
  }
  stop(): void {
    this.subject.next(false);
  }
}
