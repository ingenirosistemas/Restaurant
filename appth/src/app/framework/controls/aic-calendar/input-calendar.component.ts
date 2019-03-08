import { Component, Input, forwardRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'app-input-calendar',
  templateUrl: './input-calendar.component.html',
  styleUrls: ['./input-calendar.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCalendarComponent),
      multi: true
    }
  ]
})
export class InputCalendarComponent implements ControlValueAccessor {
  @Input() value = '';
  public _dt: Date;
  public minDate: Date;
  public maxDate: Date;
  public mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public visible = false;
  public inhabilitado = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  get val() {
    return this.value;
  }

  set val(val) {
    this.value = val;
    this.onChange(val);
    this.onTouched();
  }

  get dt() {
    return this._dt;
  }

  set dt(val) {
    if (isNaN(val.getTime())) {
      val = new Date();
    }
    this._dt = val;
    this.val = this.datePipe.transform(val, 'dd/MM/y');
  }

  constructor(private datePipe: DatePipe) {}

  onSelectedFecha() {
    this.visible = false;
  }

  public onClickCalendar() {
    if (this.value.trim() === '') {
      this._dt = new Date();
    }
    if (!this.visible) {
      this._dt = this.stringToDate(this.value);
    }
    this.visible = !this.visible;
  }

  stringToDate(date: string) {
    const dateParts = date.split('/');
    return new Date(
      parseInt(dateParts[2], 10),
      parseInt(dateParts[1], 10) - 1,
      parseInt(dateParts[0], 10)
    );
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
  }
}
