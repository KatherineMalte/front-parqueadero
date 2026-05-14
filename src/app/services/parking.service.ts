import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ParkingRecord } from '../models/parking-record';
import { ExitResponse } from '../models/exit-response';
import { Vehicle } from '../models/vehicle';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  private readonly baseUrl = 'http://localhost:8080/api/parking';
  activeRecords = new BehaviorSubject<ParkingRecord[]>([]);
  exitHistory = new BehaviorSubject<ExitResponse[]>([]);
  loading = signal(false);

  constructor(private http: HttpClient) {}

  loadActive() {
    this.loading.set(true);
    return this.http.get<ParkingRecord[]>(`${this.baseUrl}/active`).pipe(
      tap((records) => {
        this.activeRecords.next(records);
        this.loading.set(false);
      }),
      tap({
        error: () => this.loading.set(false)
      })
    );
  }

  registerEntry(entry: Vehicle) {
    this.loading.set(true);
    return this.http.post(`${this.baseUrl}/entry`, entry, { responseType: 'text' }).pipe(
      tap(() => {
        this.loadActive().subscribe({ error: () => null });
        this.loading.set(false);
      }),
      tap({
        error: () => this.loading.set(false)
      })
    );
  }

  registerExit(plate: string) {
    this.loading.set(true);
    return this.http.post<ExitResponse>(`${this.baseUrl}/exit/${plate}`, {}).pipe(
      tap((response) => {
        this.exitHistory.next([...this.exitHistory.value, response]);
        this.loadActive().subscribe({ error: () => null });
        this.loading.set(false);
      }),
      tap({
        error: () => this.loading.set(false)
      })
    );
  }
}
