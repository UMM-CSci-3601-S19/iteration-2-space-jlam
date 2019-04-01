import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'login',
  styleUrls: ['./login.component.css'],
  templateUrl: 'login.component.html'
})
export class loginComponent {
  public text: string;

  constructor() {
    this.text = 'Test Text About Logging In';
  }
}
