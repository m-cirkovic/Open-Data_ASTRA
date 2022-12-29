import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ignoreElements } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VisitCountService {


  constructor(private http: HttpClient) { }


  countVisit(): Observable<void>{
    return this.http.get('visit/astra').pipe(
      ignoreElements()
    )
  }
}
