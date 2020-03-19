import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ThingFormGroup } from '../thing/thing.component';

@Component({
  selector: 'app-form-array',
  templateUrl: './form-array.component.html',
  styleUrls: ['./form-array.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormArrayComponent implements OnDestroy {
  private internalFormArray: FormArray;
  @Input()
  set formArray(formArray: FormArray) {
    this.internalFormArray = formArray;

    if (this.subscriptions.formArrayChanges) {
      this.subscriptions.formArrayChanges.unsubscribe();
    }
    // this will work around the change detection on push limitations
    this.subscriptions.formArrayChanges = this.formArray.valueChanges.subscribe(
      result => {
        this.changeDetectorRef.detectChanges();
      }
    );
  }
  get formArray() {
    return this.internalFormArray;
  }

  @Output() add = new EventEmitter<FormArray>();

  private subscriptions: { [key: string]: Subscription } = {};

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {}

  ngOnDestroy() {
    Object.keys(this.subscriptions).forEach(sk =>
      this.subscriptions[sk].unsubscribe()
    );
  }

  remove(formGroup: FormGroup) {
    this.formArray.removeAt(this.formArray.controls.indexOf(formGroup));
  }
}
