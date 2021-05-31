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
    'wecke den Entwickler auf',
    'bereite mir schnell einen Kaffee zu',
    'fahre den Computer hoch',
    'sammle die Daten',
    'verteile Punkte auf der Karte',
    'zähle Messstellen',
    'filtere Punkte nach Geschwindikeit',
    'suche schnellste Messung',
    'suche langsamste Messung',
    'lokalisiere höchstes Verkehrsaufkommen'
  ];

  public funnySlogan = '';
  constructor(
  ) { }

  ngOnInit(): void {
    timer(this.funnySlogans.length, 1000).pipe(
      tap(a => this.funnySlogan = this.funnySlogans[a])
    ).subscribe();
  }


}
