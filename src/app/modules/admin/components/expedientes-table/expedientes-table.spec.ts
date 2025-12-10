import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientesTable } from './expedientes-table';

describe('ExpedientesTable', () => {
  let component: ExpedientesTable;
  let fixture: ComponentFixture<ExpedientesTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpedientesTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpedientesTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
