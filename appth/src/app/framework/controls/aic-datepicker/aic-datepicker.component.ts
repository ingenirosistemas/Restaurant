import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-aic-datepicker',
  templateUrl: './aic-datepicker.component.html',
  styleUrls: ['./aic-datepicker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AicDatepickerComponent),
      multi: true
    }
  ]
})
export class AicDatepickerComponent implements OnInit, ControlValueAccessor {
  @Input() value = '';
  @Input() opcion: string;
  @Input('min') public min: any;
  @Input('max') public max: any;
  @Output() emision: EventEmitter<Date[]> = new EventEmitter<Date[]>();

  // minDate = new Date(2010, 1, 1);  // yyyy-MM-dd
  // maxDate = new Date();

  get val() {
    return this.value;
  }

  fecha: Date = new Date();
  bsRangeValue: Date[] = [new Date(), new Date()];


  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private _localeService: BsLocaleService) {

    defineLocale('es', esLocale);
    this._localeService.use('es');

  }

  ngOnInit(): void {
    if (this.min === undefined) {
      this.min = new Date(1900, 0, 1);
    }

    if (this.max === undefined) {
      this.max = new Date(2100, 11, 31);
    }
  }

  buscar() {
    // Si es fecha unica solo devuevlo el array con 1 elemento
    if (this.opcion === 'U') {
      // console.log(this.fecha);
      this.bsRangeValue = [];
      this.bsRangeValue.push(this.fecha);
    }
    this.emision.emit(this.bsRangeValue);
  }


  onValueChange(value: Date): void {
    this.buscar();
  }

  writeValue(value: any) {
    if (value) {

    }
  }


  registerOnChange(fn: any): void {

  }
  registerOnTouched(fn: any): void {

  }
  setDisabledState?(isDisabled: boolean): void {

  }



}
