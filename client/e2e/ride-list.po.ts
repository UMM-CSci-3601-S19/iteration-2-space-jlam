import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class RidePage {
  navigateTo(): promise.Promise<any> {
    return browser.get('/rides');
  }

  // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
  highlightElement(byObject) {
    function setStyle(element, style) {
      const previous = element.getAttribute('style');
      element.setAttribute('style', style);
      setTimeout(() => {
        element.setAttribute('style', previous);
      }, 200);
      return 'highlighted';
    }

    return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
  }

  getRideTitle() {
    const title = element(by.id('title1')).getText();
    this.highlightElement(by.id('title1'));

    return title;
  }

  typeADestination(destination: string) {
    const input = element(by.id('rideDestination'));
    input.click();
    input.sendKeys(destination);
  }

  selectUpKey() {
    browser.actions().sendKeys(Key.ARROW_UP).perform();
  }

  backspace() {
    browser.actions().sendKeys(Key.BACK_SPACE).perform();
  }

  getVehicle(vehicle: string) {
    const input = element(by.id('rideVehicle'));
    input.click();
    input.sendKeys(vehicle);
  }

  getRideByMileage() {
    const input = element(by.id('rideMileage'));
    input.click();
    input.sendKeys(Key.TAB);
  }

  getUniqueRide(vehicle: string) {
    const ride = element(by.id(vehicle)).getText();
    this.highlightElement(by.id(vehicle));

    return ride;
  }

  getRides() {
    return element.all(by.className('rides'));
  }

  elementExistsWithId(idOfElement: string): promise.Promise<boolean> {
    if (element(by.id(idOfElement)).isPresent()) {
      this.highlightElement(by.id(idOfElement));
    }
    return element(by.id(idOfElement)).isPresent();
  }

  elementExistsWithCss(cssOfElement: string): promise.Promise<boolean> {
    return element(by.css(cssOfElement)).isPresent();
  }

  click(idOfButton: string): promise.Promise<void> {
    this.highlightElement(by.id(idOfButton));
    return element(by.id(idOfButton)).click();
  }

  field(idOfField: string) {
    return element(by.id(idOfField));
  }

  button(idOfButton: string) {
    this.highlightElement(by.id(idOfButton));
    return element(by.id(idOfButton));
  }

  getTextFromField(idOfField: string) {
    this.highlightElement(by.id(idOfField));
    return element(by.id(idOfField)).getText();
  }

}
