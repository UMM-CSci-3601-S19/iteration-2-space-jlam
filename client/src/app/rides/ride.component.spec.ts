import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Ride} from './ride';
import {RideComponent} from './ride.component';
import {RideListService} from './ride-list.service';
import {Observable} from 'rxjs/Observable';
import {CustomModule} from "../custom.module";

describe('Ride component', () => {

  let rideComponent: RideComponent;
  let fixture: ComponentFixture<RideComponent>;

  let rideListServiceStub: {
    getRideById: (rideId: string) => Observable<Ride>
  };

  beforeEach(() => {
    // stub RideService for test purposes
    rideListServiceStub = {
      getRideById: (rideId: string) => Observable.of([
        {
          _id: "5c81bda753c4b4a118c67810",
          vehicle: "Ford Ranger",
          mileage: 33,
          condition: "Bad",
          start_location: "Morris",
          destination: "Hoehne , Minnesota",
        },
        {
          _id: "5c81bda7210745e5ed8c5bc8",
          vehicle: "Chevy Impala",
          mileage: 21,
          condition: "Bad",
          start_location: "Morris",
          destination: "Harrodsburg , Minnesota",
        },
        {
          _id: "5c81bda7883108823a6b5eea",
          vehicle: "Honda Civic",
          mileage: 20,
          condition: "Average",
          start_location: "Morris",
          destination: "Yorklyn , Minnesota",
        }
      ].find(ride => ride._id === rideId))
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [RideComponent],
      providers: [{provide: RideListService, useValue: rideListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RideComponent);
      rideComponent = fixture.componentInstance;
    });
  }));

  it('can retrieve Hoehne , Minnesota by ID', () => {
    rideComponent.setId("5c81bda753c4b4a118c67810");

    expect(rideComponent.ride._id).toBe("5c81bda753c4b4a118c67810");
    expect(rideComponent.ride).toBeDefined();
    expect(rideComponent.ride.vehicle).toBe('Ford Ranger');
    expect(rideComponent.ride.mileage).toBe(33);
    expect(rideComponent.ride.condition).toBe("Bad");
    expect(rideComponent.ride.start_location).toBe('Morris');
  });

  it('returns undefined for Santa', () => {
    rideComponent.setId('Santa');
    expect(rideComponent.ride).not.toBeDefined();
  });

});
