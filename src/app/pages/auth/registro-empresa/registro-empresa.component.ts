import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmpresaPendienteService } from '../../../core/services/empresa-pendiente.service';

@Component({
  selector: 'app-registro-empresa',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro-empresa.component.html'
})
export class RegistroEmpresaComponent {
  form: FormGroup;
  cargando = false;
  error = '';
  exito = false;

  constructor(private fb: FormBuilder, private service: EmpresaPendienteService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  registrar(): void {
    if (this.form.invalid) return;
    this.cargando = true;
    this.error = '';
    this.service.enviar(this.form.value).subscribe({
      next: () => { this.exito = true; this.cargando = false; },
      error: () => {
        this.error = 'Error al enviar la solicitud. Verifica que el correo no esté registrado.';
        this.cargando = false;
      }
    });
  }
}
