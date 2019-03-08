
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsModule, TooltipModule } from 'ngx-bootstrap';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BrowserModule } from '@angular/platform-browser';
import { SelectModule } from 'ng-select';
import { BsDatepickerModule, ModalModule, BsModalService } from 'ngx-bootstrap';
import { DataTableModule } from 'angular2-datatable';
import { AlertModule } from 'ngx-bootstrap';
import { NotificacionService } from '../../framework/services/mensaje.service';
import { IncapacidadComponent } from './incapacidad.component';
import { IncapacidadNuevoComponent } from './incapacidad-nuevo/incapacidad-nuevo.component';
import { ToastService } from '../../framework/services/toast.service';

const routes: Routes = [
    { path: 'incapacidad', component: IncapacidadComponent },
    { path: 'incapacidadnuevo', component: IncapacidadNuevoComponent },
    // { path: 'incapacidadnuevo/:id', component: IncapacidadNuevoComponent }

];

@NgModule({
    imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild(routes),
        BsDatepickerModule.forRoot(),
        TabsModule.forRoot(),
        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        AlertModule.forRoot(),
        SelectModule,
        DataTableModule,
        BrowserModule,
        TooltipModule.forRoot()
    ],
    declarations: [
        IncapacidadComponent,
        IncapacidadNuevoComponent,
    ],
    providers: [
        NotificacionService, BsModalService, ToastService
    ],
    exports: [
        RouterModule
    ]
})
export class IncapacidadModule {
}
