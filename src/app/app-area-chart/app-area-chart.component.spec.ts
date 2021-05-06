import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAreaChartComponent } from './app-area-chart.component';

describe('AppAreaChartComponent', () => {
  let component: AppAreaChartComponent;
  let fixture: ComponentFixture<AppAreaChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppAreaChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
