
import { NgModule, Component, ModuleWithProviders } from '@angular/core';
import { InputCalendarModule } from './aic-calendar/input-calendar.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        InputCalendarModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [

    ],
    entryComponents: [],
    exports: [],
    providers: []
})

export class ControlsModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ControlsModule
        };
    }

}
