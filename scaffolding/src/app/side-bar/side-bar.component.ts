import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Control, DomUtil, Map } from 'leaflet';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  @Output() updateData = new EventEmitter();
  @Input() map: Map;
  sidebar: Control;

  private _currentTab: string;

  constructor() { }

  ngOnInit(): void {
    let SideBar = Control.extend({
      onAdd(map: Map) {
        return DomUtil.get('sidebar')
      },
      onRemove(map: Map) { }
    })
    this.sidebar = new SideBar({
      position: 'topleft'
    }).addTo(this.map)
  }

  hidePane(){
    document.getElementById(this._currentTab).style.display = 'none';
    this._currentTab = '';
  }

  changeTab(tab: string) {
    let current = document.getElementById(this._currentTab);
    if(current){
      current.style.display = 'none';
    }
    if(tab != this._currentTab){
      document.getElementById(tab).style.display = 'block';
      this._currentTab = tab;
    }else{
      this._currentTab = null;
    }
  }

  changeData(){
    this.updateData.emit('hello from sidebar')
  }

}