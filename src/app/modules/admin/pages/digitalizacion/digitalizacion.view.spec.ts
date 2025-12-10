import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalizacionView } from './digitalizacion.view';

describe('DigitalizacionView', () => {
  let component: DigitalizacionView;
  let fixture: ComponentFixture<DigitalizacionView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalizacionView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalizacionView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
