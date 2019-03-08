
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContratosComponent } from './contratos.component';
import { ContratosDatosgeneralesComponent } from './contratos-datosgenerales/contratos-datosgenerales.component';
import { TabsModule } from 'ngx-bootstrap';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BrowserModule } from '@angular/platform-browser';
import { SelectModule } from 'ng-select';
import { BsDatepickerModule, ModalModule, BsModalService } from 'ngx-bootstrap';
import { DataTableModule } from 'angular2-datatable';
import { AlertModule } from 'ngx-bootstrap';
import { NotificacionService } from '../../framework/services/mensaje.service';
import { ToastService } from '../../framework/services/toast.service';
import { LoginGuard } from '../../framework/services/login-guard.service';
import { CKEditorModule } from 'ng2-ckeditor';
import { NovedadComponent } from './novedad/novedad.component';
import { OtrosiComponent } from './otrosi/otrosi.component';
import { EstudiosComponent } from './estudios/estudios.component';
import { ExperienciaComponent } from './experiencia/experiencia.component';
const routes: Routes = [
    { path: 'contratosdatosgenerales/:id', component: ContratosDatosgeneralesComponent  },
    { path: 'contratos', component: ContratosComponent  },
    { path: 'contratosdatosgenerales', component: ContratosDatosgeneralesComponent},
    { path: 'novedad/:id', component: NovedadComponent},
    { path: 'otrosi/:id', component: OtrosiComponent},
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
        CKEditorModule
    ],
    declarations: [
        ContratosComponent,
        ContratosDatosgeneralesComponent,
        NovedadComponent,
        OtrosiComponent,
        EstudiosComponent,
        ExperienciaComponent
    ],
    providers: [
        NotificacionService, BsModalService, ToastService
    ],
    exports: [
        RouterModule
    ]
})
export class ContratoModule {
}
