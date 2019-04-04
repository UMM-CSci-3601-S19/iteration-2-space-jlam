import {Component} from '@angular/core';

@Component({
  selector: 'profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css']
})
export class ProfileComponent {
  public text: string;

  constructor() {
    this.text = 'Your Profile';
  }
}
