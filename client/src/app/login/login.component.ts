import {Component} from '@angular/core';
import {AppService} from "../app.service";
import {AppComponent} from "../app.component";

@Component({
  selector: 'login',
  styleUrls: ['./login.component.css'],
  templateUrl: 'login.component.html'
})
export class loginComponent {
  public text: string;


  constructor(public appService : AppService, public appComponent : AppComponent) {
    this.text = 'Test Text About Logging In';
  }
}
