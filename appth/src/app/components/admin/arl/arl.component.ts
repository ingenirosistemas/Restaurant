import { Component, OnInit } from '@angular/core';
import { CrudService } from './../../../framework/services/crud.service';
import { Constants } from '../../../framework/util/utils';

@Component({
  selector: 'app-arl',
  templateUrl: './arl.component.html',
  styleUrls: ['./arl.component.css']
})
export class ArlComponent implements OnInit {

  listaArls: any[];

  public rowsOnPage = 5; // Paginacion


  constructor(

    private crudService: CrudService,

  ) {

    this.listaArls = [];

  }

  ngOnInit() {
     this.getArls();
  }


   /**
   * Metodo para cargar el listado de arls
   * @author Milton Sanchez
   */
  getArls(): void {
    this.crudService.post(Constants.URL_ARL_LISTA, {}).then((data: any) => {
      this.listaArls = data;
    }, error => {
      console.log(`No se pudo obtener la informacion de arls: ${error}`);
    });

  }


}
