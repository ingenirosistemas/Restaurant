import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenNuevoComponent } from './examen-nuevo.component';

describe('ExamenNuevoComponent', () => {
  let component: ExamenNuevoComponent;
  let fixture: ComponentFixture<ExamenNuevoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamenNuevoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamenNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
