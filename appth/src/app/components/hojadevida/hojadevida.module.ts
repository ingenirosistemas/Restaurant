
import { NotificacionService } from '../../framework/services/mensaje.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HojadevidaComponent } from './hojadevida.component';
import { HojadevidaEdicionComponent } from './hojadevida-edicion/hojadevida-edicion.component';
import { BsDatepickerModule, ModalModule, BsModalService } from 'ngx-bootstrap';
import { TabsModule, TooltipModule } from 'ngx-bootstrap';
import { SelectModule } from 'ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { DataTableModule } from 'angular2-datatable';
import { ConfirmModalComponent } from '../../framework/controls/confirm-modal/confirm-modal.component';
import { AlertModule } from 'ngx-bootstrap';
import { CollapsetBoxDirective } from '../../framework/directive/collapset-box.directive';
import { AccordionModule } from 'ngx-bootstrap';
import { LoginGuard } from '../../framework/services/login-guard.service';
import { LoginService } from '../../framework/services/login.service';
import { HojadevidaService } from '../../framework/services/hojadevida.service';
import { ToastService } from '../../framework/services/toast.service';
import { FileUploadModule } from 'ng2-file-upload';
import { CargaComponent } from '../carga/carga.component';
import { CargaFilesService } from '../../framework/services/carga-files.service';
import { NgDropFilesDirective } from '../../framework/directive/ng-drop-files.directive';
import { SoporteCargadoComponent } from './soporte-cargado/soporte-cargado.component';
import { SoporteCargaComponent } from './soporte-carga/soporte-carga.component';
import { NgDropButtonDirective } from '../../framework/directive/ng-drop-button.directive';

const routes: Routes = [
    { path: 'hojadevida', component: HojadevidaComponent, canActivate: [LoginGuard] },
    { path: 'hojadevidaedicion', component: HojadevidaEdicionComponent, canActivate: [LoginGuard] },
    { path: 'hojadevidaedicion/:id', component: HojadevidaEdicionComponent, canActivate: [LoginGuard] }
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
        DataTableModule,
        ModalModule.forRoot(),
        AlertModule.forRoot(),
        AccordionModule.forRoot(),
        TooltipModule.forRoot(),
        FileUploadModule
    ],
    declarations: [
        HojadevidaComponent,
        HojadevidaEdicionComponent,
        ConfirmModalComponent,
        CollapsetBoxDirective,
        CargaComponent,
        NgDropFilesDirective,
        SoporteCargaComponent,
        SoporteCargadoComponent,
        NgDropButtonDirective

    ],
    providers: [
        NotificacionService, BsModalService, LoginGuard, LoginService, HojadevidaService, ToastService, CargaFilesService
    ],
    exports: [
        RouterModule
    ]
})
export class HojadevidaModule {
}
