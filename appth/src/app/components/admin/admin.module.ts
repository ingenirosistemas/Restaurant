
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArlComponent } from './arl/arl.component';
import { EpsComponent } from './eps/eps.component';
import { CargoComponent } from './cargo/cargo.component';
import { RouterModule, Routes } from '@angular/router';
import { DataTableModule } from 'angular2-datatable';
import { TabsModule } from 'ngx-bootstrap';
import { AccordionModule } from 'ngx-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { TipcontratoComponent } from './tipcontrato/tipcontrato.component';

const routes: Routes = [
    { path: 'arl', component: ArlComponent  },
    { path: 'cargo', component: CargoComponent  },
    { path: 'eps', component: EpsComponent  },
    { path: 'tipcontrato', component: TipcontratoComponent  },

  ];

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        DataTableModule,
        TabsModule.forRoot(),
        AccordionModule.forRoot(),
        BrowserModule
    ],
    declarations: [
    ArlComponent,
    EpsComponent,
    CargoComponent,
    TipcontratoComponent
    ],
    entryComponents: [],
    exports: [],
    providers: []
})

export class AdminModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AdminModule
        };
    }

}
