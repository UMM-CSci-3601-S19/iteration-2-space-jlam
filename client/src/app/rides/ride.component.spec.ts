// import {ComponentFixture, TestBed, async} from '@angular/core/testing';
// import {Ride} from './ride';
// import {RideComponent} from './ride.component';
// import {RideListService} from './ride-list.service';
// import {Observable} from 'rxjs/Observable';
// import {CustomModule} from "../custom.module";
// import 'rxjs/add/observable/of';
//
// describe('Ride component', () => {
//
//   let rideComponent: RideComponent;
//   let fixture: ComponentFixture<RideComponent>;
//
//   let rideListServiceStub: {
//     getRideById: (rideId: string) => Observable<Ride>
//   };
//
//   beforeEach(() => {
//     // stub RideService for test purposes
//     rideListServiceStub = {
//       getRideById: (rideId: string) => Observable.of([
//         {
//           _id: "5c899e46a3a0f4fb8aa7fad0",
//           driver: "Mitchell",
//           riders: true,
//           vehicle: "Honda Civic",
//           mileage: 22,
//           condition: "Good",
//           start_location: "Morris",
//           destination: "Minneapolis",
//           hasDriver: true,
//           tags:"Sample tag",
//         },
//         {
//           _id: "5c899e468d0c7c2cedcccbc9",
//           driver: "Jayden",
//           riders: true,
//           vehicle: "Honda Accord",
//           mileage: 20,
//           condition: "good",
//           start_location: "Morris",
//           destination: "Minneapolis",
//           hasDriver: true,
//           tags:"Sample tag",
//         }
//         ,
//         {
//           _id: "5c899e46a3a0f4fb8aa7fad0",
//           driver: "Mitchell",
//           riders: true,
//           vehicle: "Honda Civic",
//           mileage: 22,
//           condition: "good",
//           start_location: "Morris",
//           destination: "Minneapolis",
//           hasDriver: true,
//           tags:"Sample tag",
//         }
//       ].find(ride => ride._id === rideId))
//     };
//
//     TestBed.configureTestingModule({
//       imports: [CustomModule],
//       declarations: [RideComponent],
//       providers: [{provide: RideListService, useValue: rideListServiceStub}]
//     });
//   });
//
//   beforeEach(async(() => {
//     TestBed.compileComponents().then(() => {
//       fixture = TestBed.createComponent(RideComponent);
//       rideComponent = fixture.componentInstance;
//     });
//   }));
//
//   it('can retrieve Hoehne , Minnesota by ID', () => {
//     rideComponent.setId("5c899e46a3a0f4fb8aa7fad0");
//
//     expect(rideComponent.ride._id).toBe("5c899e46a3a0f4fb8aa7fad0");
//     expect(rideComponent.ride).toBeDefined();
//     expect(rideComponent.ride.vehicle).toBe('Honda Civic');
//     expect(rideComponent.ride.mileage).toBe(22);
//     expect(rideComponent.ride.condition).toBe("Good");
//     expect(rideComponent.ride.start_location).toBe('Morris');
//   });
//
//
// });
