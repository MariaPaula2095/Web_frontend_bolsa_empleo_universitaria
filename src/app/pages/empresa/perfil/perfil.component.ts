import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { EmpresaService } from '../../../core/services/empresa.service';
import { ArchivoService } from '../../../core/services/archivo.service';
import { Empresa } from '../../../core/models/empresa.model';

@Component({
  selector: 'app-empresa-perfil',
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  form: FormGroup;
  idEmpresa: number | null = null;
  empresaExistente: Empresa | null = null;
  cargando = true;
  guardando = false;
  mensaje = '';
  esError = false;

  fotoUrl: string | null = null;
  tieneFoto = false;
  subiendoFoto = false;

  tieneDocumento = false;
  nombreDocumento = '';
  subiendoDoc = false;
  mensajeDoc = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private empresaService: EmpresaService,
    private archivoService: ArchivoService
  ) {
    this.form = this.fb.group({
      nombre: [''],
      sector: [''],
      descripcion: [''],
      telefono: [''],
      ciudad: ['']
    });
  }

  ngOnInit(): void {
    const id = this.auth.getId();
    if (id) {
      this.idEmpresa = Number(id);
      this.cargarEmpresa();
      this.cargarFoto();
      this.cargarDocumento();
    } else {
      this.cargando = false;
    }
  }

  private cargarEmpresa(): void {
    this.empresaService.listar().subscribe({
      next: empresas => {
        const email = this.auth.getSub();
        const mia = empresas.find(e => e.email?.toLowerCase() === email?.toLowerCase());
        if (mia) {
          this.empresaExistente = mia;
          this.idEmpresa = Number(mia.idEmpresa);
          this.form.patchValue(mia);
        }
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  private cargarFoto(): void {
    this.archivoService.getFotoEmpresa(this.idEmpresa!).subscribe({
      next: blob => {
        if (blob.size > 0) {
          this.fotoUrl = URL.createObjectURL(blob);
          this.tieneFoto = true;
        }
      },
      error: () => { this.tieneFoto = false; }
    });
  }

  private cargarDocumento(): void {
    this.archivoService.getDocumentoEmpresa(this.idEmpresa!).subscribe({
      next: blob => {
        if (blob.size > 0) {
          this.tieneDocumento = true;
          this.nombreDocumento = 'Documento NIT cargado';
        }
      },
      error: () => { this.tieneDocumento = false; }
    });
  }

  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.idEmpresa) return;
    const archivo = input.files[0];
    this.subiendoFoto = true;

    const obs = this.tieneFoto
      ? this.archivoService.actualizarFotoEmpresa(this.idEmpresa, archivo)
      : this.archivoService.subirFotoEmpresa(this.idEmpresa, archivo);

    obs.subscribe({
      next: () => { this.subiendoFoto = false; this.cargarFoto(); },
      error: () => { this.subiendoFoto = false; }
    });
  }

  onDocumentoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.idEmpresa) return;
    const archivo = input.files[0];
    this.subiendoDoc = true;
    this.mensajeDoc = '';

    const obs = this.tieneDocumento
      ? this.archivoService.actualizarDocumentoEmpresa(this.idEmpresa, archivo)
      : this.archivoService.subirDocumentoEmpresa(this.idEmpresa, archivo);

    obs.subscribe({
      next: () => {
        this.subiendoDoc = false;
        this.tieneDocumento = true;
        this.nombreDocumento = archivo.name;
        this.mensajeDoc = 'Documento cargado correctamente';
      },
      error: () => {
        this.subiendoDoc = false;
        this.mensajeDoc = 'Error al subir el documento';
      }
    });
  }

  verDocumento(): void {
    if (!this.idEmpresa) return;
    this.archivoService.getDocumentoEmpresa(this.idEmpresa).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: () => {}
    });
  }

  get iniciales(): string {
    return (this.auth.getSub() ?? 'E').charAt(0).toUpperCase();
  }

  guardar(): void {
    if (!this.empresaExistente?.idEmpresa) return;
    this.guardando = true;
    this.mensaje = '';

    this.empresaService.actualizar(this.empresaExistente.idEmpresa, this.form.value).subscribe({
      next: () => {
        this.mensaje = 'Perfil actualizado correctamente';
        this.esError = false;
        this.guardando = false;
      },
      error: () => {
        this.mensaje = 'Error al actualizar el perfil';
        this.esError = true;
        this.guardando = false;
      }
    });
  }
}
