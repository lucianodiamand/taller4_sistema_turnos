import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ServicioService } from '../../../core/api/generated/servicio/servicio.service';
import { ServicioEntradaDTO, ServicioSalidaDTO } from '../../../core/api/generated/model';
import { AdminDataTableComponent } from '../../../shared/components/admin-data-table/admin-data-table';
import { AdminEntityFormComponent, AdminFieldConfig } from '../../../shared/components/admin-entity-form/admin-entity-form';

@Component({
  selector: 'app-servicios-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminDataTableComponent, AdminEntityFormComponent],
  templateUrl: './servicios-admin.html',
})
export class ServiciosAdminComponent implements OnInit {
  protected items: ServicioSalidaDTO[] = [];
  protected isLoading = false;
  protected showForm = false;
  protected editingId?: number;
  protected formModel: Record<string, any> = {};

  protected columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'duracionMin', label: 'Duración (min)' },
    { key: 'precio', label: 'Precio' },
  ];

  protected fields: AdminFieldConfig[] = [
    { key: 'nombre', label: 'Nombre', required: true },
    { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
    { key: 'duracionMin', label: 'Duración (min)', type: 'number', required: true },
    { key: 'precio', label: 'Precio', type: 'number', required: true },
  ];

  constructor(private readonly servicioService: ServicioService) {}

  ngOnInit(): void {
    this.load();
  }

  protected openCreate(): void {
    this.editingId = undefined;
    this.formModel = { nombre: '', descripcion: '', duracionMin: 30, precio: 0 };
    this.showForm = true;
  }

  protected openEdit(item: ServicioSalidaDTO): void {
    this.editingId = item.id;
    this.formModel = { ...item };
    this.showForm = true;
  }

  protected onSubmit(model: Record<string, any>): void {
    const payload: ServicioEntradaDTO = {
      nombre: String(model['nombre'] ?? ''),
      descripcion: String(model['descripcion'] ?? ''),
      duracionMin: Number(model['duracionMin'] ?? 0),
      precio: Number(model['precio'] ?? 0),
    };

    this.isLoading = true;
    const request = this.editingId != null
      ? this.servicioService.actualizar1(this.editingId, payload)
      : this.servicioService.crear1(payload);

    request.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: () => {
        this.showForm = false;
        this.load();
      },
      error: () => {
        alert('No se pudo guardar el servicio.');
      },
    });
  }

  protected onRemove(item: ServicioSalidaDTO): void {
    if (!item.id || !confirm('¿Desea dar de baja este servicio?')) {
      return;
    }

    this.isLoading = true;
    this.servicioService.eliminar1(item.id).pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: () => this.load(),
      error: () => alert('No se pudo eliminar el servicio.'),
    });
  }

  private load(): void {
    this.isLoading = true;
    this.servicioService.listar1().pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: (data: ServicioSalidaDTO[] | undefined) => (this.items = data ?? []),
      error: () => alert('No se pudo cargar la lista de servicios.'),
    });
  }
}
