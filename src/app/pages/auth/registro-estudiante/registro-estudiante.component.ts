import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-registro-estudiante',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro-estudiante.component.html'
})
export class RegistroEstudianteComponent {
  form: FormGroup;
  cargando = false;
  error = '';
  exito = false;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.maxLength(10)],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  registrar(): void {
    if (this.form.invalid) return;
    this.cargando = true;
    this.error = '';
    this.usuarioService.guardar({ ...this.form.value, tipoUsuario: 'ESTUDIANTE' }).subscribe({
      next: () => {
        this.exito = true;
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: () => {
        this.error = 'Error al registrarse. Verifica que el correo no esté en uso.';
        this.cargando = false;
      }
    });
  }
}
