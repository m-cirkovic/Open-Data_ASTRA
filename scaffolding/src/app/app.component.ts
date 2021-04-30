import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {AstraApiService} from './services/data/astra/astra-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Verkehrszähler';

  constructor(
    private _astraApi: AstraApiService
    ) {
  }
}
