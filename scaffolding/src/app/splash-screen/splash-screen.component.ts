import { Component, Input, OnInit } from '@angular/core';
import { interval, of, timer } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css']
})
export class SplashScreenComponent implements OnInit {
  
  public funnySlogans = 
  [
    "waking up developer",
    "brewing coffe",
    "spinning up computer",
    "gathering measurements",
    "collect dropped data"
  ]

  public funnySlogan: string = '';
  constructor(
  ) { }

  ngOnInit(): void {
    timer(this.funnySlogans.length, 800).pipe(
      tap(a => this.funnySlogan = this.funnySlogans[a])
    ).subscribe()
  }

  
}
