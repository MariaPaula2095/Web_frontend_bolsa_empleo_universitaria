import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { OfertaLaboralService } from '../../../core/services/oferta-laboral.service';
import { OfertaLaboral } from '../../../core/models/oferta-laboral.model';

@Component({
  selector: 'app-empresa-ofertas',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './ofertas.component.html'
})
export class OfertasComponent implements OnInit {
  ofertasOriginales: OfertaLaboral[] = [];
  ofertasFiltradas: OfertaLaboral[] = [];
  cargando = true;
  mostrarForm = false;
  editando: OfertaLaboral | null = null;
  form: FormGroup;
  guardando = false;
  mensaje = '';

  busqueda = '';
  estadoFiltro = '';
  modalidadFiltro = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private ofertaService: OfertaLaboralService
  ) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
      area: [''],
      salario: [''],
      modalidad: ['PRESENCIAL'],
      fechaCierre: [''],
      estado: [true]
    });
  }

  ngOnInit(): void {
    this.cargarOfertas();
  }

  cargarOfertas(): void {
    const idEmpresa = Number(this.auth.getId());
    this.ofertaService.listar().subscribe({
      next: data => {
        this.ofertasOriginales = data.filter(o => Number((o as any).idEmpresa) === idEmpresa);
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  abrirForm(oferta?: OfertaLaboral): void {
    this.editando = oferta ?? null;
    this.form.reset({ modalidad: 'PRESENCIAL', estado: true });
    if (oferta) this.form.patchValue(oferta);
    this.mostrarForm = true;
    this.mensaje = '';
  }

  cerrarForm(): void { this.mostrarForm = false; this.editando = null; }

  guardar(): void {
    if (this.form.invalid) return;
    this.guardando = true;
    const idEmpresa = Number(this.auth.getId());
    const datos: OfertaLaboral = { ...this.form.value, idEmpresa };

    const obs = this.editando
      ? this.ofertaService.actualizar(this.editando.idOferta!, datos)
      : this.ofertaService.guardar(datos);

    obs.subscribe({
      next: () => {
        this.mensaje = this.editando ? 'Oferta actualizada' : 'Oferta publicada exitosamente';
        this.cerrarForm();
        this.cargarOfertas();
        this.guardando = false;
      },
      error: () => { this.mensaje = 'Error al guardar la oferta'; this.guardando = false; }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar esta oferta?')) return;
    this.ofertaService.eliminar(id).subscribe({ next: () => this.cargarOfertas() });
  }

  aplicarFiltros(): void {
    const q = this.busqueda.toLowerCase().trim();
    this.ofertasFiltradas = this.ofertasOriginales.filter(o => {
      const coincideTexto = !q || o.titulo?.toLowerCase().includes(q) || o.area?.toLowerCase().includes(q);
      const coincideEstado = !this.estadoFiltro ||
        (this.estadoFiltro === 'activa' ? o.estado === true : o.estado === false);
      const coincideModalidad = !this.modalidadFiltro || o.modalidad === this.modalidadFiltro;
      return coincideTexto && coincideEstado && coincideModalidad;
    });
  }

  modalidadClass(m?: string): string {
    if (m === 'REMOTO') return 'bg-green-100 text-green-800';
    if (m === 'PRESENCIAL') return 'bg-blue-100 text-blue-800';
    if (m === 'HIBRIDO') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-700';
  }
}