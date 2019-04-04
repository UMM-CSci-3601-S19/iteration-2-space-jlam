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
      {type: 'pattern', message: 'Vehicle must not contain any unnecessary spaces or emojis'}
    ],

    'mileage': [
      {type: 'pattern', message: 'Mileage must be above zero'},
      {type: 'min', message: 'Mileage must be at least 1'},
      {type: 'max', message: 'Mileage may not be greater than 50000'},
      {type: 'required', message: 'Mileage is required'}
    ],

    'start_location': [
      {type: 'required', message: 'Location is required'},
      {type: 'minlength', message: 'The start location must not be shorter than 2 characters long'},
      {type: 'maxlength', message: 'The start location must not be longer than 50 characters long'},
      {type: 'pattern', message: 'The starting location of the ride must not contain any unnecessary spaces or emojis'}
    ],

    'destination': [
      {type: 'required', message: 'Destination is required'},
      {type: 'minlength', message: 'The destination must not be shorter than 2 characters long'},
      {type: 'maxlength', message: 'The destination must not be longer than 50 characters long'},
      {type: 'pattern', message: 'The destination of the ride must not contain any unnecessary spaces or emojis'}
    ],

    'condition': [
      {type: 'required', message: 'Condition is required'},
      {type: 'minlength', message: 'The condition of the vehicle must not be shorter than 2 characters long'},
      {type: 'maxlength', message: 'The condition of the vehicle must not be longer than 50 characters long'},
      {type: 'pattern', message: 'The condition of the vehicle must not contain any unnecessary spaces or emojis'}
    ],

    'tagging': [
      {type: 'minlength', message: 'The tag must not be shorter than 2 characters long'},
      {type: 'maxlength', message: 'The tag must not be longer than 50 characters long'},
      {type: 'pattern', message: 'The tag of the ride must not contain any unnecessary spaces or emojis'}
    ],

    'hasDriver': [
      {type: 'required', message: 'Having a Driver is required'},
      {type: 'pattern', message: 'Answer must not contain any unnecessary space or emojis'}
    ]
  };

  createForms() {

    // add ride form validations
    this.addRideForm = this.fb.group({
      // We allow all languages (might need to fix for emotes)
      vehicle: new FormControl('vehicle', Validators.compose([
        RideValidator.validRide,
        Validators.minLength(2),
        Validators.maxLength(25),
        Validators.pattern('^[\\w]+((\\s|[\\w]+))*$'),
        Validators.required
      ])),

      // mileage should be between 1 and 50000
      mileage: new FormControl('mileage', Validators.compose([
        Validators.pattern('^[0-9]+[0-9]?'),
        Validators.min(1),
        Validators.max(50000),
        Validators.required
      ])),

      // We don't care much about what is in the condition field, so we just add it here as part of the form
      // without any particular validation.
      condition: new FormControl('condition', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern('^[\\w]+((\\s|[\\w]+))*$'),
      ])),


      start_location: new FormControl('start_location', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern('^[\\w]+((\\s|[\\w]+))*$'),
      ])),

      destination: new FormControl('destination', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern('^[\\w]+((\\s|[\\w]+))*$'),
      ])),
      tagging: new FormControl('tagging', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern('^[\\w]+((\\s|[\\w]+))*$'),
      ])),
      hasDriver: new FormControl('hasDriver', Validators.compose([
        Validators.required,
        Validators.pattern('^[\\w]+((\\s|[\\w]+))*$')
      ]))
    })

  }

  ngOnInit() {
    this.createForms();
  }

}
