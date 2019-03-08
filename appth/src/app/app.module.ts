import { DinamizadoraGestacionModule } from './components/dinamizadoragestacion/dinamizadoragestacion.module';
import { LlegadatardeModule } from './components/llegadatarde/llegadatarde.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MenuComponent } from './components/menu/menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { SettingComponent } from './components/setting/setting.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoComponent } from './components/demo/demo.component';
import { DataTableModule } from 'angular2-datatable';
import { CrudService } from './framework/services/crud.service';
import { SelectModule } from 'ng-select';
import { AicDatepickerComponent } from './framework/controls/aic-datepicker/aic-datepicker.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InputCalendarModule } from './framework/controls/aic-calendar/input-calendar.module';
import { InicioComponent } from './components/demo/inicio/inicio.component';
import { ChartsModule } from 'ng2-charts';
import { GrupoGeneroService } from './framework/services/grupogenero.service';
import { HojadevidaModule } from './components/hojadevida/hojadevida.module';
import { ContratoModule } from './components/contratos/contrato.module';
import { ExamenModule } from './components/examen/examen.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { IncapacidadModule } from './components/incapacidad/incapacidad.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PermisoModule } from './components/permiso/permiso.module';
import { CarouselModule } from 'ngx-bootstrap';
import { MingaService } from './framework/services/minga.service';
import { AdminModule } from './components/admin/admin.module';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    SettingComponent,
    DashboardComponent,
    DemoComponent,
    AicDatepickerComponent,
    InicioComponent,
    LoginComponent,



  ],
  imports: [
    AdminModule,
    IncapacidadModule,
    DinamizadoraGestacionModule,
    LlegadatardeModule,
    ChartsModule,
    InputCalendarModule,
    BrowserModule,
    HojadevidaModule,
    ContratoModule,
    ExamenModule,
    PermisoModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DataTableModule,
    SelectModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 2500,
      positionClass: 'toast-center-center',
      preventDuplicates: true,
    }),
    CarouselModule.forRoot()
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, CrudService, GrupoGeneroService, MingaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
