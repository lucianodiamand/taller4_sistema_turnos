import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UsuarioService } from '../../../core/api/generated/usuario/usuario.service';
import { SesionService } from '../../../core/auth/sesion.service';
import type { PerfilUsuarioDTO, UsuarioSalidaDTO } from '../../../core/api/generated/model';

/** Perfil del cliente: edita nombre. */
@Component({
  selector: 'app-cliente-perfil',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="perfil-page">
      <h1 class="perfil-page__title">Mi perfil</h1>
      <mat-card>
        <mat-card-header>
          <mat-card-title>Datos personales</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="guardar()">
            <mat-form-field>
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="nombre" placeholder="Tu nombre completo" />
              @if (form.get('nombre')?.hasError('required')) {
                <mat-error>El nombre es requerido</mat-error>
              }
              @if (form.get('nombre')?.hasError('maxlength')) {
                <mat-error>El nombre no puede tener más de 100 caracteres</mat-error>
              }
            </mat-form-field>
            <div class="acciones">
              <button mat-raised-button color="primary" [disabled]="!form.valid || guardando()">
                @if (guardando()) {
                  <mat-spinner diameter="20"></mat-spinner>
                }
                Guardar
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class ClientePerfil {
  private readonly usuarioApi = inject(UsuarioService);
  private readonly sesion = inject(SesionService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
  });

  guardando = signal(false);

  constructor() {
    // Cargar datos del usuario en sesión
    const usuario = this.sesion.usuario();
    if (usuario?.nombre) {
      this.form.patchValue({ nombre: usuario.nombre });
    }
  }

  guardar(): void {
    if (!this.form.valid) return;

    this.guardando.set(true);

    const perfil: PerfilUsuarioDTO = this.form.getRawValue();
    this.usuarioApi.actualizarMiPerfil(perfil).subscribe({
      next: (usuario: UsuarioSalidaDTO) => {
        this.guardando.set(false);
        this.sesion.guardarUsuario(usuario);
        this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', { duration: 3000 });
      },
      error: (error: unknown) => {
        this.guardando.set(false);
        console.error('Error al actualizar perfil:', error);
        this.snackBar.open('Error al actualizar el perfil', 'Cerrar', { duration: 3000 });
      },
    });
  }
}
