import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {User} from './user';
import {UserListService} from './user-list.service';

describe('User list service: ', () => {
  // A small collection of test users
  const testUsers: User[] = [
    {
      _id: 'chris_id',
      name: 'Chris',
      email: 'chris@this.that',
      vehicle: 'Ford',
      phone: 3335555555
    },
    {
      _id: 'pat_id',
      name: 'Pat',
      vehicle: 'Chevy',
      email: 'pat@something.com',
      phone: 4445555555
    },
    {
      _id: 'jamie_id',
      name: 'Jamie',
      vehicle: 'Dodge',
      phone: 5555555555,
      email: 'jamie@frogs.com'
    }
  ];
  const mUsers: User[] = testUsers.filter(user =>
    user.vehicle.toLowerCase().indexOf('D') !== -1
  );

  // We will need some url information from the userListService to meaningfully test vehicle filtering;
  // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
  let userListService: UserListService;
  let currentlyImpossibleToGenerateSearchUserUrl: string;

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
    userListService = new UserListService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getUsers() calls api/users', () => {
    // Assert that the users we get from this call to getUsers()
    // should be our set of test users. Because we're subscribing
    // to the result of getUsers(), this won't actually get
    // checked until the mocked HTTP request "returns" a response.
    // This happens when we call req.flush(testUsers) a few lines
    // down.
    userListService.getUsers().subscribe(
      users => expect(users).toBe(testUsers)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(userListService.baseUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testUsers);
  });

  // it('getUsers(userVehicle) adds appropriate param string to called URL', () => {
  //   userListService.getUsers('D').subscribe(
  //     users => expect(users).toEqual(mUsers)
  //   );
  //
  //   const req = httpTestingController.expectOne(userListService.baseUrl + '?vehicles=D&');
  //   expect(req.request.method).toEqual('GET');
  //   req.flush(mUsers);
  // });

  it('filterByVehicle(userVehicle) deals appropriately with a URL that already had a vehicle', () => {
    currentlyImpossibleToGenerateSearchUserUrl = userListService.baseUrl + '?vehicle=f&something=k&';
    userListService['userUrl'] = currentlyImpossibleToGenerateSearchUserUrl;
    userListService.filterByVehicle('d');
    expect(userListService['userUrl']).toEqual(userListService.baseUrl + '?something=k&vehicle=d&');
  });

  it('filterByVehicle(userVehicle) deals appropriately with a URL that already had some filtering, but no vehicle', () => {
    currentlyImpossibleToGenerateSearchUserUrl = userListService.baseUrl + '?something=k&';
    userListService['userUrl'] = currentlyImpossibleToGenerateSearchUserUrl;
    userListService.filterByVehicle('f');
    expect(userListService['userUrl']).toEqual(userListService.baseUrl + '?something=k&vehicle=f&');
  });

  it('filterByVehicle(userVehicle) deals appropriately with a URL has the keyword vehicle, but nothing after the =', () => {
    currentlyImpossibleToGenerateSearchUserUrl = userListService.baseUrl + '?vehicle=&';
    userListService['userUrl'] = currentlyImpossibleToGenerateSearchUserUrl;
    userListService.filterByVehicle('');
    expect(userListService['userUrl']).toEqual(userListService.baseUrl + '');
  });

  it('getUserById() calls api/users/id', () => {
    const targetUser: User = testUsers[1];
    const targetId: string = targetUser._id;
    userListService.getUserById(targetId).subscribe(
      user => expect(user).toBe(targetUser)
    );

    const expectedUrl: string = userListService.baseUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetUser);
  });

  it('adding a user calls api/users/new', () => {
    const jesse_id = 'jesse_id';
    const newUser: User = {
      _id: 'jesse_id',
      name: 'Jesse',
      phone: 7275652387,
      vehicle: 'Smithsonian',
      email: 'jesse@stuff.com'
    };

    userListService.addNewUser(newUser).subscribe(
      id => {
        expect(id).toBe(jesse_id);
      }
    );

    const expectedUrl: string = userListService.baseUrl + '/new';
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('POST');
    req.flush(jesse_id);
  });
});
