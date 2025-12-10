import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosView } from './usuarios.view';

describe('UsuariosView', () => {
  let component: UsuariosView;
  let fixture: ComponentFixture<UsuariosView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
