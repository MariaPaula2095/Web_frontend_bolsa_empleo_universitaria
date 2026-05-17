import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { EmpresaService } from '../../../core/services/empresa.service';
import { OfertaLaboralService } from '../../../core/services/oferta-laboral.service';
import { OfertaLaboral } from '../../../core/models/oferta-laboral.model';
import { Empresa } from '../../../core/models/empresa.model';

@Component({
  selector: 'app-empresa-ofertas',
  imports: [ReactiveFormsModule],
  templateUrl: './ofertas.component.html'
})
export class OfertasComponent implements OnInit {
  ofertas: OfertaLaboral[] = [];
  empresa: Empresa | null = null;
  cargando = true;
  mostrarForm = false;
  editando: OfertaLaboral | null = null;
  form: FormGroup;
  guardando = false;
  mensaje = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private empresaService: EmpresaService,
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
    const email = this.auth.getSub();
    this.empresaService.listar().subscribe(empresas => {
      this.empresa = empresas.find(e => e.email?.toLowerCase() === email?.toLowerCase()) ?? null;
      this.cargarOfertas();
    });
  }

  cargarOfertas(): void {
    this.ofertaService.listar().subscribe({
      next: data => {
        const myId = Number(this.empresa?.idEmpresa);
        this.ofertas = data.filter(o => {
          const oid = Number(o.idEmpresa) || Number((o.empresa as any)?.idEmpresa);
          return oid === myId;
        });
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
    if (this.form.invalid || !this.empresa) return;
    this.guardando = true;
    const datos: OfertaLaboral = { ...this.form.value, empresa: { idEmpresa: this.empresa.idEmpresa } };

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

  modalidadClass(m?: string): string {
    if (m === 'REMOTO') return 'bg-green-100 text-green-800';
    if (m === 'PRESENCIAL') return 'bg-blue-100 text-blue-800';
    if (m === 'HIBRIDO') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-700';
  }
}
