import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';

import { ProfesionalService } from '../../../core/api/generated/profesional/profesional.service';
import { UsuarioService } from '../../../core/api/generated/usuario/usuario.service';
import { SesionService } from '../../../core/auth/sesion.service';
import type {
  PerfilProfesionalDTO,
  PerfilUsuarioDTO,
  ProfesionalSalidaDTO,
  UsuarioSalidaDTO,
} from '../../../core/api/generated/model';

/** Perfil del profesional: edita nombre + especialidad/bio/teléfono. */
@Component({
  selector: 'app-profesional-perfil',
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
      @if (cargando()) {
        <div class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Cargando datos de perfil...</p>
        </div>
      } @else {
        <mat-card>
          <mat-card-header>
            <mat-card-title>Datos personales y profesionales</mat-card-title>
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
              <mat-form-field>
                <mat-label>Especialidad</mat-label>
                <input matInput formControlName="especialidad" placeholder="Tu especialidad" />
                @if (form.get('especialidad')?.hasError('maxlength')) {
                  <mat-error>La especialidad no puede tener más de 100 caracteres</mat-error>
                }
              </mat-form-field>
              <mat-form-field>
                <mat-label>Biografía</mat-label>
                <textarea matInput formControlName="bio" placeholder="Cuéntanos sobre ti" rows="4"></textarea>
              </mat-form-field>
              <mat-form-field>
                <mat-label>Teléfono</mat-label>
                <input matInput formControlName="telefono" placeholder="Tu número de teléfono" />
                @if (form.get('telefono')?.hasError('maxlength')) {
                  <mat-error>El teléfono no puede tener más de 20 caracteres</mat-error>
                }
              </mat-form-field>
              <div class="acciones">
                <button mat-raised-button color="primary" [disabled]="!form.valid || guardando()">
                  @if (guardando()) {
                    <mat-spinner diameter="20"></mat-spinner>
                  }
                  Guardar Perfil
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
})
export class ProfesionalPerfil implements OnInit {
  private readonly profesionalApi = inject(ProfesionalService);
  private readonly usuarioApi = inject(UsuarioService);
  private readonly sesion = inject(SesionService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    especialidad: ['', [Validators.maxLength(100)]],
    bio: [''],
    telefono: ['', [Validators.maxLength(20)]],
  });

  guardando = signal(false);
  cargando = signal(true);

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.cargando.set(true);

    this.profesionalApi.obtenerMiProfesional().subscribe({
      next: (profesional: ProfesionalSalidaDTO) => {
        this.cargarFormulario(profesional);
        this.cargando.set(false);
      },
      error: (error: unknown) => {
        console.error('Error al cargar datos del profesional:', error);
        this.cargando.set(false);
        const usuario = this.sesion.usuario();
        if (usuario?.nombre) {
          this.form.patchValue({ nombre: usuario.nombre });
        }
      },
    });
  }

  private cargarFormulario(profesional: ProfesionalSalidaDTO): void {
    this.form.patchValue({
      nombre: profesional.usuario?.nombre ?? '',
      especialidad: profesional.especialidad ?? '',
      bio: profesional.bio ?? '',
      telefono: profesional.telefono ?? '',
    });
  }

  async guardar(): Promise<void> {
    if (!this.form.valid) return;

    this.guardando.set(true);
    const valores = this.form.getRawValue();

    const perfilProfesional: PerfilProfesionalDTO = {
      especialidad: valores.especialidad || undefined,
      bio: valores.bio || undefined,
      telefono: valores.telefono || undefined,
    };

    const perfilUsuario: PerfilUsuarioDTO = {
      nombre: valores.nombre || undefined,
    };

    try {
      const [usuarioActualizado] = await Promise.all([
        firstValueFrom(this.usuarioApi.actualizarMiPerfil(perfilUsuario)),
        firstValueFrom(this.profesionalApi.actualizarMiProfesional(perfilProfesional)),
      ]);

      this.guardando.set(false);
      
      if (usuarioActualizado) {
        this.sesion.guardarUsuario(usuarioActualizado as UsuarioSalidaDTO);
      }
      
      this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', { duration: 3000 });
    } catch (error) {
      this.guardando.set(false);
      console.error('Error al actualizar perfil:', error);
      this.snackBar.open('Error al actualizar el perfil', 'Cerrar', { duration: 3000 });
    }
  }
}