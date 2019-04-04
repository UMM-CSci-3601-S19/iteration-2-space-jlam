import {Component} from '@angular/core';

@Component({
  selector: 'profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css']
})
export class ProfileComponent {
  public text: string;
  public name: string;
  public phone: number;
  public email: string;
  public vehicle: string;
  public condition: string;
  public tags: string;

  constructor() {
    this.text = 'My Profile';
    this.name = 'Name';
    this.phone = 12135461;
    this.email = 'Email Address';
    this.vehicle = 'Vehicle';
    this.condition = 'Vehicle Condition';
    this.tags = 'I like cake';
  }
}
