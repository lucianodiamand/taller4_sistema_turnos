import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { UsuarioService } from '../../../core/api/generated/usuario/usuario.service';
import { UsuarioEntradaDTO, UsuarioSalidaDTO, UsuarioEntradaDTORol } from '../../../core/api/generated/model';
import { AdminDataTableComponent } from '../../../shared/components/admin-data-table/admin-data-table';
import { AdminEntityFormComponent, AdminFieldConfig } from '../../../shared/components/admin-entity-form/admin-entity-form';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminDataTableComponent, AdminEntityFormComponent],
  templateUrl: './usuarios-admin.html',
})
export class UsuariosAdminComponent implements OnInit {
  protected items: UsuarioSalidaDTO[] = [];
  protected isLoading = false;
  protected showForm = false;
  protected editingId?: number;
  protected formModel: Record<string, any> = {};

  protected columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'rol', label: 'Rol' },
    { key: 'activo', label: 'Activo' },
  ];

  protected fields: AdminFieldConfig[] = [
    { key: 'nombre', label: 'Nombre', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'rol', label: 'Rol', type: 'select', required: true, options: [
      { label: 'Cliente', value: 'CLIENTE' },
      { label: 'Profesional', value: 'PROFESIONAL' },
      { label: 'Administrador', value: 'ADMIN' },
    ] },
    { key: 'activo', label: 'Activo', type: 'checkbox' },
  ];

  constructor(private readonly usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.load();
  }

  protected openEdit(item: UsuarioSalidaDTO): void {
    this.editingId = item.id;
    this.formModel = { nombre: item.nombre ?? '', email: item.email ?? '', rol: item.rol ?? 'CLIENTE', activo: item.activo ?? true };
    this.showForm = true;
  }

  protected onSubmit(model: Record<string, any>): void {
    if (this.editingId == null) {
      alert('No se pudo identificar el usuario a editar.');
      return;
    }

    const payload: UsuarioEntradaDTO = {
      nombre: String(model['nombre'] ?? ''),
      email: String(model['email'] ?? ''),
      rol: model['rol'] as UsuarioEntradaDTORol,
      activo: Boolean(model['activo']),
    };

    this.isLoading = true;
    this.usuarioService.actualizar(this.editingId, payload).pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: () => {
        this.showForm = false;
        this.load();
      },
      error: () => alert('No se pudo actualizar el usuario.'),
    });
  }

  protected onRemove(item: UsuarioSalidaDTO): void {
    if (!item.id || !confirm('¿Desea dar de baja lógica este usuario?')) {
      return;
    }

    const payload: UsuarioEntradaDTO = {
    nombre: item.nombre ?? '',
    email: item.email ?? '',
    rol: item.rol as UsuarioEntradaDTORol,
    activo: false, 
    };

    this.isLoading = true;
    this.usuarioService.actualizar(item.id, payload).pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: () => this.load(),
      error: () => alert('No se pudo dar de baja el usuario.'),
    });
  }

  private load(): void {
    this.isLoading = true;
    this.usuarioService.listar4().pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: (data: UsuarioSalidaDTO[] | undefined) => (this.items = data ?? []),
      error: () => alert('No se pudo cargar la lista de usuarios.'),
    });
  }
}
