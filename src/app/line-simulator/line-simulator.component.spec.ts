import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineSimulatorComponent } from './line-simulator.component';

describe('LineSimulatorComponent', () => {
  let component: LineSimulatorComponent;
  let fixture: ComponentFixture<LineSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineSimulatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
