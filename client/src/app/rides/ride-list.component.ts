import {Component, OnInit} from '@angular/core';
import {RideListService} from './ride-list.service';
import {Ride} from './ride';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AddRideComponent} from './add-ride.component';
import {EditRideComponent} from "./edit-ride.component";

@Component({
  selector: 'ride-list-component',
  templateUrl: 'ride-list.component.html',
  styleUrls: ['./ride-list.component.css'],
})

export class RideListComponent implements OnInit {
  // These are public so that tests can reference them (.spec.ts)
  public rides: Ride[];
  public filteredRides: Ride[];

  // These are the target values used in searching.
  // We should rename them to make that clearer.
  public rideVehicle: string;
  public rideMileage: number;
  public rideCondition: string;
  public rideDestination: string;

  // The ID of the
  private highlightedID: string = '';

  // Inject the RideListService into this component.
  constructor(public rideListService: RideListService, public dialog: MatDialog) {

  }

  isHighlighted(ride: Ride): boolean {
    return ride._id['$oid'] === this.highlightedID;
  }

  openDialog(): void {
    const newRide: Ride = {_id: '', vehicle: '', mileage: 0, condition: '', start_location: '', destination: ''};
    const dialogRef = this.dialog.open(AddRideComponent, {
      width: '500px',
      data: {ride: newRide}
    });

    dialogRef.afterClosed().subscribe(newRide => {
      if (newRide != null) {
        this.rideListService.addNewRide(newRide).subscribe(
          result => {
            this.highlightedID = result;
            this.refreshRides();
          },
          err => {
            // This should probably be turned into some sort of meaningful response.
            console.log('There was an error adding the ride.');
            console.log('The newRide or dialogResult was ' + newRide);
            console.log('The error was ' + JSON.stringify(err));
          });
      }
    });
  }

  openEditDialog(_id : String, vehicle : String, mileage : number, start_location : String, destination : String, condition : String): void {
    const oldRide: Ride = {_id: _id, vehicle: vehicle, mileage: mileage, condition: condition, start_location: start_location, destination: destination};
    const dialogRef = this.dialog.open(EditRideComponent, {
      width: '500px',
      data: {ride: oldRide}
    });

    dialogRef.afterClosed().subscribe(oldRide => {
      if (oldRide != null) {
        this.rideListService.addEditedRide(oldRide).subscribe(
          result => {
            this.highlightedID = result;
            this.refreshRides();
          },
          err => {
            // This should probably be turned into some sort of meaningful response.
            console.log('There was an error editing the ride.');
            console.log('The oldRide or dialogResult was ' + oldRide);
            console.log('The error was ' + JSON.stringify(err));
          });
      }
    });
  }

  public filterRides(searchVehicle: string, searchMileage: number, searchDestination: string): Ride[] {

    this.filteredRides = this.rides;

    // Filter by vehicle
    if (searchVehicle != null) {
      searchVehicle = searchVehicle.toLocaleLowerCase();
      this.filteredRides = this.filteredRides.filter(ride => {
        return !searchVehicle || ride.vehicle.toLowerCase().indexOf(searchVehicle) !== -1;
      });
    }

    // Filter by mileage
    if (searchMileage != null) {
      this.filteredRides = this.filteredRides.filter(ride => {
        return !searchMileage || ride.mileage == searchMileage;
      });
    }

    // Filter by destination
    if (searchDestination != null) {
      this.filteredRides = this.filteredRides.filter(ride => {
        return !searchDestination || ride.destination == searchDestination;
      });
    }

    return this.filteredRides;
  }

  /**
   * Starts an asynchronous operation to update the rides list
   *
   */
  refreshRides(): Observable<Ride[]> {
    // Get Rides returns an Observable, basically a "promise" that
    // we will get the data from the server.
    //
    // Subscribe waits until the data is fully downloaded, then
    // performs an action on it (the first lambda)

    const rides: Observable<Ride[]> = this.rideListService.getRides();
    rides.subscribe(
      rides => {
        this.rides = rides;
        this.filterRides(this.rideVehicle, this.rideMileage, this.rideDestination);
      },
      err => {
        console.log(err);
      });
    return rides;
  }

  loadService(): void {
    this.rideListService.getRides(this.rideCondition).subscribe(
      rides => {
        this.rides = rides;
        this.filteredRides = this.rides;
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.refreshRides();
    this.loadService();
  }
}
