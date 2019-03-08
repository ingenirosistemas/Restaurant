import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtrosiComponent } from './otrosi.component';

describe('OtrosiComponent', () => {
  let component: OtrosiComponent;
  let fixture: ComponentFixture<OtrosiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtrosiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtrosiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
