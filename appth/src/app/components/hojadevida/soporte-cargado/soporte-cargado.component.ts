import { Component, OnInit, Input } from '@angular/core';
import { SoporteVO } from '../../../models/SoporteVO';
import { CrudService } from '../../../framework/services/crud.service';
import { UtilsGrid } from '../../../framework/util/utils-grid';
import { Constants } from '../../../framework/util/utils';
import { ToastService } from './../../../framework/services/toast.service';

@Component({
  selector: 'app-soporte-cargado',
  templateUrl: './soporte-cargado.component.html',
  styleUrls: ['./soporte-cargado.component.css']
})
export class SoporteCargadoComponent implements OnInit {

  @Input() listOfloadedSoportes: SoporteVO[] = [];

  constructor(public crudService: CrudService, public toastService: ToastService) { }

  ngOnInit() {
  }

  /**
   * @author Milton Sanchez
   * Allow dowload file
   */
  dowload(file) {
    this.crudService.dowloadFile(file);
  }

  /**
   * @author Milton Sanchez
   * Allow delete file
   */
  delete(det) {
    if (det == null) { return; }
    try {
      this.crudService.post(Constants.URL_HOJADEVIDA_DELETE_SOPORTE, det.id).then((data: any) => {
        this.toastService.showSuccess('Información', 'Registro eliminado correctamente');
      }, error => {
        console.log(`No se pudo borrar la informacion: ${error}`);
      });
      UtilsGrid.removeRowClick(this.listOfloadedSoportes, det);
      this.crudService.deleteFile(det.nombre);
    } catch (error) { }


  }




}
