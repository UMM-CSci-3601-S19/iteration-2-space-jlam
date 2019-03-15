import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import {AddRideComponent} from './add-ride.component';
import {CustomModule} from '../custom.module';
import {By} from "@angular/platform-browser";
import {NgForm} from "@angular/forms";

describe('Add ride component', () => {

  let addRideComponent: AddRideComponent;
  let calledClose: boolean;
  const mockMatDialogRef = {
    close() {
      calledClose = true;
    }
  };
  let fixture: ComponentFixture<AddRideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [AddRideComponent],
      providers: [
        {provide: MatDialogRef, useValue: mockMatDialogRef},
        {provide: MAT_DIALOG_DATA, useValue: null}
      ]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));




  beforeEach(() => {
    calledClose = false;
    fixture = TestBed.createComponent(AddRideComponent);
    addRideComponent = fixture.componentInstance;
  });

  it('should not allow a name to contain a symbol'); async(() => {
    let fixture = TestBed.createComponent(AddRideComponent);
    let debug = fixture.debugElement;
    let input = debug.query(By.css('[name=_id]'));

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      input.nativeElement.value = '_id';
      dispatchEvent(input.nativeElement);
      fixture.detectChanges();

      let form: NgForm = debug.children[0].injector.get(NgForm);
      let control = form.control.get('_id');
      expect(control.hasError('what goes here')).toBe(true);
      expect(form.control.valid).toEqual(false);
      expect(form.control.hasError('n#2', ['_id'])).toEqual(true);

    });
  });
});
