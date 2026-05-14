import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParkingService } from '../../services/parking.service';
import { VehicleType } from '../../models/vehicle';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-entry-page',
  templateUrl: './entry.page.html',
  styleUrls: ['./entry.page.css']
})
export class EntryPage {
  form = new FormGroup({
    plate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[A-Z0-9]{3,8}$/i)]
    }),
    type: new FormControl<'CAR' | 'MOTORCYCLE'>('CAR', { nonNullable: true })
  });

  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');
  isSubmitting = signal(false);

  constructor(private parkingService: ParkingService) {}

  submit() {
    if (this.form.invalid) {
      this.toastType.set('error');
      this.toastMessage.set('Revisa los datos e intenta nuevamente.');
      return;
    }

    this.isSubmitting.set(true);
    const entry = this.form.value as { plate: string; type: VehicleType };
    const payload = { plate: entry.plate.toUpperCase().trim(), type: entry.type };

    this.parkingService.registerEntry(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.toastType.set('success');
        this.toastMessage.set('Vehículo registrado correctamente');
        this.form.reset({ plate: '', type: 'CAR' });
        setTimeout(() => this.toastMessage.set(''), 3200);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.toastType.set('error');
        this.toastMessage.set('No se pudo registrar el ingreso. Intenta de nuevo.');
      }
    });
  }
}
