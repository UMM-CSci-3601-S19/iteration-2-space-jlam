import {RidesPage} from './ride-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

// This line (combined with the function that follows) is here for us
// to be able to see what happens (part of slowing things down)
// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/

const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function () {
  let args = arguments;

  // queue 100ms wait between test
  // This delay is only put here so that you can watch the browser do its thing.
  // If you're tired of it taking long you can remove this call or change the delay
  // to something smaller (even 0).
  origFn.call(browser.driver.controlFlow(), () => {
    return protractor.promise.delayed(20);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};


describe('Ride list', () => {
  let page: RidesPage;

  beforeEach(() => {
    page = new RidesPage();
  });

  it('should get and highlight Users title attribute ', () => {
    page.navigateTo();
    expect(page.getRidesTitle()).toEqual('Rides');
  });

  it('should type something in filter vehicle box and check that it returned correct element', () => {
    page.navigateTo();
    page.click("filter");
    page.typeADestination('Wee');
    expect(page.getUniqueRide('Weedville Minnesota')).toEqual('Weedville Minnesota');
    for (let i = 0; i < 4; i++) {
      page.backspace();
    }
    page.typeADestination('Cru');
    expect(page.getUniqueRide('Crucible Minnesota')).toEqual('Crucible Minnesota');
  });

  it('should click on the mileage 12 times and return 2 elements then ', () => {
    page.navigateTo();
    page.click("filter")
    page.getRideByMileage();
    for (let i = 0; i < 12; i++) {
      page.selectUpKey();
    }

    expect(page.getUniqueRide('Weedville Minnesota')).toEqual('Weedville Minnesota');
    expect(page.getUniqueRide('Hickory Minnesota')).toEqual('Hickory Minnesota');
  });

  it('Should open the expansion panel and get the vehicle', () => {
    page.navigateTo();
    page.click("filter");
    page.getVehicle('Ford');

    expect(page.getUniqueRide('Rockbridge Minnesota')).toEqual('Rockbridge Minnesota');

    // This is just to show that the panels can be opened
    for (let i = 0; i < 6; i++) {
      browser.actions().sendKeys(Key.TAB).perform();
    }
    browser.actions().sendKeys(Key.ENTER).perform();
  });

  it('Should allow us to filter rides based on destination', () => {
    page.navigateTo();
    page.click("filter");
    page.getDestination('os');
    page.getRides().then((rides) => {
      expect(rides.length).toBe(2);
    });
    expect(page.getUniqueRide('Nutrioso Minnesota')).toEqual('Nutrioso Minnesota');
    expect(page.getUniqueRide('Rose Minnesota')).toEqual('Rose Minnesota');
  });

  it('Should allow us to clear a search for destination and then still successfully search again', () => {
    page.navigateTo();
    page.click("filter");
    page.getDestination('mo');
    page.getRides().then((rides) => {
      expect(rides.length).toBe(2);
    });
    page.backspace();
    page.backspace();
    page.getRides().then((rides) => {
      expect(rides.length).toBe(50);
    });
    page.getDestination('ef');
    page.getRides().then((rides) => {
      expect(rides.length).toBe(1);
    });
  });

  it('Should allow us to search for destination, update that search string, and then still successfully search', () => {
    page.navigateTo();
    page.click("filter");
    page.getDestination('v');
    page.getRides().then((rides) => {
      expect(rides.length).toBe(9);
    });
    page.field('rideDestination').sendKeys('e');
    page.getRides().then((rides) => {
      expect(rides.length).toBe(2);
    });
  });

// For examples testing modal dialog related things, see:
// https://code.tutsplus.com/tutorials/getting-started-with-end-to-end-testing-in-angular-using-protractor--cms-29318
// https://github.com/blizzerand/angular-protractor-demo/tree/final

  it('Should have an add ride button', () => {
    page.navigateTo();
    expect(page.elementExistsWithId('addNewRide')).toBeTruthy();
  });

  it('Should open a dialog box when add ride button is clicked', () => {
    page.navigateTo();
    expect(page.elementExistsWithCss('add-ride')).toBeFalsy('There should not be a modal window yet');
    page.click('addNewRide');
    expect(page.elementExistsWithCss('add-ride')).toBeTruthy('There should be a modal window now');
  });

  describe('Add Ride', () => {

    beforeEach(() => {
      page.navigateTo();
      page.click('addNewRide');
    });

    it('Should actually add the ride with the information we put in the fields', () => {
      page.navigateTo();
      page.click('addNewRide');
      page.field('vehicleField').sendKeys('Chevy');
      page.field('mileageField').sendKeys('26');
      page.field('destinationField').sendKeys('Saint Cloud Minnesota');
      page.field('startField').sendKeys('Morris');
      page.field('tagsField').sendKeys('Fun');
      page.field('conditionField').sendKeys('Good');
      expect(page.button('confirmAddRideButton').isEnabled()).toBe(true);
      page.click('confirmAddRideButton');

      /*
       * This tells the browser to wait until the (new) element with ID
       * 'tracy@awesome.com' becomes present, or until 10,000ms whichever
       * comes first. This allows the test to wait for the server to respond,
       * and then for the client to display this new user.
       * http://www.protractortest.org/#/api?view=ProtractorExpectedConditions
       */
      const ride_element = element(by.id('Saint Cloud Minnesota'));
      browser.wait(protractor.ExpectedConditions.presenceOf(ride_element), 10000);

      expect(page.getUniqueRide('Saint Cloud Minnesota')).toMatch('Saint Cloud Minnesota'); // toEqual('Chevy');
    });

    describe('Add Ride (Validation)', () => {

      afterEach(() => {
        page.click('exitWithoutAddingButton');
      });

      it('Should allow us to put information into the fields of the add ride dialog', () => {
        expect(page.field('vehicleField').isPresent()).toBeTruthy('There should be a vehicle field');
        page.field('vehicleField').sendKeys('Chevy Impala');
        expect(element(by.id('mileageField')).isPresent()).toBeTruthy('There should be an mileage field');
        page.field('mileageField').sendKeys('24');
        expect(page.field('destinationField').isPresent()).toBeTruthy('There should be a destination field');
        page.field('destinationField').sendKeys('Saint Paul Minnesota');
        expect(page.field('conditionField').isPresent()).toBeTruthy('There should be a condition field');
        page.field('conditionField').sendKeys('Good');
      });

      it('Should show the validation error message about mileage being required', () => {
        expect(element(by.id('mileageField')).isPresent()).toBeTruthy('There should be an mileage field');
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        page.field('mileageField').click();
        //clicking somewhere else will make the error appear
        page.field('vehicleField').click();
        expect(page.getTextFromField('mileage-error')).toBe('Mileage must be at least 1');
      });

      it('Should show the validation error message about vehicle being required', () => {
        expect(element(by.id('vehicleField')).isPresent()).toBeTruthy('There should be a vehicle field');
        // '\b' is a backspace, so this enters an 'A' and removes it so this
        // field is "dirty", i.e., it's seen as having changed so the validation
        // tests are run.
        page.field('vehicleField').sendKeys('A\b');
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('mileageField').click();
        expect(page.getTextFromField('vehicle-error')).toBe('Vehicle is required');
      });

      it('Should show the validation error message about the format of vehicle', () => {
        expect(element(by.id('vehicleField')).isPresent()).toBeTruthy('There should be a vehicle field');
        page.field('vehicleField').sendKeys('Don@ld Jones');
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('mileageField').click();
        expect(page.getTextFromField('vehicle-error')).toBe('Vehicle must contain only numbers and letters');
      });
    });
  });
});
