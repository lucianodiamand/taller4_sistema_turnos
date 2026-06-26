import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface AdminFieldConfig {
  key: string;
  label: string;
  type?: 'text' | 'email' | 'number' | 'password' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string | number | boolean }>;
}

@Component({
  selector: 'app-admin-entity-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-entity-form.html',
})
export class AdminEntityFormComponent {
  @Input() title = 'Formulario';
  @Input() submitLabel = 'Guardar';
  @Input() cancelLabel = 'Cancelar';
  @Input() model: Record<string, any> = {};
  @Input() fields: AdminFieldConfig[] = [];

  @Output() submitForm = new EventEmitter<Record<string, any>>();
  @Output() cancelForm = new EventEmitter<void>();

  protected onSubmit(): void {
    this.submitForm.emit(this.model);
  }

  protected onCancel(): void {
    this.cancelForm.emit();
  }
}
