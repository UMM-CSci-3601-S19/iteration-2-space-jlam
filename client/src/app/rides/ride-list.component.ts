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
  public rideStartLocation: string;
  public rideHasDriver: string;
  public rideTag: string;

  // The ID of the
  private highlightedID: string = '';

  // Inject the RideListService into this component.
  constructor(public rideListService: RideListService, public dialog: MatDialog) {

  }

  isHighlighted(ride: Ride): boolean {
    return ride._id['$oid'] === this.highlightedID;
  }

  // deleteRide(id : String): void {
  //   removeRideFromDatabase(id);
  // }

  openDialog(): void {
    const newRide: Ride = {_id: '', vehicle: '', mileage: 0, condition: '', start_location: '', destination: '', hasDriver: null,
                           driver: '', riders: null, tags: ''};
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


  openEditDialog(_id : string, vehicle : string, mileage : number, start_location : string,
                 destination : string, condition : string, hasDriver : boolean, driver : string, riders: boolean, tags : string): void {
    const oldRide: Ride = {_id: _id, vehicle: vehicle, mileage: mileage, condition: condition, start_location: start_location,
                           destination: destination, hasDriver: hasDriver, driver: driver, riders: riders, tags: tags};
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

  public filterRides(searchVehicle: string, searchMileage: number, searchDestination: string, searchStartLocation: string,
                     searchCondition: string, searchTag: string, searchHasDriver: string): Ride[] {

    this.filteredRides = this.rides;

    // Filter by vehicle
    if (searchVehicle != null) {
      searchVehicle = searchVehicle.toLocaleLowerCase().trim().replace(/\s+/g, " ");
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
      searchDestination = searchDestination.toLocaleLowerCase().trim().replace(/\s+/g, " ");
      this.filteredRides = this.filteredRides.filter(ride => {
        return !searchDestination || ride.destination.toLowerCase().indexOf(searchDestination) !== -1;
      });
    }

    // Filter by Start Location
    if (searchStartLocation != null) {
      searchStartLocation = searchStartLocation.toLocaleLowerCase().trim().replace(/\s+/g, " ");
      this.filteredRides = this.filteredRides.filter(ride => {
        return !searchStartLocation || ride.start_location.toLowerCase().indexOf(searchStartLocation) !== -1;
      });
    }

    // Filter by Conditionform validators for emoji angular
    if (searchCondition != null) {
      searchCondition = searchCondition.toLocaleLowerCase().trim().replace(/\s+/g, " ");
      this.filteredRides = this.filteredRides.filter(ride => {
        return !searchCondition || ride.condition.toLowerCase().indexOf(searchCondition) !== -1;
      });
    }

    // Filter by Tag
    if (searchTag != null) {
      searchTag = searchTag.toLocaleLowerCase().trim().replace(/\s+/g, " ");
      this.filteredRides = this.filteredRides.filter(ride => {
        return !searchTag || ride.tags.toLowerCase().indexOf(searchTag) !== -1;
      });
    }

    // Filter if it has a driver
    // if (searchHasDriver != null) {
    //   this.filteredRides = this.filteredRides.filter(ride => {
    //     return !searchTag || ride.hasDriver == searchHasDriver;
    //   });
    // }

    if (searchHasDriver != null) {
      searchHasDriver = searchHasDriver.toLocaleLowerCase();
      this.filteredRides = this.filteredRides.filter(ride => {
        if (searchHasDriver == 'yes') {
          return !searchHasDriver || ride.hasDriver == true;
        }
        if (searchHasDriver == 'no') {
          return !searchHasDriver || ride.hasDriver == false;
        }

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
        this.filterRides(this.rideVehicle, this.rideMileage, this.rideDestination, this.rideStartLocation, this.rideCondition, this.rideTag, this.rideHasDriver);
      },
      err => {
        console.log(err);
      });
    return rides;
  }

  loadService(): void {
    this.rideListService.getRides().subscribe(
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
    this.loadService();
    this.refreshRides();
  }
}
