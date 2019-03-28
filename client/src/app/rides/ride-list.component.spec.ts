import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Ride} from './ride';
import {RideListService} from './ride-list.service';

describe('Ride list service: ', () => {
  // A small collection of test rides
  const testRides: Ride[] = [
    {
      _id: "5c899e46a3a0f4fb8aa7fad0",
  driver: "Mitchell",
  riders: true,
  vehicle: "Honda Civic",
  mileage: 22,
  condition: "good",
  start_location: "Morris",
  destination: "Minneapolis",
  hasDriver: true,
  tags:"Sample tag",
},
  {
    _id: "5c899e468d0c7c2cedcccbc9",
    driver: "Jayden",
    riders: true,
    vehicle: "Honda Accord",
    mileage: 20,
    condition: "good",
    start_location: "Morris",
    destination: "Minneapolis",
    hasDriver: true,
    tags:"Sample tag",
  }
,
  {
    _id: "5c899e46a3a0f4fb8aa7fad0",
    driver: "Mitchell",
    riders: true,
    vehicle: "Honda Civic",
    mileage: 22,
    condition: "good",
    start_location: "Morris",
    destination: "Minneapolis",
    hasDriver: true,
    tags:"Sample tag",
  }
  ];
  const mRides: Ride[] = testRides.filter(ride =>
    ride.destination.toLowerCase().indexOf('H') !== -1
  );

  // We will need some url information from the rideListService to meaningfully test company filtering;
  let rideListService: RideListService;
  let currentlyImpossibleToGenerateSearchRideUrl: string;

  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    rideListService = new RideListService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getRides() calls api/rides', () => {
    // Assert that the rides we get from this call to getRides()
    // should be our set of test rides. Because we're subscribing
    // to the result of getRides(), this won't actually get
    // checked until the mocked HTTP request "returns" a response.
    // This happens when we call req.flush(testRides) a few lines
    // down.
    rideListService.getRides().subscribe(
      rides => expect(rides).toBe(testRides)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(rideListService.baseUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testRides);
  });


  //this test works even though it gives you an error under the word rides
  it('getRides(ridedest) adds appropriate param string to called URL', () => {
    rideListService.getRides('Minneapolis').subscribe(
      rides => expect(rides).toEqual(mRides)
    );

    const req = httpTestingController.expectOne(rideListService.baseUrl + '?destination=Minneapolis&');
    expect(req.request.method).toEqual('GET');
    req.flush(mRides);
  });

  it('filterByDestination(ridedestination) deals appropriately with a URL that already had a destination', () => {
    currentlyImpossibleToGenerateSearchRideUrl = rideListService.baseUrl + '?destination=Minneapolis&something=k&';
    rideListService['rideUrl'] = currentlyImpossibleToGenerateSearchRideUrl;
    rideListService.filterByDestination('Minneapolis');
    expect(rideListService['rideUrl']).toEqual(rideListService.baseUrl + '?something=k&destination=Minneapolis&');
  });


  // it('getRideById() calls api/rides/id', () => {
  //   const targetRide: Ride = testRides[1];
  //   const targetId = targetRide._id;
  //   rideListService.getRideById(targetId).subscribe(
  //     ride => expect(ride).toBe(targetRide)
  //   );
  //
  //   const expectedUrl: string = rideListService.baseUrl + '/' + targetId;
  //   const req = httpTestingController.expectOne(expectedUrl);
  //   expect(req.request.method).toEqual('GET');
  //   req.flush(targetRide);
  // });

  it('adding a ride calls api/rides/new', () => {
    const rideTest1_id = '5c899e46a3a0f4fb8aa7fad0';
    const newRide1: Ride =
      {
        _id: "5c899e46a3a0f4fb8aa7fad0",
        driver: "Mitchell",
        riders: true,
        vehicle: "Honda Civic",
        mileage: 22,
        condition: "good",
        start_location: "Morris",
        destination: "Minneapolis",
        hasDriver: true,
        tags:"Sample tag",
      };
    rideListService.addNewRide(newRide1).subscribe(
      id => {
        expect(id).toBe(rideTest1_id);
      }
    );

    const expectedUrl: string = rideListService.baseUrl + '/new';
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('POST');
    req.flush(rideTest1_id);
  });
});
