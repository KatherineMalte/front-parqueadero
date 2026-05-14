import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingService } from '../../services/parking.service';
import { ParkingRecord } from '../../models/parking-record';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-active-page',
  templateUrl: './active.page.html',
  styleUrls: ['./active.page.css']
})
export class ActivePage {
  activeRecords = signal<ParkingRecord[]>([]);
  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');
  loadingExit = signal(false);

  constructor(private parkingService: ParkingService) {
    this.parkingService.activeRecords.subscribe((records) => this.activeRecords.set(records));
    this.parkingService.loadActive().subscribe({});
  }

  registerExit(plate: string) {
    if (this.loadingExit()) {
      return;
    }

    this.loadingExit.set(true);
    this.parkingService.registerExit(plate).subscribe({
      next: () => {
        this.toastType.set('success');
        this.toastMessage.set(`Salida registrada para ${plate}`);
        this.loadingExit.set(false);
        setTimeout(() => this.toastMessage.set(''), 3000);
      },
      error: () => {
        this.toastType.set('error');
        this.toastMessage.set('No fue posible registrar la salida. Verifica la placa.');
        this.loadingExit.set(false);
      }
    });
  }
}
