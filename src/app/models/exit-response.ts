export interface ExitResponse {
  plate: string;
  type: 'CAR' | 'MOTORCYCLE';
  minutes: number;
  total: number;
}
