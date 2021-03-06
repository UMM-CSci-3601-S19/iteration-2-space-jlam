// import {browser, element, by, promise, ElementFinder} from 'protractor';
// import {Key} from 'selenium-webdriver';
//
// export class UserPage {
//   navigateTo(): promise.Promise<any> {
//     return browser.get('/users');
//   }
//
//   // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
//   highlightElement(byObject) {
//     function setStyle(element, style) {
//       const previous = element.getAttribute('style');
//       element.setAttribute('style', style);
//       setTimeout(() => {
//         element.setAttribute('style', previous);
//       }, 50);
//       return 'highlighted';
//     }
//
//     return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
//   }
//
//   getUserTitle() {
//     const title = element(by.id('user-list-title')).getText();
//     this.highlightElement(by.id('user-list-title'));
//
//     return title;
//   }
//
//   typeAName(name: string) {
//     const input = element(by.id('userName'));
//     input.click();
//     input.sendKeys(name);
//   }
//
//   selectUpKey() {
//     browser.actions().sendKeys(Key.ARROW_UP).perform();
//   }
//
//   backspace() {
//     browser.actions().sendKeys(Key.BACK_SPACE).perform();
//   }
//
//   getVehicle(vehicle: string) {
//     const input = element(by.id('userVehicle'));
//     input.click();
//     input.sendKeys(vehicle);
//   }
//
//   getUserByPhone(phone: string) {
//     const input = element(by.id('userPhone'));
//     input.click();
//     input.sendKeys(phone);
//   }
//
//   getUniqueUser(name: string) {
//     const user = element(by.id(name)).getText();
//     this.highlightElement(by.id(name));
//
//     return user;
//   }
//
//   getUsers() {
//     return element.all(by.className('users'));
//   }
//
//   elementExistsWithId(idOfElement: string): promise.Promise<boolean> {
//     if (element(by.id(idOfElement)).isPresent()) {
//       this.highlightElement(by.id(idOfElement));
//     }
//     return element(by.id(idOfElement)).isPresent();
//   }
//
//   elementExistsWithCss(cssOfElement: string): promise.Promise<boolean> {
//     return element(by.css(cssOfElement)).isPresent();
//   }
//
//   click(idOfButton: string): promise.Promise<void> {
//     this.highlightElement(by.id(idOfButton));
//     return element(by.id(idOfButton)).click();
//   }
//
//   field(idOfField: string) {
//     return element(by.id(idOfField));
//   }
//
//   button(idOfButton: string) {
//     this.highlightElement(by.id(idOfButton));
//     return element(by.id(idOfButton));
//   }
//
//   getTextFromField(idOfField: string) {
//     this.highlightElement(by.id(idOfField));
//     return element(by.id(idOfField)).getText();
//   }
//
// }
