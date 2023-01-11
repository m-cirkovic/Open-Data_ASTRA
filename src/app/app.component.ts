import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LaneLayerService } from './services/map/lane-layer.service';
import { VisitCountService } from './services/visit-count.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Verkehrszähler';

  siteLayer$: Observable<any> = this._layerService.getAllLayers({ dynamic: this.dynamic });



  constructor(private _layerService: LaneLayerService, @Inject('DYNAMIC') private dynamic: boolean, private counter: VisitCountService) {
  }

  ngOnInit(){
    this.counter.countVisit().subscribe();
  }

}
