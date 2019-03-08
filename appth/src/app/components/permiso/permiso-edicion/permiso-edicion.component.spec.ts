import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisoEdicionComponent } from './permiso-edicion.component';

describe('PermisoEdicionComponent', () => {
  let component: PermisoEdicionComponent;
  let fixture: ComponentFixture<PermisoEdicionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermisoEdicionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermisoEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
