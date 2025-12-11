import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
})
export class Login implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usuario: new FormControl('', { updateOn: 'blur' }), 
      password: new FormControl('', { updateOn: 'blur' }),
    });
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched(); 
    
    if (this.loginForm.valid) {
      console.log('Formulario Válido. Enviando datos...', this.loginForm.value);
      // Lógica de autenticación...
    } else {
      console.log('Formulario Inválido. Revisar campos.');
    }
  }

  get usuarioControl() {
    return this.loginForm.get('usuario') as FormControl;
  }
  
  get passwordControl() {
    return this.loginForm.get('password') as FormControl;
  }
}