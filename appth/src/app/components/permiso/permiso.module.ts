
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BsDatepickerModule, AccordionModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap';
import { SelectModule } from 'ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { DataTableModule } from 'angular2-datatable';
import { PermisoEdicionComponent } from './permiso-edicion/permiso-edicion.component';
import { PermisoComponent } from './permiso.component';
import { ToastService } from '../../framework/services/toast.service';
import { TimepickerModule } from 'ngx-bootstrap';
import { LoadingComponent } from '../../framework/controls/loading/loading.component';


const routes: Routes = [
    { path: 'permiso', component: PermisoComponent },
    { path: 'permisoedicion', component: PermisoEdicionComponent }
];

@NgModule({
    imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild(routes),
        BsDatepickerModule.forRoot(),
        TabsModule.forRoot(),
        SelectModule,
        BrowserModule,
        AccordionModule.forRoot(),
        DataTableModule,
        TimepickerModule.forRoot()
    ],
    declarations: [
        PermisoComponent,
        PermisoEdicionComponent,
        LoadingComponent,

    ],
    providers: [
        ToastService
    ],
    exports: [
        RouterModule
    ]
})
export class PermisoModule {
}
