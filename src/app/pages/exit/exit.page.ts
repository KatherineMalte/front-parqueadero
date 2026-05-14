import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParkingService } from '../../services/parking.service';
import { ExitResponse } from '../../models/exit-response';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-exit-page',
  templateUrl: './exit.page.html',
  styleUrls: ['./exit.page.css']
})
export class ExitPage {
  form = new FormGroup({
    plate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[A-Z0-9]{3,8}$/i)]
    })
  });

  modalVisible = signal(false);
  exitResult = signal<ExitResponse | null>(null);
  toastMessage = signal('');
  isSubmitting = signal(false);

  constructor(private parkingService: ParkingService) {}

  submit() {
    if (this.form.invalid) {
      this.toastMessage.set('Ingresa una placa válida.');
      return;
    }

    this.isSubmitting.set(true);
    const plate = this.form.controls.plate.value.toUpperCase().trim();

    this.parkingService.registerExit(plate).subscribe({
      next: (result) => {
        this.exitResult.set(result);
        this.modalVisible.set(true);
        this.isSubmitting.set(false);
        this.toastMessage.set('');
      },
      error: () => {
        this.isSubmitting.set(false);
        this.toastMessage.set('No se encontró un vehículo activo con esa placa.');
      }
    });
  }

  closeModal() {
    this.modalVisible.set(false);
    this.exitResult.set(null);
    this.form.reset({ plate: '' });
  }
}
