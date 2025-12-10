import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientesView } from './expedientes.view';

describe('ExpedientesView', () => {
  let component: ExpedientesView;
  let fixture: ComponentFixture<ExpedientesView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpedientesView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpedientesView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
