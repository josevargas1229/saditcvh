import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaView } from './auditoria.view';

describe('AuditoriaView', () => {
  let component: AuditoriaView;
  let fixture: ComponentFixture<AuditoriaView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditoriaView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditoriaView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
