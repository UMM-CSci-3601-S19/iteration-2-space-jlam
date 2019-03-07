import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Ride} from './ride';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";
import {RideValidator} from "./ride.validator";

@Component({
  selector: 'add-ride.component',
  templateUrl: 'add-ride.component.html',
})
export class AddRideComponent implements OnInit {

  addRideForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { ride: Ride }, private fb: FormBuilder) {
  }

  // not sure if this vehicle is magical and making it be found or if I'm missing something,
  // but this is where the red text that shows up (when there is invalid input) comes from
  add_ride_validation_messages = {
    'vehicle': [
      {type: 'required', message: 'Vehicle is required'},
      {type: 'minlength', message: 'Vehicle must be at least 2 characters long'},
      {type: 'maxlength', message: 'Vehicle cannot be more than 25 characters long'},
      {type: 'pattern', message: 'Vehicle must contain only numbers and letters'},
      {type: 'existingVehicle', message: 'Vehicle has already been taken'}
    ],

    'mileage': [
      {type: 'pattern', message: 'Age must be a number'},
      {type: 'min', message: 'Age must be at least 15'},
      {type: 'max', message: 'Age may not be greater than 200'},
      {type: 'required', message: 'Age is required'}
    ],

    'start_location': [
      {type: 'email', message: 'Email must be formatted properly'}
    ]
  };

  createForms() {

    // add ride form validations
    this.addRideForm = this.fb.group({
      // We allow alphanumeric input and limit the length for vehicle.
      vehicle: new FormControl('vehicle', Validators.compose([
        RideValidator.validRide,
        Validators.minLength(2),
        Validators.maxLength(25),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
        Validators.required
      ])),

      // Since this is for a company, we need workers to be old enough to work, and probably not older than 200.
      mileage: new FormControl('age', Validators.compose([
        Validators.pattern('^[0-9]+[0-9]?'),
        Validators.min(15),
        Validators.max(200),
        Validators.required
      ])),

      // We don't care much about what is in the company field, so we just add it here as part of the form
      // without any particular validation.
      condition: new FormControl('condition'),

      // We don't need a special validator just for our app here, but there is a default one for email.
      start_location: new FormControl('start_location')
    })

  }

  ngOnInit() {
    this.createForms();
  }

}