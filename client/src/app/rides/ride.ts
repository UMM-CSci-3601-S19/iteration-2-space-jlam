import {User} from "../users/user";

export interface Ride
{
  _id: string;
  driver: User;
  riders: [User];
  vehicle: string;
  mileage: number;
  condition: string;
  start_location: string;
  destination: string;
  route:[string, string];
  hasDriver: boolean;
  tags:string;
}
