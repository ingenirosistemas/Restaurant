import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
    selector: '[appCollapsetBox]'
})
export class CollapsetBoxDirective {

    @HostBinding('class.collapse') estaAbierto: boolean;

    constructor() {

        this.estaAbierto = false;

    }

    @HostListener('click') abrir() {
        // this.estaAbierto = true;
    }

}
