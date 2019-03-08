import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FonpensionComponent } from './fonpension.component';

describe('FonpensionComponent', () => {
  let component: FonpensionComponent;
  let fixture: ComponentFixture<FonpensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FonpensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FonpensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
