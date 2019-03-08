import { ExamenComponent } from './examen.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BsDatepickerModule, AccordionModule, TooltipModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap';
import { SelectModule } from 'ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { ExamenNuevoComponent } from './examen-nuevo/examen-nuevo.component';
import { DataTableModule } from 'angular2-datatable';
import { ToastService } from '../../framework/services/toast.service';
import { LoginGuard } from '../../framework/services/login-guard.service';


const routes: Routes = [
    { path: 'examennuevo/:id', component: ExamenNuevoComponent, canActivate: [LoginGuard] },
    { path: 'examen', component: ExamenComponent, canActivate: [LoginGuard] },
    { path: 'examennuevo', component: ExamenNuevoComponent, canActivate: [LoginGuard] }
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
        TooltipModule.forRoot(),
    ],
    declarations: [
        ExamenComponent,
        ExamenNuevoComponent,

    ],
    providers: [
        ToastService, LoginGuard
    ],
    exports: [
        RouterModule
    ]
})
export class ExamenModule {
}
