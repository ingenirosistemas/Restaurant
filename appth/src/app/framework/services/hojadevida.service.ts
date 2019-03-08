
import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class HojadevidaService {



    @Output() datosHojadevidaEvent: EventEmitter<any> = new EventEmitter();

    public hojadevidaSeleccionada;

    constructor() {

        this.datosHojadevidaEvent = new EventEmitter();
    }


}
