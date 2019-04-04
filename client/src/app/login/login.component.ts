import {Component, OnInit} from '@angular/core';
import {AppService} from "../app.service";

@Component({
  selector: 'login',
  styleUrls: ['./login.component.css'],
  templateUrl: 'login.component.html'
})
export class loginComponent {
  public text: string;


  constructor(private appService : AppService) {
    this.text = 'Test Text About Logging In';
  }
}
