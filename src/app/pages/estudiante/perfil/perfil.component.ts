import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { PerfilService } from '../../../core/services/perfil.service';
import { Perfil } from '../../../core/models/perfil.model';

@Component({
  selector: 'app-estudiante-perfil',
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  form: FormGroup;
  idUsuario: number | null = null;
  perfilExistente: Perfil | null = null;
  cargando = true;
  guardando = false;
  mensaje = '';
  esError = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private perfilService: PerfilService
  ) {
    this.form = this.fb.group({
      carrera: [''],
      universidad: [''],
      semestre: [''],
      habilidades: [''],
      experiencia: [''],
      cvUrl: [''],
      disponibilidad: ['INMEDIATA']
    });
  }

  ngOnInit(): void {
    const idStr = this.auth.getId();
    if (idStr) {
      this.idUsuario = Number(idStr);
      this.cargarPerfil();
    } else {
      this.cargando = false;
    }
  }

  private cargarPerfil(): void {
    this.perfilService.listar().subscribe({
      next: perfiles => {
        const mio = perfiles.find((p: any) => Number(p.idUsuario) === Number(this.idUsuario));
        if (mio) {
          this.perfilExistente = mio;
          this.form.patchValue(mio);
        }
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  guardar(): void {
    if (!this.idUsuario) {
      this.mensaje = 'No se pudo identificar tu usuario. Cierra sesión y vuelve a entrar.';
      this.esError = true;
      return;
    }
    this.guardando = true;
    this.mensaje = '';
    const datos: Perfil = { ...this.form.value, idUsuario: this.idUsuario };

    const obs = this.perfilExistente
      ? this.perfilService.actualizar(this.perfilExistente.idPerfil!, datos)
      : this.perfilService.guardar(datos);

    obs.subscribe({
      next: () => {
        this.mensaje = this.perfilExistente ? 'Perfil actualizado correctamente' : 'Perfil guardado correctamente';
        this.esError = false;
        this.guardando = false;
        this.cargarPerfil();
      },
      error: () => {
        this.mensaje = 'Error al guardar el perfil';
        this.esError = true;
        this.guardando = false;
      }
    });
  }
}