import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DatepickerModule } from 'ngx-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';

import { InputCalendarComponent } from './input-calendar.component';

@NgModule({
  declarations: [
    InputCalendarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TextMaskModule,
    DatepickerModule.forRoot(),
  ],
  exports: [ InputCalendarComponent ],
  providers: [
    DatePipe,
  ],
})
export class InputCalendarModule {}
