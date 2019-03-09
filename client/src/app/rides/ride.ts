import {User} from "../users/user";

export interface Ride
{
  _id: String;
  driver: User;
  riders: [User];
  vehicle: String;
  mileage: number;
  condition: String;
  start_location: String;
  destination: String;
  route:[string, string];
  hasDriver: boolean;
  tags:[];
}
