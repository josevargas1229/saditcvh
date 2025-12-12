import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usuario: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  get usuarioControl() {
    return this.loginForm.get('usuario') as FormControl;
  }

  get passwordControl() {
    return this.loginForm.get('password') as FormControl;
  }

  onSubmit(): void {
  this.errorMessage = null;
  this.loginForm.markAllAsTouched();

  if (!this.loginForm.valid) return;

  this.loading = true;

  const credentials = {
    username: this.usuarioControl.value,
    password: this.passwordControl.value,
  };

  // 🚨 Primero obtener CSRF
  this.authService.getCsrfToken().subscribe({
    next: () => {
      // Luego sí hacer login
      this.authService.login(credentials).subscribe({
        next: (user) => {
          this.loading = false;
          console.log("Usuario autenticado:", user);

          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;

          this.errorMessage =
            err?.error?.message ??
            "Error de autenticación. Verifica tus credenciales.";

          console.error("Error en login:", err);
        }
      });
    },
    error: (err) => {
      this.loading = false;
      this.errorMessage = "Error obteniendo CSRF: " + (err.error?.message ?? "");
      console.error("CSRF error:", err);
    }
  });
  }
}
