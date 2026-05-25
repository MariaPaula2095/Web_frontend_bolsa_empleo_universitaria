import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { PerfilService } from '../../../core/services/perfil.service';
import { ArchivoService } from '../../../core/services/archivo.service';
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

  fotoUrl: string | null = null;
  tieneFoto = false;
  subiendoFoto = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private perfilService: PerfilService,
    private archivoService: ArchivoService
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
      this.cargarFoto();
    } else {
      this.cargando = false;
    }
  }

  private cargarPerfil(): void {
    this.perfilService.listar().subscribe({
      next: perfiles => {
        const mio = perfiles.find((p: any) => Number(p.idUsuario) === Number(this.idUsuario));
        if (mio) { this.perfilExistente = mio; this.form.patchValue(mio); }
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  private cargarFoto(): void {
    this.archivoService.getFotoUsuario(this.idUsuario!).subscribe({
      next: blob => {
        if (blob.size > 0) {
          this.fotoUrl = URL.createObjectURL(blob);
          this.tieneFoto = true;
        }
      },
      error: () => { this.tieneFoto = false; }
    });
  }

  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.idUsuario) return;
    const archivo = input.files[0];
    this.subiendoFoto = true;

    const obs = this.tieneFoto
      ? this.archivoService.actualizarFotoUsuario(this.idUsuario, archivo)
      : this.archivoService.subirFotoUsuario(this.idUsuario, archivo);

    obs.subscribe({
      next: () => {
        this.subiendoFoto = false;
        this.cargarFoto();
      },
      error: () => { this.subiendoFoto = false; }
    });
  }

  get iniciales(): string {
    const sub = this.auth.getSub() ?? '';
    return sub.charAt(0).toUpperCase();
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
