import { ToastService } from './../../framework/services/toast.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DinamizadoragestacionComponent } from './dinamizadoragestacion.component';
import { DinamizadoragestacionEdicionComponent } from './dinamizadoragestacion-edicion/dinamizadoragestacion-edicion.component';
import { BsDatepickerModule, TooltipModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap';
import { SelectModule } from 'ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { DataTableModule } from 'angular2-datatable';
import { NovedadesComponent } from './novedades/novedades.component';

const routes: Routes = [
    { path: 'dinamizadoragestacion', component: DinamizadoragestacionComponent },
    { path: 'dinamizadoragestacionedicion', component: DinamizadoragestacionEdicionComponent },
    { path: 'dinamizadoragestacionedicion/:id', component: DinamizadoragestacionEdicionComponent },
    { path: 'novedades/:id', component: NovedadesComponent }
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
        DinamizadoragestacionComponent,
        DinamizadoragestacionEdicionComponent,
        NovedadesComponent
    ],
    providers: [
        ToastService
    ],
    exports: [
        RouterModule
    ]
})
export class DinamizadoraGestacionModule {
}
