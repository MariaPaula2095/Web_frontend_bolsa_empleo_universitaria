import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  tipo: 'estudiante' | 'empresa' = 'estudiante';
  form: FormGroup;
  cargando = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  seleccionar(tipo: 'estudiante' | 'empresa'): void {
    this.tipo = tipo;
    this.error = '';
    this.form.reset();
  }

  login(): void {
    if (this.form.invalid) return;
    this.cargando = true;
    this.error = '';

    const obs = this.tipo === 'empresa'
      ? this.auth.loginEmpresa(this.form.value)
      : this.auth.loginUsuario(this.form.value);

    obs.subscribe({
      next: () => {
        const rol = this.auth.getRol();
        if (rol === 'ADMIN') this.router.navigate(['/admin']);
        else if (rol === 'EMPRESA') this.router.navigate(['/empresa']);
        else this.router.navigate(['/estudiante']);
      },
      error: () => {
        this.error = 'Credenciales incorrectas. Verifica tu email y contraseña.';
        this.cargando = false;
      }
    });
  }
}
