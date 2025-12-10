import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespaldosView } from './respaldos.view';

describe('RespaldosView', () => {
  let component: RespaldosView;
  let fixture: ComponentFixture<RespaldosView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RespaldosView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RespaldosView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
