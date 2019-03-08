import { ToastService } from './../../framework/services/toast.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LlegadatardeComponent } from './llegadatarde.component';
import { LlegadatardeEdicionComponent } from './llegadatarde-edicion/llegadatarde-edicion.component';
import { BsDatepickerModule, TimepickerModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap';
import { SelectModule } from 'ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { DataTableModule } from 'angular2-datatable';



const routes: Routes = [
    { path: 'llegadatarde', component: LlegadatardeComponent },
    { path: 'llegadatardeedicion', component: LlegadatardeEdicionComponent },
    { path: 'llegadatardeedicion/:id', component: LlegadatardeEdicionComponent }
];

@NgModule({
    imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild(routes),
        BsDatepickerModule.forRoot(),
        AccordionModule.forRoot(),
        TabsModule.forRoot(),
        SelectModule,
        BrowserModule,
        DataTableModule,
        TimepickerModule.forRoot()
    ],
    declarations: [
        LlegadatardeComponent,
        LlegadatardeEdicionComponent,

    ],
    providers: [
        ToastService
    ],
    exports: [
        RouterModule
    ]
})
export class LlegadatardeModule {
}
