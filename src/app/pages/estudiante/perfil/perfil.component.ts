import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
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
    private usuarioService: UsuarioService,
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
      const email = this.auth.getSub();
      this.perfilService.listar().subscribe({
        next: perfiles => {
          const mio = this.encontrarMiPerfil(perfiles, email);
          if (mio) {
            const u = mio.usuario;
            const id = typeof u === 'number' ? u : (u?.idUsuario ?? u?.id ?? u?.userId);
            if (id) { this.idUsuario = Number(id); this.auth.storeId(Number(id)); }
            this.perfilExistente = mio;
            this.form.patchValue(mio);
          }
          this.cargando = false;
        },
        error: () => { this.cargando = false; }
      });
    }
  }

  private cargarPerfil(): void {
    const email = this.auth.getSub();
    this.perfilService.listar().subscribe({
      next: perfiles => {
        const mio = this.encontrarMiPerfil(perfiles, email);
        if (mio) { this.perfilExistente = mio; this.form.patchValue(mio); }
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  private encontrarMiPerfil(perfiles: any[], email: string | null): any {
    if (!perfiles.length) return null;
    const porEmail = perfiles.find((p: any) => {
      const u = p.usuario;
      if (!u || typeof u !== 'object') return false;
      return u.email === email || u.correo === email || u.username === email;
    });
    if (porEmail) return porEmail;
    const porId = perfiles.find((p: any) => {
      const u = p.usuario;
      if (typeof u === 'number') return u === this.idUsuario;
      if (typeof u === 'object') return (u?.idUsuario ?? u?.id) === this.idUsuario;
      return false;
    });
    if (porId) return porId;
    if (perfiles.length === 1) return perfiles[0];
    return null;
  }

  guardar(): void {
    if (!this.idUsuario) return;
    this.guardando = true;
    this.mensaje = '';
    const datos: Perfil = { ...this.form.value, usuario: { idUsuario: this.idUsuario } };

    const obs = this.perfilExistente
      ? this.perfilService.actualizar(this.perfilExistente.idPerfil!, datos)
      : this.perfilService.guardar(datos);

    obs.subscribe({
      next: () => {
        this.mensaje = 'Perfil guardado correctamente';
        this.esError = false;
        this.guardando = false;
      },
      error: () => {
        this.mensaje = 'Error al guardar el perfil';
        this.esError = true;
        this.guardando = false;
      }
    });
  }
}
