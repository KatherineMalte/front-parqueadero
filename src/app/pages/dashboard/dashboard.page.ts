import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingService } from '../../services/parking.service';
import { ParkingRecord } from '../../models/parking-record';
import { ExitResponse } from '../../models/exit-response';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css']
})
export class DashboardPage {
  activeRecords = signal<ParkingRecord[]>([]);
  exitHistory = signal<ExitResponse[]>([]);

  activeCount = computed(() => this.activeRecords().length);
  totalParkedToday = computed(() => this.activeRecords().length + this.exitHistory().length);
  incomeToday = computed(() => this.exitHistory().reduce((sum, item) => sum + item.total, 0));
  exitCount = computed(() => this.exitHistory().length);

  constructor(private parkingService: ParkingService) {
    this.parkingService.activeRecords.subscribe((records) => this.activeRecords.set(records));
    this.parkingService.exitHistory.subscribe((history) => this.exitHistory.set(history));
    this.parkingService.loadActive().subscribe({});
  }
}
