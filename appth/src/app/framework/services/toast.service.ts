

import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


/**
 * @author Milton Sanchez
 */
@Injectable()
export class ToastService {

    constructor(private toastr: ToastrService) { }

    showSuccess(head: string, body: string): void {
        setTimeout(() => this.toastr.success(body, head), 1);
    }

    showError(head: string, body: string): void {
        setTimeout(() => this.toastr.error(body, head), 1);
    }

    showWarning(head: string, body: string): void {
        setTimeout(() => this.toastr.warning(body, head), 1);
    }

    showInfo(body: string): void {
        setTimeout(() => this.toastr.info(body), 1);
    }

    showExample(): void {
        this.showSuccess('Mensaje', 'Success');
        this.showError('Mensaje', 'Error');
        this.showWarning('Mensaje', 'Warning');
        this.showInfo('Mensaje');

    }


}
