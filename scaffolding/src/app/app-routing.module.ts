import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import {MapResolver} from './resolver/map.resolver';

const routes: Routes = [
  { path: 'map',
    component: MapComponent,
    resolve: {'itemsList': MapResolver}
    },
  {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
