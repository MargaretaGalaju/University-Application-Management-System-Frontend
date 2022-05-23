import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationStepperComponent } from './application-stepper.component';

describe('ApplicationStepperComponent', () => {
  let component: ApplicationStepperComponent;
  let fixture: ComponentFixture<ApplicationStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationStepperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
