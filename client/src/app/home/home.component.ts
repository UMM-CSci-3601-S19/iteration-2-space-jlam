import {Component} from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html'
})
export class HomeComponent {
  public text: string;

  constructor() {
    this.text = 'Welcome To Morride';
  }
}
