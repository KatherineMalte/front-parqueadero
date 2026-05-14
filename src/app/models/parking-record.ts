import { Vehicle } from './vehicle';

export interface ParkingRecord {
  id: number;
  vehicle: Vehicle;
  entryTime: string;
  status: 'ACTIVE' | 'EXITED' | string;
}
