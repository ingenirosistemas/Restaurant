import { LoginComponent } from './components/login/login.component';

// import { IncapacidadComponent } from './components/incapacidad/incapacidad.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DemoComponent } from './components/demo/demo.component';
import { InicioComponent } from './components/demo/inicio/inicio.component';

const appRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'demo', component: DemoComponent },
    { path: 'inicio', component: InicioComponent },
    // { path: 'incapacidad', component: IncapacidadComponent },
    { path: 'login', component: LoginComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {

}
