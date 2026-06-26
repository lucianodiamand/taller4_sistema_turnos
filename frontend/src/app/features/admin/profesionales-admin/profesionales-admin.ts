import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ProfesionalService } from '../../../core/api/generated/profesional/profesional.service';
import { ProfesionalEntradaDTO, ProfesionalSalidaDTO, UsuarioEntradaDTORol, UsuarioEntradaDTO } from '../../../core/api/generated/model';
import { AdminDataTableComponent } from '../../../shared/components/admin-data-table/admin-data-table';
import { AdminEntityFormComponent, AdminFieldConfig } from '../../../shared/components/admin-entity-form/admin-entity-form';

@Component({
  selector: 'app-profesionales-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminDataTableComponent, AdminEntityFormComponent],
  templateUrl: './profesionales-admin.html',
})
export class ProfesionalesAdminComponent implements OnInit {
  protected items: ProfesionalSalidaDTO[] = [];
  protected isLoading = false;
  protected showForm = false;
  protected editingId?: number;
  protected formModel: Record<string, any> = {};

  protected columns = [
    { key: 'id', label: 'ID' },
    { key: 'usuario.nombre', label: 'Nombre' },
    { key: 'usuario.email', label: 'Email' },
    { key: 'especialidad', label: 'Especialidad' },
    { key: 'telefono', label: 'Teléfono' },
  ];

  protected fields: AdminFieldConfig[] = [
    { key: 'nombre', label: 'Nombre', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'password', label: 'Contraseña', type: 'password', required: true },
    { key: 'especialidad', label: 'Especialidad' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'bio', label: 'Bio', type: 'textarea' },
  ];

  constructor(private readonly profesionalService: ProfesionalService) {}

  ngOnInit(): void {
    this.load();
  }

  protected openCreate(): void {
    this.editingId = undefined;
    this.formModel = { nombre: '', email: '', password: '', especialidad: '', telefono: '', bio: '' };
    this.showForm = true;
  }

  protected openEdit(item: ProfesionalSalidaDTO): void {
    this.editingId = item.id;
    this.formModel = {
      nombre: item.usuario?.nombre ?? '',
      email: item.usuario?.email ?? '',
      password: '',
      especialidad: item.especialidad ?? '',
      telefono: item.telefono ?? '',
      bio: item.bio ?? '',
    };
    this.showForm = true;
  }

  protected onSubmit(model: Record<string, any>): void {
    const usuario: UsuarioEntradaDTO = {
      nombre: String(model['nombre'] ?? ''),
      email: String(model['email'] ?? ''),
      rol: 'PROFESIONAL' as UsuarioEntradaDTORol,
      activo: true,
    };

    const payload: ProfesionalEntradaDTO = {
      usuario,
      password: String(model['password'] ?? ''),
      especialidad: String(model['especialidad'] ?? ''),
      bio: String(model['bio'] ?? ''),
      telefono: String(model['telefono'] ?? ''),
    };

    this.isLoading = true;
    const request = this.editingId != null
      ? this.profesionalService.actualizar2(this.editingId, payload)
      : this.profesionalService.crear2(payload);

    request.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: () => {
        this.showForm = false;
        this.load();
      },
      error: () => alert('No se pudo guardar el profesional.'),
    });
  }

  protected onRemove(item: ProfesionalSalidaDTO): void {
    if (!item.id || !confirm('¿Desea eliminar este profesional?')) {
      return;
    }

    this.isLoading = true;
    this.profesionalService.eliminar2(item.id).pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: () => this.load(),
      error: () => alert('No se pudo eliminar el profesional.'),
    });
  }

  private load(): void {
    this.isLoading = true;
    this.profesionalService.listar2().pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: (data: ProfesionalSalidaDTO[] | undefined) => (this.items = data ?? []),
      error: () => alert('No se pudo cargar la lista de profesionales.'),
    });
  }
}
