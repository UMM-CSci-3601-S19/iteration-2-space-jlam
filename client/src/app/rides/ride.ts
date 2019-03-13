export interface Ride
{
  _id: string;
  driver: string;
  riders: boolean;
  vehicle: string;
  mileage: number;
  condition: string;
  start_location: string;
  destination: string;
  hasDriver: boolean;
  tags:string;
}
